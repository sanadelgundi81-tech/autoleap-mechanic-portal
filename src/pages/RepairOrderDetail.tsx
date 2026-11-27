import { Suspense, lazy, useEffect, useState, type FormEvent } from 'react'
import {
  createEstimate,
  createInvoice,
  createOrderService,
  deleteEstimate,
  deleteInvoice,
  deleteOrderService,
  deleteRepairOrder,
  estimatePrefill,
  fetchRepairOrderDetail,
  fetchVehicleHistory,
  getOrCreateInspection,
  invoiceSubtotalPrefill,
  latestApprovedEstimate,
  setRepairOrderWorkCompleted,
  startTimelog,
  stopTimelog,
  updateEstimate,
  updateInvoice,
  updateOrderService,
  updateRepairOrderFields,
  updateRepairOrderStatus,
  type RepairOrderDetail,
} from '../lib/data'
import {
  formatAppointmentTime,
  formatDate,
  formatDuration,
  formatKm,
  formatTimelogRange,
  money,
  orderCustomerName,
  orderVehicleLabel,
  timelogMinutes,
} from '../lib/format'
import {
  ESTIMATE_STATUS_LABELS,
  ESTIMATE_STATUS_TRANSITIONS,
  INVOICE_STATUS_LABELS,
  INVOICE_STATUS_TRANSITIONS,
  REPAIR_ORDER_PRIORITIES,
  REPAIR_ORDER_PRIORITY_LABELS,
  REPAIR_ORDER_STATUSES,
  REPAIR_ORDER_STATUS_LABELS,
  type Estimate,
  type EstimateStatus,
  type Invoice,
  type InvoiceStatus,
  type OrderService,
  type RepairOrder,
  type RepairOrderPriority,
  type RepairOrderStatus,
} from '../lib/types'
import {
  AppointmentStatusBadge,
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
import { OverflowMenu } from '../components/OverflowMenu'
import { VehicleRecalls, VinHistoryLinks } from '../components/VinTools'
import { isValidVin } from '../lib/vin'
import { useDeleteWarning } from '../components/DeleteWarning'
import { estimateWarning, invoiceWarning, orderWarning, simpleWarning } from '../lib/deleteWarnings'
import { rateLabel, rateLabelForCents } from '../lib/laborRates'

/** Live stopwatch text: "4:05" or "1:02:09". */
function formatElapsed(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000))
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const sec = String(total % 60).padStart(2, '0')
  return h > 0 ? `${h}:${String(m).padStart(2, '0')}:${sec}` : `${m}:${sec}`
}

/** Re-renders every second while `active`, for live timers. */
function useNow(active: boolean): number {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    if (!active) return
    setNow(Date.now())
    const timer = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [active])
  return now
}

// Only needed when Print is clicked, so it loads on demand (keeps the main chunk small).
const InvoicePrintView = lazy(() =>
  import('../components/InvoicePrintView').then((m) => ({ default: m.InvoicePrintView })),
)

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
  const [savingStatus, setSavingStatus] = useState(false)
  const [savingWorkComplete, setSavingWorkComplete] = useState(false)
  const deleteWarning = useDeleteWarning()

  const [odometer, setOdometer] = useState('')
  const [savingOdometer, setSavingOdometer] = useState(false)
  const [shopNotes, setShopNotes] = useState('')
  const [savingShopNotes, setSavingShopNotes] = useState(false)
  const [recommendations, setRecommendations] = useState('')
  const [savingRecommendations, setSavingRecommendations] = useState(false)
  const [startingInspection, setStartingInspection] = useState(false)

  const [editingDetails, setEditingDetails] = useState(false)
  const [technicianEdit, setTechnicianEdit] = useState('')
  const [bayEdit, setBayEdit] = useState('')
  const [priorityEdit, setPriorityEdit] = useState<RepairOrderPriority>('medium')
  const [savingDetails, setSavingDetails] = useState(false)

  const [showHistory, setShowHistory] = useState(false)
  const [history, setHistory] = useState<RepairOrder[]>([])
  const [loadingHistory, setLoadingHistory] = useState(false)

  async function load() {
    try {
      const data = await fetchRepairOrderDetail(id)
      setDetail(data)
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

  async function handleStatusChange(next: RepairOrderStatus) {
    if (!detail) return
    setError(null)
    setSavingStatus(true)
    try {
      await updateRepairOrderStatus(detail.repairOrder.id, next)
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
    const vehicleId = detail.repairOrder.vehicle_id
    if (!vehicleId) return
    setLoadingHistory(true)
    try {
      const rows = await fetchVehicleHistory(vehicleId, detail.repairOrder.id)
      setHistory(rows)
      setShowHistory(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoadingHistory(false)
    }
  }

  if (loading) return <LoadingState message="Loading order…" />
  if (!detail) return <ErrorBanner message={error ?? 'Order not found.'} />

  const { repairOrder: ro, inspectionSummary, services } = detail
  const currentStep = REPAIR_ORDER_STATUSES.indexOf(ro.status)
  const vehicle = ro.vehicles

  function openDetailsEdit() {
    setTechnicianEdit(ro.technician ?? '')
    setBayEdit(ro.bay ?? '')
    setPriorityEdit(ro.priority)
    setEditingDetails(true)
  }

  async function handleSaveDetails(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setSavingDetails(true)
    try {
      await updateRepairOrderFields(ro.id, {
        technician: technicianEdit.trim() === '' ? null : technicianEdit.trim(),
        bay: bayEdit.trim() === '' ? null : bayEdit.trim(),
        priority: priorityEdit,
      })
      await load()
      setEditingDetails(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setSavingDetails(false)
    }
  }

  function handleDeleteOrder() {
    deleteWarning.ask({
      title: `Delete order ${ro.ro_number}?`,
      load: () => orderWarning(ro.id),
      run: () => deleteRepairOrder(ro.id),
      onDeleted: () => onNavigate({ name: 'repair-orders' }),
    })
  }

  // Everything except the primary action (work complete / reopen) lives here.
  const orderMenu = [
    { label: 'Edit technician, bay & priority', onSelect: openDetailsEdit },
    ...REPAIR_ORDER_STATUSES.filter((s) => s !== ro.status).map((s) => ({
      label: `Move to ${REPAIR_ORDER_STATUS_LABELS[s]}`,
      onSelect: () => void handleStatusChange(s),
      disabled: savingStatus,
    })),
    { label: 'Delete order', danger: true, onSelect: handleDeleteOrder },
  ]

  return (
    // pb-28: room for the sticky action bar so nothing hides under it.
    <div className="flex flex-col gap-4 pb-28 md:gap-6">
      <div className="flex items-center justify-between">
        <SecondaryButton onClick={() => onNavigate({ name: 'repair-orders' })}>
          ← All Orders
        </SecondaryButton>
      </div>

      <ErrorBanner message={error} />
      {deleteWarning.dialog}

      {/* (a) Header: RO number, status, priority, vehicle + customer, created date. */}
      <Card>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-bold uppercase tracking-wider text-blue-400">
                Order {ro.ro_number}
              </span>
              <RepairOrderStatusBadge status={ro.status} />
              <PriorityBadge priority={ro.priority} />
            </div>
            <h1 className="mt-1 break-words text-2xl font-bold text-white">
              {orderVehicleLabel(ro)}
            </h1>
            <p className="mt-0.5 text-sm text-slate-300">
              {ro.customer_id ? (
                <button
                  onClick={() => onNavigate({ name: 'customer', id: ro.customer_id! })}
                  className="font-semibold text-blue-400 hover:text-blue-300"
                >
                  {orderCustomerName(ro)}
                </button>
              ) : (
                <span className="font-semibold">{orderCustomerName(ro)}</span>
              )}
              <span className="text-slate-400"> · Created {formatDate(ro.created_at)}</span>
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Technician: {ro.technician ?? 'Unassigned'}
              {' · '}Bay: {ro.bay ?? '—'}
            </p>
          </div>
        </div>

        <p className="mt-3 rounded-lg bg-slate-800/60 p-3 text-sm text-slate-200">
          <span className="font-semibold text-slate-400">Concern: </span>
          {ro.concern ?? 'No customer concern recorded.'}
        </p>

        {editingDetails && (
          <form
            onSubmit={(e) => void handleSaveDetails(e)}
            className="mt-3 grid grid-cols-1 gap-3 rounded-lg border border-blue-500/50 bg-slate-800/60 p-3 sm:grid-cols-3"
          >
            <Field label="Technician">
              <input
                value={technicianEdit}
                onChange={(e) => setTechnicianEdit(e.target.value)}
                className={inputClassName}
                placeholder="e.g. Alex M."
              />
            </Field>
            <Field label="Bay">
              <input
                value={bayEdit}
                onChange={(e) => setBayEdit(e.target.value)}
                className={inputClassName}
                placeholder="e.g. Bay 1"
              />
            </Field>
            <Field label="Priority">
              <select
                value={priorityEdit}
                onChange={(e) => setPriorityEdit(e.target.value as RepairOrderPriority)}
                className={inputClassName}
              >
                {REPAIR_ORDER_PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {REPAIR_ORDER_PRIORITY_LABELS[p]}
                  </option>
                ))}
              </select>
            </Field>
            <div className="flex gap-2 sm:col-span-3">
              <PrimaryButton type="submit" disabled={savingDetails}>
                {savingDetails ? 'Saving…' : 'Save'}
              </PrimaryButton>
              <SecondaryButton onClick={() => setEditingDetails(false)}>Cancel</SecondaryButton>
            </div>
          </form>
        )}

        <div className="mt-4 flex flex-wrap gap-1.5">
          {REPAIR_ORDER_STATUSES.map((s, index) => (
            <span
              key={s}
              className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${
                index === currentStep
                  ? 'border-blue-500 bg-blue-600 text-onaccent'
                  : index < currentStep
                    ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                    : 'border-slate-700 bg-slate-800 text-slate-400'
              }`}
            >
              {REPAIR_ORDER_STATUS_LABELS[s]}
            </span>
          ))}
        </div>
        <p className="mt-3 text-sm text-slate-300">
          Work:{' '}
          {ro.technician_completed_at
            ? `Completed ${formatDate(ro.technician_completed_at)}`
            : 'In progress'}
          {savingStatus ? ' · Updating status…' : ''}
        </p>
      </Card>

      {/* (b) Customer & vehicle summary. */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <div className="flex items-start justify-between gap-2">
            <h2 className="text-sm font-bold text-white">Customer</h2>
            {ro.customer_id && (
              <button
                onClick={() => onNavigate({ name: 'customer', id: ro.customer_id! })}
                className="text-xs font-semibold text-blue-400 hover:text-blue-300"
              >
                View customer
              </button>
            )}
          </div>
          <p className="mt-2 font-semibold text-slate-100">{orderCustomerName(ro)}</p>
          <dl className="mt-2 space-y-1 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-slate-400">Phone</dt>
              <dd className="text-right text-slate-200">{ro.customers?.phone ?? 'No phone'}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-400">Email</dt>
              <dd className="min-w-0 break-words text-right text-slate-200">
                {ro.customers?.email ?? 'No Email'}
              </dd>
            </div>
          </dl>
        </Card>
        <Card>
          <h2 className="text-sm font-bold text-white">Vehicle</h2>
          <p className="mt-2 font-semibold text-slate-100">{orderVehicleLabel(ro)}</p>
          <dl className="mt-2 space-y-1 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-slate-400">VIN</dt>
              <dd className="min-w-0 break-all text-right text-slate-200">{vehicle?.vin ?? '—'}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-400">License Plate</dt>
              <dd className="text-right text-slate-200">{vehicle?.license_plate ?? '—'}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-400">Mileage (KM)</dt>
              <dd className="text-right text-slate-200">{formatKm(vehicle?.mileage_km)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-400">RO Odometer</dt>
              <dd className="text-right text-slate-200">
                {ro.odometer_km !== null ? formatKm(ro.odometer_km) : '—'}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-400">Transmission</dt>
              <dd className="text-right text-slate-200">{vehicle?.transmission ?? '—'}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-400">Engine</dt>
              <dd className="text-right text-slate-200">{vehicle?.engine ?? '—'}</dd>
            </div>
          </dl>

          {vehicle?.vin && isValidVin(vehicle.vin) && (
            <div className="mt-2">
              <VinHistoryLinks vin={vehicle.vin} />
            </div>
          )}
          {vehicle && (
            <VehicleRecalls make={vehicle.make} model={vehicle.model} year={vehicle.year} />
          )}

          <form onSubmit={handleSaveOdometer} className="mt-3 flex flex-wrap items-end gap-2">
            <div className="w-full sm:w-56">
              <Field label="Enter RO Odometer reading (km)">
                <input
                  type="number" inputMode="numeric"
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
              <span className="pb-2 text-xs text-slate-400">Saved: {formatKm(ro.odometer_km)}</span>
            )}
          </form>

          {ro.vehicle_id && (
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
          )}
          {showHistory && (
            <div className="mt-3 space-y-2 border-t border-slate-700 pt-3">
              {history.length === 0 ? (
                <p className="text-sm text-slate-400">No prior orders for this vehicle.</p>
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
        </Card>
      </div>

      {/* (c) + (d) Services line items and totals. */}
      <ServicesSection
        detail={detail}
        repairOrderId={ro.id}
        services={services}
        onChanged={load}
        onError={setError}
      />

      {/* (e) Everything else. */}
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-base font-bold text-white">Inspections</h3>
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
            <p className="text-sm text-slate-400">No inspection started for this order yet.</p>
            <PrimaryButton
              className="mt-3"
              onClick={() => void handleStartInspection()}
              disabled={startingInspection}
            >
              {startingInspection ? 'Starting…' : 'Start Comprehensive Inspection'}
            </PrimaryButton>
          </div>
        )}
        <details className="mt-4 rounded-lg border border-slate-700 bg-slate-800/60 p-4">
          <summary className="cursor-pointer text-sm font-bold text-white">Specifications</summary>
          <p className="mt-1 text-xs text-slate-400">
            Often required specifications for this vehicle (from the stored vehicle record).
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
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
        <EstimatesCard detail={detail} onChanged={load} onError={setError} />
        <InvoicesCard detail={detail} onChanged={load} onError={setError} />
      </div>

      <Card>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-base font-bold text-white">Appointments</h3>
          <PrimaryButton
            disabled={!ro.customer_id}
            title={ro.customer_id ? undefined : 'This order has no customer (deleted), so it cannot be booked.'}
            onClick={() =>
              ro.customer_id &&
              onNavigate({
                name: 'appointments',
                prefill: {
                  customerId: ro.customer_id,
                  vehicleId: ro.vehicle_id,
                  repairOrderId: ro.id,
                  roNumber: ro.ro_number,
                },
              })
            }
          >
            New appointment
          </PrimaryButton>
        </div>
        {detail.appointments.length === 0 ? (
          <EmptyState message="No appointments for this order yet." />
        ) : (
          <div className="space-y-2">
            {detail.appointments.map((appt) => (
              <div
                key={appt.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-700 bg-slate-800/60 p-3 text-sm"
              >
                <div>
                  <p className="font-semibold text-slate-100">
                    {formatAppointmentTime(appt.starts_at, appt.ends_at)}
                  </p>
                  <p className="text-xs text-slate-400">{appt.service ?? 'No service noted'}</p>
                </div>
                <AppointmentStatusBadge status={appt.status} />
              </div>
            ))}
            <button
              onClick={() => onNavigate({ name: 'appointments' })}
              className="text-sm font-semibold text-blue-400 hover:text-blue-300"
            >
              Manage on the Appointments page
            </button>
          </div>
        )}
      </Card>

      <TimelogsCard detail={detail} onChanged={load} onError={setError} onNavigate={onNavigate} />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
        <Card>
          <h3 className="text-base font-bold text-white">Shop notes (Internal)</h3>
          {ro.shop_notes ? (
            <p className="mt-2 whitespace-pre-wrap text-sm text-slate-200">{ro.shop_notes}</p>
          ) : (
            <p className="mt-2 text-sm text-slate-400">No notes</p>
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
            onClick={() => void handleSaveNotes('shop_notes', shopNotes, setSavingShopNotes)}
            disabled={savingShopNotes}
          >
            {savingShopNotes ? 'Saving…' : 'Save shop notes'}
          </PrimaryButton>
        </Card>

        <Card>
          <h3 className="text-base font-bold text-white">Recommendations for Customer</h3>
          {ro.customer_recommendations ? (
            <p className="mt-2 whitespace-pre-wrap text-sm text-slate-200">
              {ro.customer_recommendations}
            </p>
          ) : (
            <p className="mt-2 text-sm text-slate-400">No notes</p>
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
        </Card>
      </div>

      {/* Sticky action bar: the primary action + the ⋯ menu, within thumb reach. */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-800 bg-slate-900/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
          <span className="min-w-0 truncate text-sm font-semibold text-slate-300">{ro.ro_number}</span>
          <div className="flex shrink-0 items-center gap-2">
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
            <OverflowMenu label="Order actions" placement="up" buttonLabel="More" items={orderMenu} />
          </div>
        </div>
      </div>
    </div>
  )
}

// ---------- Timelogs card ----------
// A record of time worked — never changes labour charges or totals.

function TimelogsCard({
  detail,
  onChanged,
  onError,
  onNavigate,
}: {
  detail: RepairOrderDetail
  onChanged: () => Promise<void>
  onError: (message: string | null) => void
  onNavigate: (view: View) => void
}) {
  const [busy, setBusy] = useState(false)
  const [note, setNote] = useState('')
  const { timelogs, totalMinutes } = detail.timelogs
  const running = timelogs.find((t) => t.ended_at === null) ?? null
  const now = Date.now()
  const serviceNames = new Map(detail.services.map((s) => [s.id, s.name]))

  async function handleStartStop() {
    onError(null)
    setBusy(true)
    try {
      if (running) await stopTimelog(running.id)
      else await startTimelog(detail.repairOrder.id, note)
      setNote('')
      await onChanged()
    } catch (err) {
      onError(err instanceof Error ? err.message : String(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <Card>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-white">Timelogs</h3>
          <p className="text-xs text-slate-400">
            Total logged: <span className="font-semibold text-slate-200">{formatDuration(totalMinutes)}</span>
            {running ? ' (includes the running timer)' : ''} · order-level runs are for
            reference; runs on a service line are billed to that line
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {!running && (
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className={`${inputClassName} sm:w-48`}
              placeholder="Note (optional)"
              aria-label="Timelog note"
            />
          )}
          <PrimaryButton onClick={() => void handleStartStop()} disabled={busy}>
            {busy ? 'Saving…' : running ? 'Stop' : 'Start'}
          </PrimaryButton>
        </div>
      </div>
      {timelogs.length === 0 ? (
        <EmptyState message="No time logged on this order yet." />
      ) : (
        <div className="space-y-2">
          {timelogs.map((t) => (
            <div
              key={t.id}
              className={`flex flex-wrap items-center justify-between gap-2 rounded-lg border p-3 text-sm ${
                t.ended_at === null
                  ? 'border-emerald-500/40 bg-emerald-500/5'
                  : 'border-slate-700 bg-slate-800/60'
              }`}
            >
              <div>
                <p className="font-semibold text-slate-100">
                  {formatTimelogRange(t.started_at, t.ended_at)}
                </p>
                {t.repair_order_service_id && (
                  <p className="text-xs text-slate-300">
                    {serviceNames.get(t.repair_order_service_id) ?? 'Service (removed)'}
                    {t.hourly_rate_cents !== null
                      ? ` · ${rateLabelForCents(t.hourly_rate_cents)} · billed`
                      : t.ended_at === null
                        ? ' · running'
                        : ''}
                  </p>
                )}
                {t.note && <p className="text-xs text-slate-400">{t.note}</p>}
              </div>
              <span className="font-semibold text-white">
                {formatDuration(timelogMinutes(t.started_at, t.ended_at, now))}
                {t.ended_at === null ? ' so far' : ''}
              </span>
            </div>
          ))}
          <button
            onClick={() => onNavigate({ name: 'timelogs' })}
            className="text-sm font-semibold text-blue-400 hover:text-blue-300"
          >
            Edit notes or add a manual entry on the Timelogs page
          </button>
        </div>
      )}
    </Card>
  )
}

// ---------- Services (line items) ----------

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

function ServicesSection({
  detail,
  repairOrderId,
  services,
  onChanged,
  onError,
}: {
  detail: RepairOrderDetail
  repairOrderId: string
  services: OrderService[]
  onChanged: () => Promise<void>
  onError: (message: string | null) => void
}) {
  const deleteWarning = useDeleteWarning()
  const [showAdd, setShowAdd] = useState(false)
  const [addValues, setAddValues] = useState<ServiceFormValues>(EMPTY_SERVICE_FORM)
  const [adding, setAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValues, setEditValues] = useState<ServiceFormValues>(EMPTY_SERVICE_FORM)
  const [busyId, setBusyId] = useState<string | null>(null)

  const done = services.filter((s) => s.is_done).length
  const running = detail.timelogs.timelogs.find((t) => t.ended_at === null) ?? null
  const now = useNow(running !== null)
  // Same numbers a new estimate prefills with (services, or the order-level
  // labour/parts fields when there are none) — no separate totals formula.
  const totals = estimatePrefill(detail)
  const subtotal = totals.labor + totals.parts
  // Tax lives on estimates, not the order: use the latest approved estimate's.
  const approved = latestApprovedEstimate(detail)
  const tax = approved ? Number(approved.tax) : 0
  const total = Math.round((subtotal + tax) * 100) / 100

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
    deleteWarning.ask({
      title: `Delete service "${service.name}"?`,
      load: simpleWarning(
        `The service "${service.name}" — ${money(serviceLabor(service) + Number(service.parts_total))} (labour + parts)`,
      ),
      run: () => deleteOrderService(service.id),
      onDeleted: onChanged,
    })
  }

  /** Starts the job timer on this line, or stops it (stopping bills the line). */
  function handleTimer(service: OrderService) {
    if (running && running.repair_order_service_id === service.id) {
      const id = running.id
      void run(service.id, () => stopTimelog(id))
    } else {
      void run(service.id, async () => {
        await startTimelog(repairOrderId, null, service.id)
      })
    }
  }

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900">
      {deleteWarning.dialog}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 p-4">
        <div>
          <h2 className="text-base font-bold text-white">
            <span aria-hidden="true">🔧</span> Services
          </h2>
          <p className="text-xs text-slate-400">
            {services.length === 0 ? 'No lines yet' : `${done} of ${services.length} done`}
          </p>
        </div>
        <PrimaryButton
          onClick={() => {
            setShowAdd((v) => !v)
            setAddValues(EMPTY_SERVICE_FORM)
          }}
        >
          {showAdd ? 'Cancel' : '+ Add service'}
        </PrimaryButton>
      </div>

      {services.length === 0 && !showAdd ? (
        <div className="p-4">
          <EmptyState message="No services on this order yet. Use Add service to add the first one." />
        </div>
      ) : (
        <ul className="divide-y divide-slate-800">
          {services.map((service) =>
            editingId === service.id ? (
              <li key={service.id} className="bg-slate-800/40 p-4">
                <form onSubmit={handleSaveEdit}>
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
              </li>
            ) : (
              <li key={service.id} className="flex items-start gap-3 p-4">
                <input
                  type="checkbox"
                  checked={service.is_done}
                  onChange={() => handleToggleDone(service)}
                  disabled={busyId === service.id}
                  aria-label={`Mark "${service.name}" ${service.is_done ? 'not done' : 'done'}`}
                  className="mt-1 h-5 w-5 shrink-0 accent-emerald-500"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p
                      className={`break-words font-semibold ${
                        service.is_done ? 'text-slate-400 line-through' : 'text-slate-100'
                      }`}
                    >
                      {service.name}
                    </p>
                    <span className="shrink-0 font-bold text-white">
                      {money(serviceLabor(service) + Number(service.parts_total))}
                    </span>
                  </div>
                  {service.description && (
                    <p className="mt-0.5 whitespace-pre-wrap break-words text-sm text-slate-400">
                      {service.description}
                    </p>
                  )}
                  <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-slate-300">
                    <span>
                      Labour {Number(service.labor_hours)} h × {money(Number(service.labor_rate))}{' '}
                      = {money(serviceLabor(service))}
                    </span>
                    <span>Parts {money(Number(service.parts_total))}</span>
                  </div>
                  {(() => {
                    const mine = running?.repair_order_service_id === service.id
                    const blocked = running !== null && !mine
                    return (
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleTimer(service)}
                          disabled={busyId === service.id || blocked}
                          title={
                            blocked
                              ? 'Another timer is running on this order. Stop it first.'
                              : undefined
                          }
                          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                            mine
                              ? 'bg-rose-600 text-onaccent hover:bg-rose-500'
                              : 'border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20'
                          }`}
                        >
                          {mine ? '■ Stop' : '▶ Start'}
                        </button>
                        {mine && running ? (
                          <span className="text-xs font-semibold text-emerald-300" aria-live="polite">
                            {formatElapsed(now - new Date(running.started_at).getTime())} ·{' '}
                            {rateLabel(service.name)}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400">{rateLabel(service.name)}</span>
                        )}
                      </div>
                    )
                  })()}
                </div>
                <OverflowMenu
                  label={`Actions for ${service.name}`}
                  disabled={busyId === service.id}
                  items={[
                    {
                      label: 'Edit',
                      onSelect: () => {
                        setEditingId(service.id)
                        setEditValues(serviceToForm(service))
                      },
                    },
                    { label: 'Delete', danger: true, onSelect: () => handleDelete(service) },
                  ]}
                />
              </li>
            ),
          )}
          {showAdd && (
            <li className="bg-slate-800/40 p-4">
              <form onSubmit={handleAdd}>
                <ServiceFormFields values={addValues} onChange={setAddValues} />
                <PrimaryButton
                  type="submit"
                  className="mt-3"
                  disabled={adding || addValues.name.trim() === ''}
                >
                  {adding ? 'Adding…' : 'Save service'}
                </PrimaryButton>
              </form>
            </li>
          )}
        </ul>
      )}

      <dl className="space-y-1 border-t border-slate-800 bg-slate-950/40 p-4 text-sm">
        {services.length === 0 && (
          <p className="pb-1 text-xs text-slate-400">
            No services — totals come from the order&apos;s labour and parts fields.
          </p>
        )}
        <div className="flex justify-between gap-4">
          <dt className="text-slate-400">Labour</dt>
          <dd className="text-slate-200">{money(totals.labor)}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-slate-400">Parts</dt>
          <dd className="text-slate-200">{money(totals.parts)}</dd>
        </div>
        <div className="flex justify-between gap-4 border-t border-slate-800 pt-1">
          <dt className="text-slate-300">Subtotal</dt>
          <dd className="font-semibold text-white">{money(subtotal)}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-slate-400">
            Tax{' '}
            <span className="text-xs text-slate-400">
              {approved
                ? `(from approved estimate, ${formatDate(approved.created_at)})`
                : '(entered on the estimate / invoice)'}
            </span>
          </dt>
          <dd className="text-slate-200">{money(tax)}</dd>
        </div>
        <div className="flex justify-between gap-4 border-t border-slate-800 pt-1 text-base">
          <dt className="font-bold text-white">Total</dt>
          <dd className="font-bold text-white">{money(total)}</dd>
        </div>
      </dl>
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
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <div className="sm:col-span-3">
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
      <div className="sm:col-span-3">
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
          type="number" inputMode="decimal"
          min="0"
          step="0.1"
          value={values.laborHours}
          onChange={(e) => set('laborHours', e.target.value)}
          className={inputClassName}
        />
      </Field>
      <Field label="Labour rate ($/hr)">
        <input
          type="number" inputMode="decimal"
          min="0"
          step="0.01"
          value={values.laborRate}
          onChange={(e) => set('laborRate', e.target.value)}
          className={inputClassName}
        />
      </Field>
      <Field label="Parts total ($)">
        <input
          type="number" inputMode="decimal"
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
        type="number" inputMode="decimal"
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
  const deleteWarning = useDeleteWarning()
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
    deleteWarning.ask({
      title: 'Delete this estimate?',
      load: () => estimateWarning(estimate.id),
      run: () => deleteEstimate(estimate.id),
      onDeleted: onChanged,
    })
  }

  return (
    <Card>
      {deleteWarning.dialog}
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
                <div className="mt-2 flex justify-end">
                  <OverflowMenu
                    label="Estimate actions"
                    buttonLabel="Actions"
                    disabled={busyId === est.id}
                    items={[
                      ...ESTIMATE_STATUS_TRANSITIONS[est.status].map((next) => ({
                        label: ESTIMATE_ACTION_LABELS[next] ?? next,
                        onSelect: () => handleStatus(est, next),
                      })),
                      ...(est.status === 'draft'
                        ? [
                            {
                              label: 'Edit',
                              onSelect: () => {
                                setEditingId(est.id)
                                setEditValues({
                                  labor: String(est.labor_total),
                                  parts: String(est.parts_total),
                                  tax: String(est.tax),
                                  notes: est.notes ?? '',
                                })
                              },
                            },
                          ]
                        : []),
                      { label: 'Delete', danger: true, onSelect: () => handleDelete(est) },
                    ]}
                  />
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
  const deleteWarning = useDeleteWarning()
  const [showCreate, setShowCreate] = useState(false)
  const [createValues, setCreateValues] = useState<InvoiceFormValues>({
    subtotal: '0',
    tax: '0',
  })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValues, setEditValues] = useState<InvoiceFormValues>(createValues)
  const [printingId, setPrintingId] = useState<string | null>(null)
  // Looked up from the latest detail, so the print view always shows the stored values.
  const printing = detail.invoices.find((inv) => inv.id === printingId) ?? null

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
    deleteWarning.ask({
      title: `Delete invoice ${invoice.invoice_number}?`,
      load: () => invoiceWarning(invoice.id),
      run: () => deleteInvoice(invoice.id),
      onDeleted: onChanged,
    })
  }

  return (
    <Card>
      {deleteWarning.dialog}
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
                <div className="mt-2 flex items-center justify-between gap-2">
                  <SecondaryButton onClick={() => setPrintingId(inv.id)}>Print</SecondaryButton>
                  <OverflowMenu
                    label={`Actions for ${inv.invoice_number}`}
                    disabled={busyId === inv.id}
                    items={[
                      ...INVOICE_STATUS_TRANSITIONS[inv.status].map((next) => ({
                        label: INVOICE_ACTION_LABELS[next] ?? next,
                        onSelect: () => handleStatus(inv, next),
                      })),
                      ...(inv.status === 'draft'
                        ? [
                            {
                              label: 'Edit',
                              onSelect: () => {
                                setEditingId(inv.id)
                                setEditValues({
                                  subtotal: String(inv.subtotal),
                                  tax: String(inv.tax),
                                })
                              },
                            },
                          ]
                        : []),
                      { label: 'Delete', danger: true, onSelect: () => handleDelete(inv) },
                    ]}
                  />
                </div>
              </div>
            ),
          )}
        </div>
      )}

      {printing && (
        <Suspense fallback={null}>
          <InvoicePrintView
            repairOrder={detail.repairOrder}
            invoice={printing}
            onClose={() => setPrintingId(null)}
          />
        </Suspense>
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
