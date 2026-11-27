import { useEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { formatDate, vehicleLabel } from '../lib/format'
import type { InspectionDetail } from '../lib/data'
import type { InspectionResultState, RepairOrder } from '../lib/types'
import { PRINT_OPEN_CLASS } from './InvoicePrintView'

/** Plain words for the customer — never the raw state value. */
const CUSTOMER_STATE_WORDS: Record<Exclude<InspectionResultState, 'good'>, string> = {
  attention: 'Needs attention',
  failed: 'Failed',
}

export const REPORT_FOOTER =
  'This report is based on a visual inspection. Confirm any repair with the shop before authorising work.'

interface ReportProblem {
  id: string
  name: string
  state: 'attention' | 'failed'
  note: string | null
}

/** Flagged items (attention / failed), grouped by template section in template order. */
export function reportSections(detail: InspectionDetail): { section: string; problems: ReportProblem[] }[] {
  const sections: { section: string; problems: ReportProblem[] }[] = []
  for (const item of detail.items) {
    const result = detail.results.get(item.id)
    if (!result || (result.state !== 'attention' && result.state !== 'failed')) continue
    const last = sections[sections.length - 1]
    const problem: ReportProblem = {
      id: item.id,
      name: item.name,
      state: result.state,
      note: result.note,
    }
    if (last && last.section === item.section) last.problems.push(problem)
    else sections.push({ section: item.section, problems: [problem] })
  }
  return sections
}

/**
 * The customer inspection report. Same pattern as InvoicePrintView: rendered
 * outside #root with the shared print stylesheet (index.css), shown on screen
 * when opened, and the print dialog opens only from the Print button.
 */
export function InspectionReportPrintView({
  detail,
  repairOrder,
  onClose,
}: {
  detail: InspectionDetail
  repairOrder: RepairOrder | null
  onClose: () => void
}) {
  const { inspection, counts } = detail
  const sections = reportSections(detail)
  const checked = counts.total - counts.unmarked
  const inspectedOn = formatDate(inspection.completed_at ?? inspection.created_at)

  const closeRef = useRef(onClose)
  closeRef.current = onClose

  useEffect(() => {
    const root = document.documentElement
    root.classList.add(PRINT_OPEN_CLASS)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeRef.current()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      root.classList.remove(PRINT_OPEN_CLASS)
    }
  }, [])

  return createPortal(
    <div
      className="invoice-print-root fixed inset-0 z-50 overflow-y-auto bg-slate-950/90 p-3 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Inspection report"
    >
      <div className="no-print mx-auto mb-4 flex max-w-3xl flex-wrap gap-2 rounded-lg border border-slate-700 bg-slate-900 p-3 text-sm">
        <button
          type="button"
          onClick={() => window.print()}
          className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-onaccent hover:bg-blue-500"
        >
          Print
        </button>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-700"
        >
          Close
        </button>
      </div>

      <article className="invoice-print-sheet mx-auto max-w-3xl break-words rounded-lg bg-paper p-5 text-black shadow-xl sm:p-8">
        <header className="flex flex-wrap items-start justify-between gap-4 border-b border-gray-300 pb-4">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Vehicle Inspection Report</h1>
          <dl className="text-sm sm:text-right">
            <Row label="Date">{inspectedOn}</Row>
            {repairOrder && <Row label="Order">{repairOrder.ro_number}</Row>}
          </dl>
        </header>

        <section className="grid grid-cols-1 gap-4 py-4 text-sm sm:grid-cols-2 sm:gap-6">
          <div>
            <h2 className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-600">
              Customer
            </h2>
            <p className="font-semibold">{repairOrder?.customers?.name ?? '—'}</p>
          </div>
          <div>
            <h2 className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-600">
              Vehicle
            </h2>
            <p className="font-semibold">
              {repairOrder?.vehicles ? vehicleLabel(repairOrder.vehicles) : 'No vehicle on file'}
            </p>
          </div>
        </section>

        <p className="rounded border border-gray-300 bg-gray-50 p-3 text-sm font-semibold">
          {checked} items checked · {counts.attention} need attention · {counts.failed} failed
        </p>

        {sections.length === 0 ? (
          <p className="mt-4 text-base font-semibold">
            No problems found — all {checked} items checked out
          </p>
        ) : (
          <div className="mt-4 space-y-5">
            {sections.map((group) => (
              <section key={group.section}>
                <h2 className="border-b border-gray-400 pb-1 text-sm font-bold uppercase tracking-wide">
                  {group.section}
                </h2>
                <ul className="mt-2 space-y-2">
                  {group.problems.map((p) => (
                    <li key={p.id} className="text-sm">
                      <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                        <span className="font-semibold">{p.name}</span>
                        <span className="font-semibold">{CUSTOMER_STATE_WORDS[p.state]}</span>
                      </div>
                      {p.note && <p className="mt-0.5 whitespace-pre-wrap">{p.note}</p>}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}

        <p className="mt-6 border-t border-gray-300 pt-3 text-xs">{REPORT_FOOTER}</p>
      </article>
    </div>,
    document.body,
  )
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt className="inline text-gray-600">{label}: </dt>
      <dd className="inline font-semibold">{children}</dd>
    </div>
  )
}
