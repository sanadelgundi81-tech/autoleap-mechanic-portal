import { Suspense, lazy, useEffect, useMemo, useState } from 'react'
import {
  completeInspection,
  fetchInspectionDetail,
  fetchRepairOrder,
  reopenInspection,
  setInspectionResult,
  type InspectionDetail,
} from '../lib/data'
import { formatDate } from '../lib/format'
import type { InspectionResultState, InspectionTemplateItem, RepairOrder } from '../lib/types'
import {
  Card,
  EmptyState,
  ErrorBanner,
  InspectionCountsRow,
  InspectionStateBadge,
  InspectionStatusBadge,
  LoadingState,
  PrimaryButton,
  SecondaryButton,
} from '../components/ui'
import type { View } from '../components/Layout'
import { OverflowMenu } from '../components/OverflowMenu'

// Only needed when Print report is clicked, so it loads on demand.
const InspectionReportPrintView = lazy(() =>
  import('../components/InspectionReportPrintView').then((m) => ({
    default: m.InspectionReportPrintView,
  })),
)

const STATE_BUTTONS: {
  state: InspectionResultState
  label: string
  symbol: string
  activeClass: string
  inactiveClass: string
}[] = [
  {
    state: 'good',
    label: 'Good',
    symbol: '✓',
    activeClass: 'border-teal-500 bg-teal-600 text-onaccent',
    inactiveClass: 'border-teal-500/40 bg-teal-500/10 text-teal-300 hover:bg-teal-500/20',
  },
  {
    state: 'attention',
    label: 'Attention',
    symbol: '!',
    activeClass: 'border-amber-500 bg-amber-600 text-onaccent',
    inactiveClass:
      'border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20',
  },
  {
    state: 'failed',
    label: 'Failed',
    symbol: '✕',
    activeClass: 'border-rose-500 bg-rose-600 text-onaccent',
    inactiveClass: 'border-rose-500/40 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20',
  },
]

export function InspectionPage({
  inspectionId,
  repairOrderId,
  onNavigate,
}: {
  inspectionId: string
  repairOrderId: string
  onNavigate: (view: View) => void
}) {
  const [detail, setDetail] = useState<InspectionDetail | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [notes, setNotes] = useState<Record<string, string>>({})
  const [showReport, setShowReport] = useState(false)
  const [reportOrder, setReportOrder] = useState<RepairOrder | null>(null)
  const [openingReport, setOpeningReport] = useState(false)

  async function load() {
    try {
      const data = await fetchInspectionDetail(inspectionId)
      setDetail(data)
      const nextNotes: Record<string, string> = {}
      for (const [itemId, result] of data.results) {
        nextNotes[itemId] = result.note ?? ''
      }
      setNotes(nextNotes)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    }
  }

  useEffect(() => {
    let cancelled = false
    async function loadOnce() {
      setLoading(true)
      try {
        const data = await fetchInspectionDetail(inspectionId)
        if (cancelled) return
        setDetail(data)
        const nextNotes: Record<string, string> = {}
        for (const [itemId, result] of data.results) {
          nextNotes[itemId] = result.note ?? ''
        }
        setNotes(nextNotes)
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
  }, [inspectionId])

  const sections = useMemo(() => {
    if (!detail) return []
    const grouped: { section: string; items: InspectionTemplateItem[] }[] = []
    for (const item of detail.items) {
      const last = grouped[grouped.length - 1]
      if (last && last.section === item.section) {
        last.items.push(item)
      } else {
        grouped.push({ section: item.section, items: [item] })
      }
    }
    return grouped
  }, [detail])

  async function handleMark(item: InspectionTemplateItem, state: InspectionResultState) {
    if (!detail || detail.inspection.status === 'complete') return
    setError(null)
    setSaving(true)
    try {
      const current = detail.results.get(item.id)
      if (current?.state === state) {
        await setInspectionResult(detail.inspection.id, item.id, null, null)
      } else {
        await setInspectionResult(
          detail.inspection.id,
          item.id,
          state,
          notes[item.id] ?? null,
        )
      }
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setSaving(false)
    }
  }

  async function handleNoteBlur(item: InspectionTemplateItem) {
    if (!detail || detail.inspection.status === 'complete') return
    const current = detail.results.get(item.id)
    if (!current) return
    const note = notes[item.id] ?? ''
    if (note === (current.note ?? '')) return
    setError(null)
    try {
      await setInspectionResult(detail.inspection.id, item.id, current.state, note)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    }
  }

  async function handleComplete() {
    if (!detail) return
    setError(null)
    setSaving(true)
    try {
      await completeInspection(detail.inspection.id)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setSaving(false)
    }
  }

  async function handleReopen() {
    if (!detail) return
    setError(null)
    setSaving(true)
    try {
      await reopenInspection(detail.inspection.id)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setSaving(false)
    }
  }

  /** Loads the order (customer + vehicle for the report header), then opens the report. */
  async function handleOpenReport() {
    setError(null)
    setOpeningReport(true)
    try {
      if (!reportOrder || reportOrder.id !== repairOrderId) {
        setReportOrder(await fetchRepairOrder(repairOrderId))
      }
      setShowReport(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setOpeningReport(false)
    }
  }

  if (loading) return <LoadingState message="Loading inspection…" />
  if (!detail) return <ErrorBanner message={error ?? 'Inspection not found.'} />

  const { inspection, template, counts } = detail
  const isComplete = inspection.status === 'complete'
  const flagged = detail.items.filter((item) => {
    const state = detail.results.get(item.id)?.state
    return state === 'attention' || state === 'failed'
  })

  return (
    <div className="flex flex-col gap-6 pb-28">
      <div className="flex items-center justify-between">
        <SecondaryButton
          onClick={() => onNavigate({ name: 'repair-order', id: repairOrderId })}
        >
          ← Back to Order
        </SecondaryButton>
        <InspectionStatusBadge status={inspection.status} />
      </div>

      <ErrorBanner message={error} />

      <Card>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
              Comprehensive Inspection
            </span>
            <h2 className="text-2xl font-bold text-white">{template.name}</h2>
            <p className="mt-1 text-sm text-slate-400">
              Assigned to {inspection.assigned_to ?? 'Unassigned'}
              {isComplete && inspection.completed_at
                ? ` · Completed ${formatDate(inspection.completed_at)}`
                : ''}
            </p>
          </div>
          <InspectionCountsRow counts={counts} />
        </div>
        <p className="mt-2 text-xs text-slate-400">
          {counts.total - counts.unmarked} of {counts.total} items marked · Tap a
          state again to unmark an item. “Other” items take a free-text note.
        </p>
        {isComplete && (
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-teal-500/30 bg-teal-500/10 p-3 text-sm text-teal-300">
            <span>This inspection is complete. Reopen it to change any marking.</span>
            <PrimaryButton onClick={() => void handleOpenReport()} disabled={openingReport}>
              {openingReport ? 'Opening…' : 'Print report'}
            </PrimaryButton>
          </div>
        )}
      </Card>

      {showPreview && (
        <Card>
          <h3 className="mb-3 text-base font-bold text-white">Preview — findings</h3>
          {flagged.length === 0 ? (
            <EmptyState message="No attention or failed items. Everything marked so far is good." />
          ) : (
            <div className="space-y-2">
              {flagged.map((item) => {
                const result = detail.results.get(item.id)!
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3 rounded-lg border border-slate-700 bg-slate-800/60 p-3 text-sm"
                  >
                    <div>
                      <span className="font-semibold text-white">{item.name}</span>
                      <span className="text-slate-400">
                        {' '}
                        · {item.section}
                        {result.note ? ` · ${result.note}` : ''}
                      </span>
                    </div>
                    <InspectionStateBadge state={result.state} />
                  </div>
                )
              })}
            </div>
          )}
          <p className="mt-3 text-xs text-slate-400">
            {counts.good} passed · {counts.unmarked} unmarked · {counts.total} total
          </p>
        </Card>
      )}

      {sections.map((group) => (
        <Card key={group.section}>
          <h3 className="mb-3 text-base font-bold uppercase tracking-wide text-white">
            {group.section}
          </h3>
          <div className="space-y-3">
            {group.items.map((item) => {
              const result = detail.results.get(item.id)
              const state = result?.state ?? null
              return (
                <div
                  key={item.id}
                  className="rounded-lg border border-slate-700 bg-slate-800/60 p-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <InspectionStateBadge state={state ?? 'unmarked'} />
                      <span className="font-semibold text-slate-100">{item.name}</span>
                    </div>
                    <div className="flex gap-2">
                      {STATE_BUTTONS.map((btn) => (
                        <button
                          key={btn.state}
                          onClick={() => void handleMark(item, btn.state)}
                          disabled={saving || isComplete}
                          title={btn.label}
                          aria-label={`${btn.label} — ${item.name}`}
                          aria-pressed={state === btn.state}
                          className={`flex h-11 w-11 items-center justify-center rounded-lg border text-lg font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                            state === btn.state ? btn.activeClass : btn.inactiveClass
                          }`}
                        >
                          {btn.symbol}
                        </button>
                      ))}
                    </div>
                  </div>
                  <input
                    value={notes[item.id] ?? ''}
                    onChange={(e) =>
                      setNotes((prev) => ({ ...prev, [item.id]: e.target.value }))
                    }
                    onBlur={() => void handleNoteBlur(item)}
                    disabled={isComplete}
                    className="mt-2 min-h-[44px] w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-base text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none disabled:opacity-50 sm:text-sm"
                    placeholder={
                      item.is_free_text
                        ? 'Describe what you found…'
                        : 'Note (optional)'
                    }
                  />
                </div>
              )
            })}
          </div>
        </Card>
      ))}

      {showReport && isComplete && (
        <Suspense fallback={null}>
          <InspectionReportPrintView
            detail={detail}
            repairOrder={reportOrder}
            onClose={() => setShowReport(false)}
          />
        </Suspense>
      )}

      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-800 bg-slate-900/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
          <span className="text-sm font-semibold text-slate-300">
            {counts.total - counts.unmarked}/{counts.total} marked
          </span>
          <div className="flex items-center gap-2">
            {isComplete ? (
              <PrimaryButton onClick={() => void handleReopen()} disabled={saving}>
                {saving ? 'Reopening…' : 'Reopen inspection'}
              </PrimaryButton>
            ) : (
              <PrimaryButton onClick={() => void handleComplete()} disabled={saving}>
                {saving ? 'Saving…' : 'Mark as complete'}
              </PrimaryButton>
            )}
            <OverflowMenu
              label="Inspection actions"
              placement="up"
              buttonLabel="More"
              items={[
                {
                  label: showPreview ? 'Hide preview' : 'Preview findings',
                  onSelect: () => setShowPreview((v) => !v),
                },
                ...(isComplete
                  ? [{ label: 'Print report', onSelect: () => void handleOpenReport() }]
                  : []),
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
