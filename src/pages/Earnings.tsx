import { useEffect, useState } from 'react'
import { fetchEarningsSummary, fetchRecentPaidInvoices } from '../lib/data'
import { formatDateTime, money } from '../lib/format'
import type { EarningsSummary, PaidInvoiceRow } from '../lib/types'
import { Card, EmptyState, ErrorBanner, LoadingState } from '../components/ui'
import type { View } from '../components/Layout'

function paidCountLabel(count: number): string {
  return `${count} paid invoice${count === 1 ? '' : 's'}`
}

function PeriodCard({ label, total, count }: { label: string; total: number; count: number }) {
  return (
    <Card>
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</p>
      <p className="mt-1 text-2xl font-bold text-white">{money(total)}</p>
      <p className="mt-1 text-xs text-slate-400">{paidCountLabel(count)}</p>
    </Card>
  )
}

/** Read-only: collected (paid) and outstanding (sent) invoice totals. */
export function Earnings({ onNavigate }: { onNavigate: (view: View) => void }) {
  const [summary, setSummary] = useState<EarningsSummary | null>(null)
  const [recent, setRecent] = useState<PaidInvoiceRow[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function loadOnce() {
      try {
        const [s, rows] = await Promise.all([fetchEarningsSummary(), fetchRecentPaidInvoices(20)])
        if (cancelled) return
        setSummary(s)
        setRecent(rows)
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
  }, [])

  if (loading) return <LoadingState message="Loading earnings…" />

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Earnings</h1>
        <p className="text-sm text-slate-400">
          Collected = paid invoices, by the date they were paid (your local time; weeks start
          Monday). Outstanding = sent invoices not yet paid. Draft and void invoices are not
          counted.
        </p>
      </div>

      <ErrorBanner message={error} />

      {summary && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <PeriodCard label="Today" total={summary.collectedToday} count={summary.paidCountToday} />
            <PeriodCard
              label="This Week"
              total={summary.collectedThisWeek}
              count={summary.paidCountThisWeek}
            />
            <PeriodCard
              label="This Month"
              total={summary.collectedThisMonth}
              count={summary.paidCountThisMonth}
            />
            <PeriodCard
              label="All Time"
              total={summary.collectedAllTime}
              count={summary.paidCountAllTime}
            />
          </div>
          <Card className="border-amber-500/30">
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              Outstanding
            </p>
            <p className="mt-1 text-2xl font-bold text-white">{money(summary.outstanding)}</p>
            <p className="mt-1 text-xs text-slate-400">Sent invoices not yet paid</p>
          </Card>
        </>
      )}

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-bold text-white">Recent paid invoices</h2>
        {recent.length === 0 ? (
          <EmptyState message="Nothing paid yet. Invoices show up here once they are marked paid." />
        ) : (
          <div className="space-y-2">
            {recent.map((row) => (
              <button
                key={row.id}
                onClick={() => onNavigate({ name: 'repair-order', id: row.repair_order_id })}
                className="flex w-full flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-800 bg-slate-900 p-4 text-left transition hover:border-slate-600"
              >
                <div>
                  <p className="font-semibold text-white">
                    {row.invoice_number}
                    <span className="ml-2 font-normal text-slate-300">
                      {row.customer_name ?? 'Customer'}
                    </span>
                  </p>
                  <p className="text-xs text-slate-400">
                    <span className="font-semibold text-blue-400">{row.ro_number ?? 'Order'}</span>
                    {' · '}Paid {formatDateTime(row.paid_at)}
                  </p>
                </div>
                <span className="text-lg font-bold text-white">{money(row.total)}</span>
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
