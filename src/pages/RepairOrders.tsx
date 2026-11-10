import { useEffect, useMemo, useState, type FormEvent } from 'react'
import {
  createRepairOrder,
  fetchCustomerList,
  fetchInspectionCountsByRepairOrder,
  fetchRepairOrders,
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

type Tab = 'assigned' | 'completed'
type Sort = 'oldest' | 'newest'

export function RepairOrders({ onNavigate }: { onNavigate: (view: View) => void }) {
  const [orders, setOrders] = useState<RepairOrder[]>([])
  const [countsByRo, setCountsByRo] = useState<Record<string, InspectionCounts>>({})
  const [customers, setCustomers] = useState<Customer[]>([])
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)

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
  const [laborRate, setLaborRate] = useState('120')
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
        // Inspection progress per order (marked / total items).
        const counts = await fetchInspectionCountsByRepairOrder()
        if (!cancelled) setCountsByRo(counts)
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

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setSaving(true)
    try {
      const created = await createRepairOrder({
        customer_id: customerId,
        vehicle_id: vehicleId,
        priority,
        concern: concern.trim(),
        technician: technician.trim(),
        bay: bay.trim(),
        labor_hours: Number(laborHours) || 0,
        labor_rate: Number(laborRate) || 0,
        parts_total: Number(partsTotal) || 0,
      })
      setShowForm(false)
      setConcern('')
      setTechnician('')
      setBay('')
      setLaborHours('1')
      setLaborRate('120')
      setPartsTotal('0')
      await loadOrders()
      onNavigate({ name: 'repair-order', id: created.id })
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <LoadingState message="Loading repair orders…" />

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-white">Orders</h1>
        <PrimaryButton
          onClick={() => setShowForm((v) => !v)}
          disabled={customers.length === 0}
        >
          {showForm ? 'Cancel' : 'New Repair Order'}
        </PrimaryButton>
      </div>

      <ErrorBanner message={error} />

      {customers.length === 0 && (
        <EmptyState message="No customers yet. Add a customer on the Customers page first, then create a repair order." />
      )}

      {showForm && customers.length > 0 && (
        <Card>
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
            <div className="md:col-span-2">
              <PrimaryButton type="submit" disabled={saving}>
                {saving ? 'Creating…' : 'Create Repair Order'}
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
              ? 'No assigned orders match. Create a repair order to get started.'
              : 'No completed orders yet. Orders move here when their work is marked complete.'
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {visibleOrders.map((ro) => {
            const counts = countsByRo[ro.id]
            const marked = counts ? counts.total - counts.unmarked : 0
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
                <div className="mt-3 border-t border-slate-800 pt-3">
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
