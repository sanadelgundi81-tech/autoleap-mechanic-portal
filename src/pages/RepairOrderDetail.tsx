import { useEffect, useState, type FormEvent } from 'react'
import {
  fetchRepairOrderDetail,
  fetchVehicleHistory,
  getOrCreateInspection,
  setRepairOrderWorkCompleted,
  updateRepairOrderFields,
  updateRepairOrderStatus,
  type RepairOrderDetail,
} from '../lib/data'
import { formatDate, formatKm, money, vehicleLabel } from '../lib/format'
import {
  REPAIR_ORDER_STATUSES,
  REPAIR_ORDER_STATUS_LABELS,
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

  const { repairOrder: ro, estimates, invoices, inspectionSummary } = detail
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
          <div className="mt-4">
            <EmptyState message="Services arrive in Stage 2 — service line items, approvals, and service progress will live here." />
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <h3 className="mb-3 text-base font-bold text-white">Estimates</h3>
          {estimates.length === 0 ? (
            <EmptyState message="No estimates yet. Creating estimates arrives in Stage 2 — existing estimates will show here." />
          ) : (
            <div className="space-y-2">
              {estimates.map((est) => (
                <div
                  key={est.id}
                  className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-800/60 p-3 text-sm"
                >
                  <span className="text-slate-300">
                    {est.status} · labour {money(Number(est.labor_total))} + parts{' '}
                    {money(Number(est.parts_total))}
                  </span>
                  <span className="font-bold text-white">{money(Number(est.total))}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
        <Card>
          <h3 className="mb-3 text-base font-bold text-white">Invoices</h3>
          {invoices.length === 0 ? (
            <EmptyState message="No invoices yet. Creating invoices arrives in Stage 2 — existing invoices will show here." />
          ) : (
            <div className="space-y-2">
              {invoices.map((inv) => (
                <div
                  key={inv.id}
                  className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-800/60 p-3 text-sm"
                >
                  <span className="text-slate-300">
                    {inv.invoice_number} · {inv.status}
                    {inv.paid_at ? ` · paid ${formatDate(inv.paid_at)}` : ''}
                  </span>
                  <span className="font-bold text-white">{money(Number(inv.total))}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
