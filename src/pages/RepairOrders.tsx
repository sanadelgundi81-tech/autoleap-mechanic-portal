import { useEffect, useMemo, useState, type FormEvent } from 'react'
import {
  createOrderService,
  createRepairOrder,
  fetchCustomerList,
  fetchInspectionCountsByRepairOrder,
  fetchRepairOrders,
  fetchServiceCountsByRepairOrder,
  fetchVehiclesForCustomer,
} from '../lib/data'
import { formatDate, vehicleLabel } from '../lib/format'
import type { Customer, RepairOrder, Vehicle } from '../lib/types'
import {
  REPAIR_ORDER_PRIORITIES,
  REPAIR_ORDER_PRIORITY_LABELS,
  isRepairOrderWorkComplete,
  type InspectionCounts,
  type RepairOrderPriority,
  type ServiceCounts,
} from '../lib/types'
import {
  Card,
  EmptyState,
  ErrorBanner,
  Field,
  InspectionCountsRow,
  LoadingState,
  PrimaryButton,
  PriorityBadge,
  RepairOrderStatusBadge,
  inputClassName,
} from '../components/ui'
import type { View } from '../components/Layout'
import {
  DEFAULT_LABOR_RATE,
  ORDER_PRESETS,
  formatPresetHours,
  type OrderPreset,
} from '../lib/orderPresets'

/** One editable service line in the new-order form (preset orders). */
interface LineDraft {
  key: number
  name: string
  description: string
  laborHours: string
  laborRate: string
  partsTotal: string
}

let nextLineKey = 1

function blankLine(): LineDraft {
  return {
    key: nextLineKey++,
    name: '',
    description: '',
    laborHours: '1',
    laborRate: String(DEFAULT_LABOR_RATE),
    partsTotal: '0',
  }
}

function linesFromPreset(preset: OrderPreset): LineDraft[] {
  return preset.services.map((s) => ({
    key: nextLineKey++,
    name: s.name,
    description: s.description,
    laborHours: String(s.labor_hours),
    laborRate: String(s.labor_rate),
    partsTotal: String(s.parts_total),
  }))
}

type Tab = 'assigned' | 'completed'
type Sort = 'oldest' | 'newest'

export function RepairOrders({ onNavigate }: { onNavigate: (view: View) => void }) {
  const [orders, setOrders] = useState<RepairOrder[]>([])
  const [countsByRo, setCountsByRo] = useState<Record<string, InspectionCounts>>({})
  const [serviceCountsByRo, setServiceCountsByRo] = useState<Record<string, ServiceCounts>>(
    {},
  )
  const [customers, setCustomers] = useState<Customer[]>([])
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  /** The preset the form was opened from; null = blank order. */
  const [preset, setPreset] = useState<OrderPreset | null>(null)
  const [lines, setLines] = useState<LineDraft[]>([])

  const [tab, setTab] = useState<Tab>('assigned')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<Sort>('oldest')

  const [customerId, setCustomerId] = useState('')
  const [vehicleId, setVehicleId] = useState('')
  const [priority, setPriority] = useState<RepairOrderPriority>('medium')
  const [concern, setConcern] = useState('')
  const [technician, setTechnician] = useState('')
  const [bay, setBay] = useState('')
  const [laborHours, setLaborHours] = useState('1')
  const [laborRate, setLaborRate] = useState(String(DEFAULT_LABOR_RATE))
  const [partsTotal, setPartsTotal] = useState('0')

  async function loadOrders() {
    try {
      const data = await fetchRepairOrders()
      setOrders(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    }
  }

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const [ros, list] = await Promise.all([fetchRepairOrders(), fetchCustomerList()])
        if (cancelled) return
        setOrders(ros)
        setCustomers(list)
        // Inspection progress per order (marked / total items) and
        // service progress per order (done / total services).
        const [counts, serviceCounts] = await Promise.all([
          fetchInspectionCountsByRepairOrder(),
          fetchServiceCountsByRepairOrder(),
        ])
        if (cancelled) return
        setCountsByRo(counts)
        setServiceCountsByRo(serviceCounts)
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : String(err))
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [])

  const visibleOrders = useMemo(() => {
    const q = search.trim().toLowerCase()
    const filtered = orders.filter((ro) => {
      const isComplete = isRepairOrderWorkComplete(ro)
      if (tab === 'assigned' ? isComplete : !isComplete) return false
      if (!q) return true
      const haystack = [
        ro.ro_number,
        ro.customers?.name ?? '',
        vehicleLabel(ro.vehicles),
        ro.vehicles?.license_plate ?? '',
      ]
        .join(' ')
        .toLowerCase()
      return haystack.includes(q)
    })
    return [...filtered].sort((a, b) => {
      const diff =
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      return sort === 'oldest' ? diff : -diff
    })
  }, [orders, tab, search, sort])

  const assignedCount = orders.filter((ro) => !isRepairOrderWorkComplete(ro)).length
  const completedCount = orders.filter((ro) => isRepairOrderWorkComplete(ro)).length

  async function handleCustomerChange(id: string) {
    setCustomerId(id)
    setVehicleId('')
    if (!id) {
      setVehicles([])
      return
    }
    try {
      const list = await fetchVehiclesForCustomer(id)
      setVehicles(list)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    }
  }

  function resetForm() {
    setPreset(null)
    setLines([])
    setPriority('medium')
    setConcern('')
    setTechnician('')
    setBay('')
    setLaborHours('1')
    setLaborRate(String(DEFAULT_LABOR_RATE))
    setPartsTotal('0')
  }

  /** Opens the new-order form, prefilled from a preset (or empty for a blank order). */
  function openForm(from: OrderPreset | null) {
    resetForm()
    setError(null)
    if (from) {
      setPreset(from)
      setLines(linesFromPreset(from))
      setPriority(from.priority)
      setConcern(from.concern)
    }
    setShowForm(true)
  }

  function updateLine(key: number, patch: Partial<LineDraft>) {
    setLines((prev) => prev.map((l) => (l.key === key ? { ...l, ...patch } : l)))
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setSaving(true)
    const serviceLines = preset
      ? lines
          .filter((l) => l.name.trim())
          .map((l) => ({
            name: l.name.trim(),
            description: l.description.trim() || null,
            labor_hours: Number(l.laborHours) || 0,
            labor_rate: Number(l.laborRate) || 0,
            parts_total: Number(l.partsTotal) || 0,
          }))
      : []
    try {
      // Preset orders carry their work as service lines; the order-level
      // labour/parts fields hold the same totals so the no-services fallback
      // (estimatePrefill) still roughly matches if every service is removed.
      const created = await createRepairOrder({
        customer_id: customerId,
        vehicle_id: vehicleId,
        priority,
        concern: concern.trim(),
        technician: technician.trim(),
        bay: bay.trim(),
        ...(preset
          ? {
              labor_hours: serviceLines.reduce((sum, l) => sum + l.labor_hours, 0),
              labor_rate: serviceLines[0]?.labor_rate ?? DEFAULT_LABOR_RATE,
              parts_total: serviceLines.reduce((sum, l) => sum + l.parts_total, 0),
            }
          : {
              labor_hours: Number(laborHours) || 0,
              labor_rate: Number(laborRate) || 0,
              parts_total: Number(partsTotal) || 0,
            }),
      })
      // Sequential so service positions follow the preset's order.
      let added = 0
      try {
        for (const line of serviceLines) {
          await createOrderService({ repair_order_id: created.id, ...line })
          added++
        }
      } catch (err) {
        const reason = err instanceof Error ? err.message : String(err)
        setShowForm(false)
        resetForm()
        await loadOrders()
        setError(
          `Order ${created.ro_number} was created, but only ${added} of ${serviceLines.length} services were added (${reason}). Open the order to add the rest.`,
        )
        return
      }
      setShowForm(false)
      resetForm()
      await loadOrders()
      onNavigate({ name: 'repair-order', id: created.id })
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <LoadingState message="Loading orders…" />

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-white">Orders</h1>
        <PrimaryButton
          onClick={() => (showForm ? setShowForm(false) : openForm(null))}
          disabled={customers.length === 0}
        >
          {showForm ? 'Cancel' : 'New Order'}
        </PrimaryButton>
      </div>

      <ErrorBanner message={error} />

      {customers.length === 0 && (
        <EmptyState message="No customers yet. Add a customer on the Customers page first, then create an order." />
      )}

      {customers.length > 0 && !showForm && (
        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
            Start from a preset
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {ORDER_PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => openForm(p)}
                className="flex flex-col gap-1 rounded-xl border border-slate-800 bg-slate-900 p-3 text-left transition hover:border-blue-500"
              >
                <span className="text-sm font-bold text-white">{p.name}</span>
                <span className="text-xs text-slate-400">{p.description}</span>
                <span className="mt-auto pt-1 text-xs font-medium text-blue-400">
                  ~{formatPresetHours(p.estimated_hours)}
                </span>
              </button>
            ))}
            <button
              type="button"
              onClick={() => openForm(null)}
              className="flex flex-col gap-1 rounded-xl border border-dashed border-slate-700 bg-slate-900/40 p-3 text-left transition hover:border-blue-500"
            >
              <span className="text-sm font-bold text-white">Blank Order</span>
              <span className="text-xs text-slate-400">
                Start from an empty order and fill in the details yourself.
              </span>
            </button>
          </div>
        </section>
      )}

      {showForm && customers.length > 0 && (
        <Card>
          {preset && (
            <p className="mb-4 text-sm text-slate-300">
              Preset: <span className="font-semibold text-white">{preset.name}</span>{' '}
              <span className="text-slate-500">
                — every line below can be changed or removed.
              </span>
            </p>
          )}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="Customer">
              <select
                required
                value={customerId}
                onChange={(e) => void handleCustomerChange(e.target.value)}
                className={inputClassName}
              >
                <option value="">Select a customer…</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                    {c.phone ? ` — ${c.phone}` : ''}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Vehicle">
              <select
                required
                value={vehicleId}
                onChange={(e) => setVehicleId(e.target.value)}
                className={inputClassName}
                disabled={!customerId}
              >
                <option value="">
                  {customerId ? 'Select a vehicle…' : 'Select a customer first'}
                </option>
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {vehicleLabel(v)}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Priority">
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as RepairOrderPriority)}
                className={inputClassName}
              >
                {REPAIR_ORDER_PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {REPAIR_ORDER_PRIORITY_LABELS[p]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Bay">
              <input
                value={bay}
                onChange={(e) => setBay(e.target.value)}
                className={inputClassName}
                placeholder="e.g. Bay 1"
              />
            </Field>
            <div className="md:col-span-2">
              <Field label="Customer concern">
                <textarea
                  value={concern}
                  onChange={(e) => setConcern(e.target.value)}
                  className={inputClassName}
                  rows={2}
                  placeholder="What did the customer report?"
                />
              </Field>
            </div>
            <Field label="Technician">
              <input
                value={technician}
                onChange={(e) => setTechnician(e.target.value)}
                className={inputClassName}
                placeholder="e.g. Alex M."
              />
            </Field>
            {!preset && (
              <>
                <Field label="Labour hours">
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={laborHours}
                    onChange={(e) => setLaborHours(e.target.value)}
                    className={inputClassName}
                  />
                </Field>
                <Field label="Labour rate ($/hr)">
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={laborRate}
                    onChange={(e) => setLaborRate(e.target.value)}
                    className={inputClassName}
                  />
                </Field>
                <Field label="Parts total ($)">
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={partsTotal}
                    onChange={(e) => setPartsTotal(e.target.value)}
                    className={inputClassName}
                  />
                </Field>
              </>
            )}
            {preset && (
              <div className="flex flex-col gap-3 md:col-span-2">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
                  Services
                </h3>
                {lines.length === 0 && (
                  <p className="text-sm text-slate-500">
                    No services. Add one below, or create the order without services.
                  </p>
                )}
                {lines.map((line) => (
                  <div
                    key={line.key}
                    className="grid grid-cols-2 gap-3 rounded-lg border border-slate-800 bg-slate-950/40 p-3 md:grid-cols-[2fr_1fr_1fr_1fr_auto]"
                  >
                    <div className="col-span-2 md:col-span-1">
                      <Field label="Service">
                        <input
                          required
                          value={line.name}
                          onChange={(e) => updateLine(line.key, { name: e.target.value })}
                          className={inputClassName}
                          placeholder="e.g. Oil & filter change"
                        />
                      </Field>
                    </div>
                    <Field label="Hours">
                      <input
                        type="number"
                        min="0"
                        step="0.25"
                        value={line.laborHours}
                        onChange={(e) => updateLine(line.key, { laborHours: e.target.value })}
                        className={inputClassName}
                      />
                    </Field>
                    <Field label="Rate ($/hr)">
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={line.laborRate}
                        onChange={(e) => updateLine(line.key, { laborRate: e.target.value })}
                        className={inputClassName}
                      />
                    </Field>
                    <Field label="Parts ($)">
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={line.partsTotal}
                        onChange={(e) => updateLine(line.key, { partsTotal: e.target.value })}
                        className={inputClassName}
                      />
                    </Field>
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={() => setLines((prev) => prev.filter((l) => l.key !== line.key))}
                        className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 hover:border-rose-500 hover:text-rose-400"
                        aria-label={`Remove ${line.name || 'service'}`}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
                <div>
                  <button
                    type="button"
                    onClick={() => setLines((prev) => [...prev, blankLine()])}
                    className="rounded-lg border border-dashed border-slate-600 px-3 py-2 text-sm font-medium text-slate-300 hover:border-blue-500 hover:text-blue-400"
                  >
                    + Add service
                  </button>
                </div>
              </div>
            )}
            <div className="md:col-span-2">
              <PrimaryButton type="submit" disabled={saving}>
                {saving ? 'Creating…' : 'Create Order'}
              </PrimaryButton>
            </div>
          </form>
        </Card>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex rounded-lg border border-slate-700 bg-slate-900 p-1">
          <button
            onClick={() => setTab('assigned')}
            className={`rounded-md px-4 py-1.5 text-sm font-semibold ${
              tab === 'assigned' ? 'bg-blue-600 text-white' : 'text-slate-300'
            }`}
          >
            Assigned ({assignedCount})
          </button>
          <button
            onClick={() => setTab('completed')}
            className={`rounded-md px-4 py-1.5 text-sm font-semibold ${
              tab === 'completed' ? 'bg-blue-600 text-white' : 'text-slate-300'
            }`}
          >
            Completed ({completedCount})
          </button>
        </div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`${inputClassName} max-w-xs`}
          placeholder="Search vehicle or customer"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as Sort)}
          className={`${inputClassName} w-auto`}
          aria-label="Sort orders"
        >
          <option value="oldest">Oldest to newest</option>
          <option value="newest">Newest to oldest</option>
        </select>
      </div>

      {visibleOrders.length === 0 ? (
        <EmptyState
          message={
            tab === 'assigned'
              ? 'No assigned orders match. Create an order to get started.'
              : 'No completed orders yet. Orders move here when their work is marked complete.'
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {visibleOrders.map((ro) => {
            const counts = countsByRo[ro.id]
            const marked = counts ? counts.total - counts.unmarked : 0
            const serviceCounts = serviceCountsByRo[ro.id]
            return (
              <button
                key={ro.id}
                onClick={() => onNavigate({ name: 'repair-order', id: ro.id })}
                className="rounded-xl border border-slate-800 bg-slate-900 p-4 text-left transition hover:border-slate-600"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-white">{vehicleLabel(ro.vehicles)}</h3>
                    <p className="text-xs text-slate-400">
                      LP: {ro.vehicles?.license_plate ?? '—'}
                    </p>
                  </div>
                  <PriorityBadge priority={ro.priority} />
                </div>
                <p className="mt-2 text-sm text-slate-200">
                  {ro.ro_number} – {ro.customers?.name}{' '}
                  <span className="text-emerald-400" title="Customer on file">
                    ✓
                  </span>
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <RepairOrderStatusBadge status={ro.status} />
                  <span className="text-xs text-slate-400">
                    {ro.technician ?? 'Unassigned'}
                    {ro.bay ? ` · ${ro.bay}` : ''}
                  </span>
                </div>
                <div className="mt-3 flex flex-col gap-1.5 border-t border-slate-800 pt-3">
                  {serviceCounts && serviceCounts.total > 0 ? (
                    <span className="text-xs text-slate-300">
                      <span aria-hidden="true">🔧</span> Services {serviceCounts.done}/
                      {serviceCounts.total}
                    </span>
                  ) : (
                    <span className="text-xs text-slate-500">No services yet</span>
                  )}
                  {counts ? (
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs text-slate-300">
                        Inspection {marked}/{counts.total}
                      </span>
                      <InspectionCountsRow counts={counts} />
                    </div>
                  ) : (
                    <span className="text-xs text-slate-500">
                      No inspection started yet
                    </span>
                  )}
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  {formatDate(ro.created_at)}
                </p>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
