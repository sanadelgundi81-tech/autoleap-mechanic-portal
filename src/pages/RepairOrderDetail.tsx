import { useEffect, useState, type FormEvent } from 'react'
import {
  createEstimate,
  createInvoice,
  createOrderService,
  deleteEstimate,
  deleteInvoice,
  deleteOrderService,
  estimatePrefill,
  fetchRepairOrderDetail,
  fetchVehicleHistory,
  getOrCreateInspection,
  invoiceSubtotalPrefill,
  setRepairOrderWorkCompleted,
  updateEstimate,
  updateInvoice,
  updateOrderService,
  updateRepairOrderFields,
  updateRepairOrderStatus,
  type RepairOrderDetail,
} from '../lib/data'
import { formatDate, formatKm, money, vehicleLabel } from '../lib/format'
import {
  ESTIMATE_STATUS_LABELS,
  ESTIMATE_STATUS_TRANSITIONS,
  INVOICE_STATUS_LABELS,
  INVOICE_STATUS_TRANSITIONS,
  REPAIR_ORDER_STATUSES,
  REPAIR_ORDER_STATUS_LABELS,
  type Estimate,
  type EstimateStatus,
  type Invoice,
  type InvoiceStatus,
  type OrderService,
  type RepairOrder,
  type RepairOrderStatus,
} from '../lib/types'
import {
  Card,
  EmptyState,
  ErrorBanner,
  Field,
  InspectionCountsRow,
  InspectionStatusBadge,
  LoadingState,
  PrimaryButton,
  PriorityBadge,
  RepairOrderStatusBadge,
  SecondaryButton,
  inputClassName,
} from '../components/ui'
import type { View } from '../components/Layout'

type DetailTab = 'overview' | 'services'

export function RepairOrderDetailPage({
  id,
  onNavigate,
}: {
  id: string
  onNavigate: (view: View) => void
}) {
  const [detail, setDetail] = useState<RepairOrderDetail | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<DetailTab>('overview')
  const [status, setStatus] = useState<RepairOrderStatus>('estimate')
  const [savingStatus, setSavingStatus] = useState(false)
  const [savingWorkComplete, setSavingWorkComplete] = useState(false)

  const [odometer, setOdometer] = useState('')
  const [savingOdometer, setSavingOdometer] = useState(false)
  const [shopNotes, setShopNotes] = useState('')
  const [savingShopNotes, setSavingShopNotes] = useState(false)
  const [recommendations, setRecommendations] = useState('')
  const [savingRecommendations, setSavingRecommendations] = useState(false)
  const [startingInspection, setStartingInspection] = useState(false)

  const [showHistory, setShowHistory] = useState(false)
  const [history, setHistory] = useState<RepairOrder[]>([])
  const [loadingHistory, setLoadingHistory] = useState(false)

  async function load() {
    try {
      const data = await fetchRepairOrderDetail(id)
      setDetail(data)
      setStatus(data.repairOrder.status)
      setOdometer(
        data.repairOrder.odometer_km !== null
          ? String(data.repairOrder.odometer_km)
          : '',
      )
      setShopNotes(data.repairOrder.shop_notes ?? '')
      setRecommendations(data.repairOrder.customer_recommendations ?? '')
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    }
  }

  useEffect(() => {
    let cancelled = false
    async function loadOnce() {
      setLoading(true)
      try {
        const data = await fetchRepairOrderDetail(id)
        if (cancelled) return
        setDetail(data)
        setStatus(data.repairOrder.status)
        setOdometer(
          data.repairOrder.odometer_km !== null
            ? String(data.repairOrder.odometer_km)
            : '',
        )
        setShopNotes(data.repairOrder.shop_notes ?? '')
        setRecommendations(data.repairOrder.customer_recommendations ?? '')
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : String(err))
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void loadOnce()
    return () => {
      cancelled = true
    }
  }, [id])

  async function handleStatusChange() {
    if (!detail) return
    setError(null)
    setSavingStatus(true)
    try {
      await updateRepairOrderStatus(detail.repairOrder.id, status)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setSavingStatus(false)
    }
  }

  async function handleToggleWorkComplete() {
    if (!detail) return
    setError(null)
    setSavingWorkComplete(true)
    try {
      await setRepairOrderWorkCompleted(
        detail.repairOrder.id,
        detail.repairOrder.technician_completed_at === null,
      )
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setSavingWorkComplete(false)
    }
  }

  async function handleSaveOdometer(event: FormEvent) {
    event.preventDefault()
    if (!detail) return
    setError(null)
    setSavingOdometer(true)
    try {
      await updateRepairOrderFields(detail.repairOrder.id, {
        odometer_km: odometer === '' ? null : Number(odometer),
      })
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setSavingOdometer(false)
    }
  }

  async function handleSaveNotes(
    field: 'shop_notes' | 'customer_recommendations',
    value: string,
    setSaving: (v: boolean) => void,
  ) {
    if (!detail) return
    setError(null)
    setSaving(true)
    try {
      await updateRepairOrderFields(detail.repairOrder.id, {
        [field]: value.trim() === '' ? null : value.trim(),
      })
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setSaving(false)
    }
  }

  async function handleStartInspection() {
    if (!detail) return
    setError(null)
    setStartingInspection(true)
    try {
      const inspection = await getOrCreateInspection(
        detail.repairOrder.id,
        detail.repairOrder.technician,
      )
      onNavigate({
        name: 'inspection',
        inspectionId: inspection.id,
        repairOrderId: detail.repairOrder.id,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setStartingInspection(false)
    }
  }

  async function toggleHistory() {
    if (!detail) return
    if (showHistory) {
      setShowHistory(false)
      return
    }
    setLoadingHistory(true)
    try {
      const rows = await fetchVehicleHistory(
        detail.repairOrder.vehicle_id,
        detail.repairOrder.id,
      )
      setHistory(rows)
      setShowHistory(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoadingHistory(false)
    }
  }

  if (loading) return <LoadingState message="Loading repair order…" />
  if (!detail) return <ErrorBanner message={error ?? 'Repair order not found.'} />

  const { repairOrder: ro, inspectionSummary, services } = detail
  const currentStep = REPAIR_ORDER_STATUSES.indexOf(ro.status)
  const vehicle = ro.vehicles

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <SecondaryButton onClick={() => onNavigate({ name: 'repair-orders' })}>
          ← All Orders
        </SecondaryButton>
      </div>

      <ErrorBanner message={error} />

      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
              Order - {ro.ro_number}
            </span>
            <h2 className="text-2xl font-bold text-white">{vehicleLabel(vehicle)}</h2>
            <p className="mt-1 text-sm text-slate-400">
              {ro.concern ?? 'No customer concern recorded.'}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <PriorityBadge priority={ro.priority} />
            <RepairOrderStatusBadge status={ro.status} />
            <span className="text-xs text-slate-400">
              Customer: {ro.customers?.name}
            </span>
          </div>
        </div>

        <div className="mt-4 flex gap-1 rounded-lg border border-slate-700 bg-slate-900 p-1">
          <button
            onClick={() => setTab('overview')}
            className={`rounded-md px-4 py-1.5 text-sm font-semibold ${
              tab === 'overview' ? 'bg-blue-600 text-white' : 'text-slate-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setTab('services')}
            className={`rounded-md px-4 py-1.5 text-sm font-semibold ${
              tab === 'services' ? 'bg-blue-600 text-white' : 'text-slate-300'
            }`}
          >
            Services
          </button>
        </div>

        {tab === 'overview' ? (
          <div className="mt-4 flex flex-col gap-6">
            <div className="flex flex-wrap gap-1.5">
              {REPAIR_ORDER_STATUSES.map((s, index) => (
                <span
                  key={s}
                  className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${
                    index === currentStep
                      ? 'border-blue-500 bg-blue-600 text-white'
                      : index < currentStep
                        ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                        : 'border-slate-700 bg-slate-800 text-slate-400'
                  }`}
                >
                  {REPAIR_ORDER_STATUS_LABELS[s]}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-slate-300">Move to:</span>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as RepairOrderStatus)}
                className={`${inputClassName} w-auto`}
              >
                {REPAIR_ORDER_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {REPAIR_ORDER_STATUS_LABELS[s]}
                  </option>
                ))}
              </select>
              <PrimaryButton
                onClick={() => void handleStatusChange()}
                disabled={savingStatus || status === ro.status}
              >
                {savingStatus ? 'Updating…' : 'Update status'}
              </PrimaryButton>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-slate-300">
                Work:{' '}
                {ro.technician_completed_at
                  ? `Completed ${formatDate(ro.technician_completed_at)}`
                  : 'In progress'}
              </span>
              <PrimaryButton
                onClick={() => void handleToggleWorkComplete()}
                disabled={savingWorkComplete}
              >
                {savingWorkComplete
                  ? 'Updating…'
                  : ro.technician_completed_at
                    ? 'Reopen work'
                    : 'Mark work complete'}
              </PrimaryButton>
            </div>

            <form
              onSubmit={handleSaveOdometer}
              className="flex flex-wrap items-end gap-2"
            >
              <div className="w-64">
                <Field label="Enter RO Odometer reading (km)">
                  <input
                    type="number"
                    min="0"
                    value={odometer}
                    onChange={(e) => setOdometer(e.target.value)}
                    className={inputClassName}
                    placeholder="e.g. 48200"
                  />
                </Field>
              </div>
              <PrimaryButton type="submit" disabled={savingOdometer}>
                {savingOdometer ? 'Saving…' : 'Save odometer'}
              </PrimaryButton>
              {ro.odometer_km !== null && (
                <span className="pb-2 text-xs text-slate-400">
                  Saved: {formatKm(ro.odometer_km)}
                </span>
              )}
            </form>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-slate-700 bg-slate-800/60 p-4">
                <h3 className="text-sm font-bold text-white">Customer</h3>
                <p className="mt-2 font-semibold text-slate-100">{ro.customers?.name}</p>
                <p className="text-sm text-slate-300">{ro.customers?.phone ?? 'No phone'}</p>
                <p className="text-sm text-slate-300">
                  {ro.customers?.email ?? 'No Email'}
                </p>
              </div>
              <div className="rounded-lg border border-slate-700 bg-slate-800/60 p-4">
                <h3 className="text-sm font-bold text-white">Vehicle</h3>
                <p className="mt-2 font-semibold text-slate-100">
                  {vehicleLabel(vehicle)}
                </p>
                <dl className="mt-2 space-y-1 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-400">Transmission</dt>
                    <dd className="text-slate-200">{vehicle?.transmission ?? '—'}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-400">Mileage (KM)</dt>
                    <dd className="text-slate-200">{formatKm(vehicle?.mileage_km)}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-400">License Plate</dt>
                    <dd className="text-slate-200">{vehicle?.license_plate ?? '—'}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-400">VIN</dt>
                    <dd className="text-slate-200">{vehicle?.vin ?? '—'}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-400">Engine</dt>
                    <dd className="text-slate-200">{vehicle?.engine ?? '—'}</dd>
                  </div>
                </dl>
                <button
                  onClick={() => void toggleHistory()}
                  className="mt-3 text-sm font-semibold text-blue-400 hover:text-blue-300"
                >
                  {loadingHistory
                    ? 'Loading…'
                    : showHistory
                      ? 'Hide Vehicle History'
                      : 'View Vehicle History'}
                </button>
                {showHistory && (
                  <div className="mt-3 space-y-2 border-t border-slate-700 pt-3">
                    {history.length === 0 ? (
                      <p className="text-sm text-slate-400">
                        No prior orders for this vehicle.
                      </p>
                    ) : (
                      history.map((h) => (
                        <button
                          key={h.id}
                          onClick={() => onNavigate({ name: 'repair-order', id: h.id })}
                          className="block w-full rounded-lg border border-slate-700 bg-slate-800 p-2 text-left text-sm hover:border-slate-600"
                        >
                          <span className="font-semibold text-blue-400">{h.ro_number}</span>
                          <span className="text-slate-300"> · {formatDate(h.created_at)}</span>
                          <span className="ml-2">
                            <RepairOrderStatusBadge status={h.status} />
                          </span>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-lg border border-slate-700 bg-slate-800/60 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-sm font-bold text-white">Inspections</h3>
                {inspectionSummary.inspection && (
                  <InspectionStatusBadge status={inspectionSummary.inspection.status} />
                )}
              </div>
              {inspectionSummary.inspection && inspectionSummary.counts ? (
                <div className="mt-3">
                  <p className="font-semibold text-slate-100">
                    {inspectionSummary.inspection.inspection_templates?.name ??
                      'Comprehensive Inspection'}
                  </p>
                  <p className="text-xs text-slate-400">
                    Assigned to {inspectionSummary.inspection.assigned_to ?? 'Unassigned'}
                    {inspectionSummary.inspection.completed_at
                      ? ` · Completed ${formatDate(inspectionSummary.inspection.completed_at)}`
                      : ''}
                  </p>
                  <div className="mt-3">
                    <InspectionCountsRow counts={inspectionSummary.counts} />
                  </div>
                  <p className="mt-1 text-xs text-slate-400">
                    {inspectionSummary.counts.total - inspectionSummary.counts.unmarked} of{' '}
                    {inspectionSummary.counts.total} items marked
                  </p>
                  <PrimaryButton
                    className="mt-3"
                    onClick={() =>
                      onNavigate({
                        name: 'inspection',
                        inspectionId: inspectionSummary.inspection!.id,
                        repairOrderId: ro.id,
                      })
                    }
                  >
                    Continue
                  </PrimaryButton>
                </div>
              ) : (
                <div className="mt-3">
                  <p className="text-sm text-slate-400">
                    No inspection started for this order yet.
                  </p>
                  <PrimaryButton
                    className="mt-3"
                    onClick={() => void handleStartInspection()}
                    disabled={startingInspection}
                  >
                    {startingInspection
                      ? 'Starting…'
                      : 'Start Comprehensive Inspection'}
                  </PrimaryButton>
                </div>
              )}
            </div>

            <details className="rounded-lg border border-slate-700 bg-slate-800/60 p-4">
              <summary className="cursor-pointer text-sm font-bold text-white">
                Specifications
              </summary>
              <p className="mt-1 text-xs text-slate-400">
                Often required specifications for this vehicle (from the stored
                vehicle record).
              </p>
              <dl className="mt-2 space-y-1 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-400">Engine</dt>
                  <dd className="text-slate-200">{vehicle?.engine ?? '—'}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-400">Transmission</dt>
                  <dd className="text-slate-200">{vehicle?.transmission ?? '—'}</dd>
                </div>
              </dl>
            </details>

            <div className="rounded-lg border border-slate-700 bg-slate-800/60 p-4">
              <h3 className="text-sm font-bold text-white">Shop notes (Internal)</h3>
              {ro.shop_notes ? (
                <p className="mt-2 whitespace-pre-wrap text-sm text-slate-200">
                  {ro.shop_notes}
                </p>
              ) : (
                <p className="mt-2 text-sm text-slate-500">No notes</p>
              )}
              <textarea
                value={shopNotes}
                onChange={(e) => setShopNotes(e.target.value)}
                className={`${inputClassName} mt-3`}
                rows={2}
                placeholder="Internal notes — not shown to the customer"
              />
              <PrimaryButton
                className="mt-2"
                onClick={() =>
                  void handleSaveNotes('shop_notes', shopNotes, setSavingShopNotes)
                }
                disabled={savingShopNotes}
              >
                {savingShopNotes ? 'Saving…' : 'Save shop notes'}
              </PrimaryButton>
            </div>

            <div className="rounded-lg border border-slate-700 bg-slate-800/60 p-4">
              <h3 className="text-sm font-bold text-white">
                Recommendations for Customer
              </h3>
              {ro.customer_recommendations ? (
                <p className="mt-2 whitespace-pre-wrap text-sm text-slate-200">
                  {ro.customer_recommendations}
                </p>
              ) : (
                <p className="mt-2 text-sm text-slate-500">No notes</p>
              )}
              <textarea
                value={recommendations}
                onChange={(e) => setRecommendations(e.target.value)}
                className={`${inputClassName} mt-3`}
                rows={2}
                placeholder="Recommendations to share with the customer"
              />
              <PrimaryButton
                className="mt-2"
                onClick={() =>
                  void handleSaveNotes(
                    'customer_recommendations',
                    recommendations,
                    setSavingRecommendations,
                  )
                }
                disabled={savingRecommendations}
              >
                {savingRecommendations ? 'Saving…' : 'Save recommendations'}
              </PrimaryButton>
            </div>
          </div>
        ) : (
          <ServicesTab
            repairOrderId={ro.id}
            services={services}
            onChanged={load}
            onError={setError}
          />
        )}
      </Card>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <EstimatesCard detail={detail} onChanged={load} onError={setError} />
        <InvoicesCard detail={detail} onChanged={load} onError={setError} />
      </div>
    </div>
  )
}

// ---------- Services tab ----------

interface ServiceFormValues {
  name: string
  description: string
  laborHours: string
  laborRate: string
  partsTotal: string
}

const EMPTY_SERVICE_FORM: ServiceFormValues = {
  name: '',
  description: '',
  laborHours: '0',
  laborRate: '0',
  partsTotal: '0',
}

function serviceToForm(service: OrderService): ServiceFormValues {
  return {
    name: service.name,
    description: service.description ?? '',
    laborHours: String(service.labor_hours),
    laborRate: String(service.labor_rate),
    partsTotal: String(service.parts_total),
  }
}

function formToFields(values: ServiceFormValues) {
  return {
    name: values.name.trim(),
    description: values.description.trim() === '' ? null : values.description.trim(),
    labor_hours: Number(values.laborHours) || 0,
    labor_rate: Number(values.laborRate) || 0,
    parts_total: Number(values.partsTotal) || 0,
  }
}

function serviceLabor(service: OrderService): number {
  return Number(service.labor_hours) * Number(service.labor_rate)
}

function ServicesTab({
  repairOrderId,
  services,
  onChanged,
  onError,
}: {
  repairOrderId: string
  services: OrderService[]
  onChanged: () => Promise<void>
  onError: (message: string | null) => void
}) {
  const [showAdd, setShowAdd] = useState(false)
  const [addValues, setAddValues] = useState<ServiceFormValues>(EMPTY_SERVICE_FORM)
  const [adding, setAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValues, setEditValues] = useState<ServiceFormValues>(EMPTY_SERVICE_FORM)
  const [busyId, setBusyId] = useState<string | null>(null)

  const done = services.filter((s) => s.is_done).length
  const laborTotal = services.reduce((sum, s) => sum + serviceLabor(s), 0)
  const partsTotal = services.reduce((sum, s) => sum + Number(s.parts_total), 0)

  /** Runs a change, then reloads the order detail so the counts update. */
  async function run(id: string | null, action: () => Promise<void>): Promise<boolean> {
    onError(null)
    setBusyId(id)
    try {
      await action()
      await onChanged()
      return true
    } catch (err) {
      onError(err instanceof Error ? err.message : String(err))
      return false
    } finally {
      setBusyId(null)
    }
  }

  async function handleAdd(event: FormEvent) {
    event.preventDefault()
    if (addValues.name.trim() === '') return
    setAdding(true)
    const ok = await run(null, async () => {
      await createOrderService({ repair_order_id: repairOrderId, ...formToFields(addValues) })
    })
    setAdding(false)
    if (ok) {
      setAddValues(EMPTY_SERVICE_FORM)
      setShowAdd(false)
    }
  }

  async function handleSaveEdit(event: FormEvent) {
    event.preventDefault()
    if (!editingId || editValues.name.trim() === '') return
    const id = editingId
    const ok = await run(id, () => updateOrderService(id, formToFields(editValues)))
    if (ok) setEditingId(null)
  }

  function handleToggleDone(service: OrderService) {
    void run(service.id, () => updateOrderService(service.id, { is_done: !service.is_done }))
  }

  function handleDelete(service: OrderService) {
    if (!window.confirm(`Delete service "${service.name}"?`)) return
    void run(service.id, () => deleteOrderService(service.id))
  }

  return (
    <div className="mt-4 flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-700 bg-slate-800/60 p-4">
        <div>
          <p className="text-sm font-bold text-white">
            <span aria-hidden="true">🔧</span> Services {done}/{services.length}
          </p>
          <p className="text-xs text-slate-400">
            Labour {money(laborTotal)} · Parts {money(partsTotal)} · Total{' '}
            {money(laborTotal + partsTotal)}
          </p>
        </div>
        <PrimaryButton onClick={() => setShowAdd((v) => !v)}>
          {showAdd ? 'Cancel' : 'Add service'}
        </PrimaryButton>
      </div>

      {showAdd && (
        <form
          onSubmit={handleAdd}
          className="rounded-lg border border-slate-700 bg-slate-800/60 p-4"
        >
          <ServiceFormFields values={addValues} onChange={setAddValues} />
          <PrimaryButton
            type="submit"
            className="mt-3"
            disabled={adding || addValues.name.trim() === ''}
          >
            {adding ? 'Adding…' : 'Save service'}
          </PrimaryButton>
        </form>
      )}

      {services.length === 0 ? (
        <EmptyState message="No services on this order yet. Use Add service to add the first one." />
      ) : (
        <div className="space-y-2">
          {services.map((service) =>
            editingId === service.id ? (
              <form
                key={service.id}
                onSubmit={handleSaveEdit}
                className="rounded-lg border border-blue-500/50 bg-slate-800/60 p-4"
              >
                <ServiceFormFields values={editValues} onChange={setEditValues} />
                <div className="mt-3 flex gap-2">
                  <PrimaryButton
                    type="submit"
                    disabled={busyId === service.id || editValues.name.trim() === ''}
                  >
                    {busyId === service.id ? 'Saving…' : 'Save'}
                  </PrimaryButton>
                  <SecondaryButton onClick={() => setEditingId(null)}>Cancel</SecondaryButton>
                </div>
              </form>
            ) : (
              <div
                key={service.id}
                className="flex flex-wrap items-start justify-between gap-3 rounded-lg border border-slate-700 bg-slate-800/60 p-4"
              >
                <div className="min-w-0 flex-1">
                  <p
                    className={`font-semibold ${
                      service.is_done ? 'text-slate-400 line-through' : 'text-slate-100'
                    }`}
                  >
                    {service.name}
                  </p>
                  {service.description && (
                    <p className="mt-0.5 whitespace-pre-wrap text-sm text-slate-400">
                      {service.description}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-slate-300">
                    Labour {Number(service.labor_hours)} h × {money(Number(service.labor_rate))}{' '}
                    = {money(serviceLabor(service))} · Parts{' '}
                    {money(Number(service.parts_total))}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handleToggleDone(service)}
                    disabled={busyId === service.id}
                    aria-pressed={service.is_done}
                    className={`rounded-full border px-3 py-1 text-xs font-semibold disabled:opacity-50 ${
                      service.is_done
                        ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                        : 'border-slate-600 bg-slate-800 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    {service.is_done ? '✓ Done' : 'Not done'}
                  </button>
                  <SecondaryButton
                    onClick={() => {
                      setEditingId(service.id)
                      setEditValues(serviceToForm(service))
                    }}
                    disabled={busyId === service.id}
                  >
                    Edit
                  </SecondaryButton>
                  <SecondaryButton
                    onClick={() => handleDelete(service)}
                    disabled={busyId === service.id}
                  >
                    Delete
                  </SecondaryButton>
                </div>
              </div>
            ),
          )}
        </div>
      )}
    </div>
  )
}

function ServiceFormFields({
  values,
  onChange,
}: {
  values: ServiceFormValues
  onChange: (values: ServiceFormValues) => void
}) {
  function set(key: keyof ServiceFormValues, value: string) {
    onChange({ ...values, [key]: value })
  }
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
      <div className="md:col-span-3">
        <Field label="Service name">
          <input
            required
            value={values.name}
            onChange={(e) => set('name', e.target.value)}
            className={inputClassName}
            placeholder="e.g. Brake pad replacement"
          />
        </Field>
      </div>
      <div className="md:col-span-3">
        <Field label="Description">
          <textarea
            value={values.description}
            onChange={(e) => set('description', e.target.value)}
            className={inputClassName}
            rows={2}
            placeholder="Optional details"
          />
        </Field>
      </div>
      <Field label="Labour hours">
        <input
          type="number"
          min="0"
          step="0.1"
          value={values.laborHours}
          onChange={(e) => set('laborHours', e.target.value)}
          className={inputClassName}
        />
      </Field>
      <Field label="Labour rate ($/hr)">
        <input
          type="number"
          min="0"
          step="0.01"
          value={values.laborRate}
          onChange={(e) => set('laborRate', e.target.value)}
          className={inputClassName}
        />
      </Field>
      <Field label="Parts total ($)">
        <input
          type="number"
          min="0"
          step="0.01"
          value={values.partsTotal}
          onChange={(e) => set('partsTotal', e.target.value)}
          className={inputClassName}
        />
      </Field>
    </div>
  )
}

// ---------- Estimates & invoices ----------
// Totals are computed (never typed): estimate = labour + parts + tax,
// invoice = subtotal + tax. Tax is an amount, not a rate.

/** Parses a money input; blank counts as 0, anything invalid as NaN (rejected by data.ts). */
function parseAmount(value: string): number {
  return value.trim() === '' ? 0 : Number(value)
}

function showAmount(value: number): string {
  return Number.isFinite(value) ? money(value) : '—'
}

const DOC_STATUS_CLASSES: Record<EstimateStatus | InvoiceStatus, string> = {
  draft: 'border-slate-600 bg-slate-800 text-slate-300',
  sent: 'border-blue-500/40 bg-blue-500/10 text-blue-400',
  approved: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400',
  paid: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400',
  declined: 'border-red-500/40 bg-red-500/10 text-red-400',
  void: 'border-red-500/40 bg-red-500/10 text-red-400',
}

function DocStatusBadge({
  status,
  label,
}: {
  status: EstimateStatus | InvoiceStatus
  label: string
}) {
  return (
    <span
      className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${DOC_STATUS_CLASSES[status]}`}
    >
      {label}
    </span>
  )
}

function MoneyField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <Field label={label}>
      <input
        type="number"
        min="0"
        step="0.01"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputClassName}
      />
    </Field>
  )
}

/** Shared change runner: clear the banner, do the change, reload the order. */
function useDocAction(
  onChanged: () => Promise<void>,
  onError: (message: string | null) => void,
) {
  const [busyId, setBusyId] = useState<string | null>(null)
  async function run(id: string, action: () => Promise<unknown>): Promise<boolean> {
    onError(null)
    setBusyId(id)
    try {
      await action()
      await onChanged()
      return true
    } catch (err) {
      onError(err instanceof Error ? err.message : String(err))
      return false
    } finally {
      setBusyId(null)
    }
  }
  return { busyId, run }
}

interface EstimateFormValues {
  labor: string
  parts: string
  tax: string
  notes: string
}

const ESTIMATE_ACTION_LABELS: Partial<Record<EstimateStatus, string>> = {
  sent: 'Send',
  approved: 'Approve',
  declined: 'Decline',
}

function EstimatesCard({
  detail,
  onChanged,
  onError,
}: {
  detail: RepairOrderDetail
  onChanged: () => Promise<void>
  onError: (message: string | null) => void
}) {
  const { busyId, run } = useDocAction(onChanged, onError)
  const [showCreate, setShowCreate] = useState(false)
  const [createValues, setCreateValues] = useState<EstimateFormValues>({
    labor: '0',
    parts: '0',
    tax: '0',
    notes: '',
  })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValues, setEditValues] = useState<EstimateFormValues>(createValues)

  function openCreate() {
    if (showCreate) {
      setShowCreate(false)
      return
    }
    const prefill = estimatePrefill(detail)
    setCreateValues({
      labor: prefill.labor.toFixed(2),
      parts: prefill.parts.toFixed(2),
      tax: '0',
      notes: '',
    })
    setShowCreate(true)
  }

  function toFields(values: EstimateFormValues) {
    return {
      labor_total: parseAmount(values.labor),
      parts_total: parseAmount(values.parts),
      tax: parseAmount(values.tax),
      notes: values.notes.trim() === '' ? null : values.notes.trim(),
    }
  }

  async function handleCreate(event: FormEvent) {
    event.preventDefault()
    const ok = await run('new', () =>
      createEstimate({ repair_order_id: detail.repairOrder.id, ...toFields(createValues) }),
    )
    if (ok) setShowCreate(false)
  }

  async function handleSaveEdit(event: FormEvent) {
    event.preventDefault()
    if (!editingId) return
    const id = editingId
    const ok = await run(id, () => updateEstimate(id, toFields(editValues)))
    if (ok) setEditingId(null)
  }

  function handleStatus(estimate: Estimate, status: EstimateStatus) {
    if (status === 'declined' && !window.confirm('Decline this estimate? This cannot be undone.')) {
      return
    }
    void run(estimate.id, () => updateEstimate(estimate.id, { status }))
  }

  function handleDelete(estimate: Estimate) {
    if (!window.confirm('Delete this draft estimate?')) return
    void run(estimate.id, () => deleteEstimate(estimate.id))
  }

  return (
    <Card>
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="text-base font-bold text-white">Estimates</h3>
        <PrimaryButton onClick={openCreate}>
          {showCreate ? 'Cancel' : 'Create estimate'}
        </PrimaryButton>
      </div>

      {showCreate && (
        <form
          onSubmit={handleCreate}
          className="mb-3 rounded-lg border border-slate-700 bg-slate-800/60 p-4"
        >
          <EstimateFormFields values={createValues} onChange={setCreateValues} />
          <PrimaryButton type="submit" className="mt-3" disabled={busyId === 'new'}>
            {busyId === 'new' ? 'Saving…' : 'Save estimate'}
          </PrimaryButton>
        </form>
      )}

      {detail.estimates.length === 0 ? (
        <EmptyState message="No estimates yet. Use Create estimate to add one." />
      ) : (
        <div className="space-y-2">
          {detail.estimates.map((est) =>
            editingId === est.id ? (
              <form
                key={est.id}
                onSubmit={handleSaveEdit}
                className="rounded-lg border border-blue-500/50 bg-slate-800/60 p-4"
              >
                <EstimateFormFields values={editValues} onChange={setEditValues} />
                <div className="mt-3 flex gap-2">
                  <PrimaryButton type="submit" disabled={busyId === est.id}>
                    {busyId === est.id ? 'Saving…' : 'Save'}
                  </PrimaryButton>
                  <SecondaryButton onClick={() => setEditingId(null)}>Cancel</SecondaryButton>
                </div>
              </form>
            ) : (
              <div
                key={est.id}
                className="rounded-lg border border-slate-700 bg-slate-800/60 p-3 text-sm"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <DocStatusBadge status={est.status} label={ESTIMATE_STATUS_LABELS[est.status]} />
                    <span className="text-xs text-slate-400">{formatDate(est.created_at)}</span>
                  </div>
                  <span className="font-bold text-white">{money(Number(est.total))}</span>
                </div>
                <p className="mt-1 text-xs text-slate-300">
                  Labour {money(Number(est.labor_total))} + Parts{' '}
                  {money(Number(est.parts_total))} + Tax {money(Number(est.tax))}
                </p>
                {est.notes && (
                  <p className="mt-1 whitespace-pre-wrap text-xs text-slate-400">{est.notes}</p>
                )}
                <div className="mt-2 flex flex-wrap gap-2">
                  {ESTIMATE_STATUS_TRANSITIONS[est.status].map((next) => (
                    <SecondaryButton
                      key={next}
                      onClick={() => handleStatus(est, next)}
                      disabled={busyId === est.id}
                    >
                      {ESTIMATE_ACTION_LABELS[next]}
                    </SecondaryButton>
                  ))}
                  {est.status === 'draft' && (
                    <>
                      <SecondaryButton
                        onClick={() => {
                          setEditingId(est.id)
                          setEditValues({
                            labor: String(est.labor_total),
                            parts: String(est.parts_total),
                            tax: String(est.tax),
                            notes: est.notes ?? '',
                          })
                        }}
                        disabled={busyId === est.id}
                      >
                        Edit
                      </SecondaryButton>
                      <SecondaryButton
                        onClick={() => handleDelete(est)}
                        disabled={busyId === est.id}
                      >
                        Delete
                      </SecondaryButton>
                    </>
                  )}
                </div>
              </div>
            ),
          )}
        </div>
      )}
    </Card>
  )
}

function EstimateFormFields({
  values,
  onChange,
}: {
  values: EstimateFormValues
  onChange: (values: EstimateFormValues) => void
}) {
  const total = parseAmount(values.labor) + parseAmount(values.parts) + parseAmount(values.tax)
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <MoneyField
        label="Labour ($)"
        value={values.labor}
        onChange={(v) => onChange({ ...values, labor: v })}
      />
      <MoneyField
        label="Parts ($)"
        value={values.parts}
        onChange={(v) => onChange({ ...values, parts: v })}
      />
      <MoneyField
        label="Tax ($)"
        value={values.tax}
        onChange={(v) => onChange({ ...values, tax: v })}
      />
      <div className="sm:col-span-3">
        <Field label="Notes">
          <textarea
            value={values.notes}
            onChange={(e) => onChange({ ...values, notes: e.target.value })}
            className={inputClassName}
            rows={2}
            placeholder="Optional"
          />
        </Field>
      </div>
      <p className="text-sm text-slate-300 sm:col-span-3">
        Total (labour + parts + tax):{' '}
        <span className="font-bold text-white">{showAmount(total)}</span>
      </p>
    </div>
  )
}

interface InvoiceFormValues {
  subtotal: string
  tax: string
}

const INVOICE_ACTION_LABELS: Partial<Record<InvoiceStatus, string>> = {
  sent: 'Send',
  paid: 'Mark paid',
  void: 'Void',
}

function InvoicesCard({
  detail,
  onChanged,
  onError,
}: {
  detail: RepairOrderDetail
  onChanged: () => Promise<void>
  onError: (message: string | null) => void
}) {
  const { busyId, run } = useDocAction(onChanged, onError)
  const [showCreate, setShowCreate] = useState(false)
  const [createValues, setCreateValues] = useState<InvoiceFormValues>({
    subtotal: '0',
    tax: '0',
  })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValues, setEditValues] = useState<InvoiceFormValues>(createValues)

  function openCreate() {
    if (showCreate) {
      setShowCreate(false)
      return
    }
    setCreateValues({ subtotal: invoiceSubtotalPrefill(detail).toFixed(2), tax: '0' })
    setShowCreate(true)
  }

  async function handleCreate(event: FormEvent) {
    event.preventDefault()
    const ok = await run('new', () =>
      createInvoice({
        repair_order_id: detail.repairOrder.id,
        subtotal: parseAmount(createValues.subtotal),
        tax: parseAmount(createValues.tax),
      }),
    )
    if (ok) setShowCreate(false)
  }

  async function handleSaveEdit(event: FormEvent) {
    event.preventDefault()
    if (!editingId) return
    const id = editingId
    const ok = await run(id, () =>
      updateInvoice(id, {
        subtotal: parseAmount(editValues.subtotal),
        tax: parseAmount(editValues.tax),
      }),
    )
    if (ok) setEditingId(null)
  }

  function handleStatus(invoice: Invoice, status: InvoiceStatus) {
    if (
      status === 'void' &&
      !window.confirm(`Void ${invoice.invoice_number}? This cannot be undone.`)
    ) {
      return
    }
    void run(invoice.id, () => updateInvoice(invoice.id, { status }))
  }

  function handleDelete(invoice: Invoice) {
    if (!window.confirm(`Delete draft invoice ${invoice.invoice_number}?`)) return
    void run(invoice.id, () => deleteInvoice(invoice.id))
  }

  return (
    <Card>
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="text-base font-bold text-white">Invoices</h3>
        <PrimaryButton onClick={openCreate}>
          {showCreate ? 'Cancel' : 'Create invoice'}
        </PrimaryButton>
      </div>

      {showCreate && (
        <form
          onSubmit={handleCreate}
          className="mb-3 rounded-lg border border-slate-700 bg-slate-800/60 p-4"
        >
          <InvoiceFormFields values={createValues} onChange={setCreateValues} />
          <p className="mt-2 text-xs text-slate-400">
            The invoice number (INV-…) is assigned automatically.
          </p>
          <PrimaryButton type="submit" className="mt-3" disabled={busyId === 'new'}>
            {busyId === 'new' ? 'Saving…' : 'Save invoice'}
          </PrimaryButton>
        </form>
      )}

      {detail.invoices.length === 0 ? (
        <EmptyState message="No invoices yet. Use Create invoice to add one." />
      ) : (
        <div className="space-y-2">
          {detail.invoices.map((inv) =>
            editingId === inv.id ? (
              <form
                key={inv.id}
                onSubmit={handleSaveEdit}
                className="rounded-lg border border-blue-500/50 bg-slate-800/60 p-4"
              >
                <p className="mb-2 text-sm font-semibold text-white">{inv.invoice_number}</p>
                <InvoiceFormFields values={editValues} onChange={setEditValues} />
                <div className="mt-3 flex gap-2">
                  <PrimaryButton type="submit" disabled={busyId === inv.id}>
                    {busyId === inv.id ? 'Saving…' : 'Save'}
                  </PrimaryButton>
                  <SecondaryButton onClick={() => setEditingId(null)}>Cancel</SecondaryButton>
                </div>
              </form>
            ) : (
              <div
                key={inv.id}
                className="rounded-lg border border-slate-700 bg-slate-800/60 p-3 text-sm"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-100">{inv.invoice_number}</span>
                    <DocStatusBadge status={inv.status} label={INVOICE_STATUS_LABELS[inv.status]} />
                  </div>
                  <span className="font-bold text-white">{money(Number(inv.total))}</span>
                </div>
                <p className="mt-1 text-xs text-slate-300">
                  Subtotal {money(Number(inv.subtotal))} + Tax {money(Number(inv.tax))}
                  {inv.status === 'paid' && inv.paid_at
                    ? ` · Paid ${formatDate(inv.paid_at)}`
                    : ''}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {INVOICE_STATUS_TRANSITIONS[inv.status].map((next) => (
                    <SecondaryButton
                      key={next}
                      onClick={() => handleStatus(inv, next)}
                      disabled={busyId === inv.id}
                    >
                      {INVOICE_ACTION_LABELS[next]}
                    </SecondaryButton>
                  ))}
                  {inv.status === 'draft' && (
                    <>
                      <SecondaryButton
                        onClick={() => {
                          setEditingId(inv.id)
                          setEditValues({
                            subtotal: String(inv.subtotal),
                            tax: String(inv.tax),
                          })
                        }}
                        disabled={busyId === inv.id}
                      >
                        Edit
                      </SecondaryButton>
                      <SecondaryButton
                        onClick={() => handleDelete(inv)}
                        disabled={busyId === inv.id}
                      >
                        Delete
                      </SecondaryButton>
                    </>
                  )}
                </div>
              </div>
            ),
          )}
        </div>
      )}
    </Card>
  )
}

function InvoiceFormFields({
  values,
  onChange,
}: {
  values: InvoiceFormValues
  onChange: (values: InvoiceFormValues) => void
}) {
  const total = parseAmount(values.subtotal) + parseAmount(values.tax)
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <MoneyField
        label="Subtotal ($)"
        value={values.subtotal}
        onChange={(v) => onChange({ ...values, subtotal: v })}
      />
      <MoneyField
        label="Tax ($)"
        value={values.tax}
        onChange={(v) => onChange({ ...values, tax: v })}
      />
      <p className="text-sm text-slate-300 sm:col-span-2">
        Total (subtotal + tax):{' '}
        <span className="font-bold text-white">{showAmount(total)}</span>
      </p>
    </div>
  )
}
