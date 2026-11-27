import { Suspense, lazy, useEffect, useMemo, useState } from 'react'
import { deleteInvoice, fetchAllInvoices, updateInvoice, type InvoiceWithOrder } from '../lib/data'
import { formatDate, money, orderCustomerName, orderVehicleLabel } from '../lib/format'
import {
  INVOICE_STATUS_LABELS,
  INVOICE_STATUS_TRANSITIONS,
  type InvoiceStatus,
} from '../lib/types'
import { Card, EmptyState, ErrorBanner, Field, LoadingState, inputClassName } from '../components/ui'
import { OverflowMenu } from '../components/OverflowMenu'
import { useDeleteWarning } from '../components/DeleteWarning'
import { invoiceWarning } from '../lib/deleteWarnings'
import type { View } from '../components/Layout'

// The same preview the order page opens; loads only when a row is opened.
const InvoicePrintView = lazy(() =>
  import('../components/InvoicePrintView').then((m) => ({ default: m.InvoicePrintView })),
)

/** Same action labels as the order page's Invoices card. */
const INVOICE_ACTION_LABELS: Partial<Record<InvoiceStatus, string>> = {
  sent: 'Send',
  paid: 'Mark paid',
  void: 'Void',
}

const STATUS_FILTERS: { value: '' | InvoiceStatus; label: string }[] = [
  { value: '', label: 'All statuses' },
  { value: 'draft', label: INVOICE_STATUS_LABELS.draft },
  { value: 'sent', label: INVOICE_STATUS_LABELS.sent },
  { value: 'paid', label: INVOICE_STATUS_LABELS.paid },
  { value: 'void', label: INVOICE_STATUS_LABELS.void },
]

const STATUS_CLASSES: Record<InvoiceStatus, string> = {
  draft: 'border-slate-600 bg-slate-800 text-slate-300',
  sent: 'border-blue-500/40 bg-blue-500/10 text-blue-400',
  paid: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400',
  void: 'border-red-500/40 bg-red-500/10 text-red-400',
}

function message(err: unknown): string {
  return err instanceof Error ? err.message : String(err)
}

export function Invoices({ onNavigate }: { onNavigate: (view: View) => void }) {
  const [invoices, setInvoices] = useState<InvoiceWithOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'' | InvoiceStatus>('')
  const [viewingId, setViewingId] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)
  const deleteWarning = useDeleteWarning()

  async function load() {
    try {
      setInvoices(await fetchAllInvoices())
    } catch (err) {
      setError(message(err))
    }
  }

  useEffect(() => {
    let cancelled = false
    fetchAllInvoices()
      .then((rows) => {
        if (!cancelled) setInvoices(rows)
      })
      .catch((err) => {
        if (!cancelled) setError(message(err))
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return invoices.filter((inv) => {
      if (statusFilter && inv.status !== statusFilter) return false
      if (!q) return true
      const ro = inv.repair_orders
      const haystack = [
        inv.invoice_number,
        orderCustomerName(ro),
        orderVehicleLabel(ro),
        ro?.vehicles?.license_plate ?? '',
        ro?.ro_number ?? '',
      ]
        .join(' ')
        .toLowerCase()
      return haystack.includes(q)
    })
  }, [invoices, search, statusFilter])

  const summary = useMemo(() => {
    let outstanding = 0
    let outstandingCount = 0
    let paid = 0
    let paidCount = 0
    for (const inv of invoices) {
      if (inv.status === 'draft' || inv.status === 'sent') {
        outstanding += Number(inv.total)
        outstandingCount++
      } else if (inv.status === 'paid') {
        paid += Number(inv.total)
        paidCount++
      }
    }
    return { outstanding, outstandingCount, paid, paidCount }
  }, [invoices])

  const viewing = invoices.find((inv) => inv.id === viewingId) ?? null

  async function handleStatus(inv: InvoiceWithOrder, status: InvoiceStatus) {
    if (status === 'void' && !window.confirm(`Void ${inv.invoice_number}? This cannot be undone.`)) {
      return
    }
    setError(null)
    setBusyId(inv.id)
    try {
      await updateInvoice(inv.id, { status })
      await load()
    } catch (err) {
      setError(message(err))
    } finally {
      setBusyId(null)
    }
  }

  function handleDelete(inv: InvoiceWithOrder) {
    deleteWarning.ask({
      title: `Delete invoice ${inv.invoice_number}?`,
      load: () => invoiceWarning(inv.id),
      run: () => deleteInvoice(inv.id),
      onDeleted: load,
    })
  }

  if (loading) return <LoadingState message="Loading invoices…" />

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <h1 className="text-2xl font-bold text-white">Invoices</h1>

      <ErrorBanner message={error} />
      {deleteWarning.dialog}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <SummaryTile label="Invoices" value={String(invoices.length)} />
        <SummaryTile
          label={`Outstanding (${summary.outstandingCount} draft + sent)`}
          value={money(summary.outstanding)}
        />
        <SummaryTile label={`Paid (${summary.paidCount})`} value={money(summary.paid)} />
      </div>

      <Card>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[2fr_1fr]">
          <Field label="Search">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={inputClassName}
              placeholder="Invoice number, customer or vehicle"
            />
          </Field>
          <Field label="Status">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as '' | InvoiceStatus)}
              className={inputClassName}
            >
              {STATUS_FILTERS.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <p className="mt-3 text-sm text-slate-400">
          {filtered.length} of {invoices.length} invoices
        </p>
      </Card>

      {invoices.length === 0 ? (
        <EmptyState message="No invoices yet. Invoices are created on an order's page." />
      ) : filtered.length === 0 ? (
        <EmptyState message="No invoices match this search." />
      ) : (
        <ul className="space-y-2">
          {filtered.map((inv) => {
            const ro = inv.repair_orders
            return (
              <li
                key={inv.id}
                className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-900 p-3"
              >
                <button
                  type="button"
                  onClick={() => setViewingId(inv.id)}
                  className="min-w-0 flex-1 text-left"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-white">{inv.invoice_number}</span>
                    <span
                      className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${STATUS_CLASSES[inv.status]}`}
                    >
                      {INVOICE_STATUS_LABELS[inv.status]}
                    </span>
                    <span className="ml-auto text-base font-bold text-white">
                      {money(Number(inv.total))}
                    </span>
                  </div>
                  <p className="mt-1 break-words text-sm text-slate-200">
                    {orderCustomerName(ro)} · {orderVehicleLabel(ro)}
                  </p>
                  <p className="mt-0.5 text-sm text-slate-400">
                    {ro?.ro_number ?? '—'} · {formatDate(inv.created_at)}
                    {inv.status === 'paid' && inv.paid_at ? ` · Paid ${formatDate(inv.paid_at)}` : ''}
                  </p>
                </button>
                <OverflowMenu
                  label={`Actions for ${inv.invoice_number}`}
                  disabled={busyId === inv.id}
                  items={[
                    { label: 'View', onSelect: () => setViewingId(inv.id) },
                    ...INVOICE_STATUS_TRANSITIONS[inv.status].map((next) => ({
                      label: INVOICE_ACTION_LABELS[next] ?? next,
                      onSelect: () => void handleStatus(inv, next),
                    })),
                    ...(ro
                      ? [{ label: `Open order ${ro.ro_number}`, onSelect: () => onNavigate({ name: 'repair-order', id: ro.id }) }]
                      : []),
                    { label: 'Delete', danger: true, onSelect: () => handleDelete(inv) },
                  ]}
                />
              </li>
            )
          })}
        </ul>
      )}

      {viewing && viewing.repair_orders && (
        <Suspense fallback={null}>
          <InvoicePrintView
            repairOrder={viewing.repair_orders}
            invoice={viewing}
            onClose={() => setViewingId(null)}
            onOpenOrder={() => onNavigate({ name: 'repair-order', id: viewing.repair_orders!.id })}
          />
        </Suspense>
      )}
    </div>
  )
}

function SummaryTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-3">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-0.5 text-xl font-bold text-white">{value}</p>
    </div>
  )
}
