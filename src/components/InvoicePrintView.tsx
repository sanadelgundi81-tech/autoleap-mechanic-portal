import { useEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { money } from '../lib/format'
import {
  buildInvoiceDocument,
  invoiceEmailLink,
  invoiceWhatsAppLink,
  type SendLink,
} from '../lib/invoiceDocument'
import type { Invoice, RepairOrder } from '../lib/types'

/** Class on <html> while the view is open; the print stylesheet keys off it. */
export const PRINT_OPEN_CLASS = 'invoice-print-open'

/**
 * A printable invoice, shown over the app and rendered outside #root so the
 * print stylesheet (index.css) can hide the whole app and print only this.
 * Opening it starts the browser's print flow once.
 */
export function InvoicePrintView({
  repairOrder,
  invoice,
  onClose,
}: {
  repairOrder: RepairOrder
  invoice: Invoice
  onClose: () => void
}) {
  const doc = buildInvoiceDocument(repairOrder, invoice)
  const email = invoiceEmailLink(doc)
  const whatsApp = invoiceWhatsAppLink(doc)

  // Kept in a ref so a parent re-render never re-runs the effect (and re-prints).
  const closeRef = useRef(onClose)
  closeRef.current = onClose

  useEffect(() => {
    const root = document.documentElement
    root.classList.add(PRINT_OPEN_CLASS)
    // Let the view paint before the print dialog opens.
    const timer = window.setTimeout(() => window.print(), 100)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeRef.current()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('keydown', onKey)
      root.classList.remove(PRINT_OPEN_CLASS)
    }
  }, [])

  return createPortal(
    <div
      className="invoice-print-root fixed inset-0 z-50 overflow-y-auto bg-slate-950/90 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Invoice ${doc.invoiceNumber}`}
    >
      <div className="no-print mx-auto mb-4 max-w-3xl space-y-3 rounded-lg border border-slate-700 bg-slate-900 p-4 text-sm text-slate-200">
        <div className="flex flex-wrap gap-2">
          <ToolbarButton onClick={() => window.print()} primary>
            Print
          </ToolbarButton>
          <SendButton link={email} label="Send via email" />
          <SendButton link={whatsApp} label="Send via WhatsApp" newTab />
          <ToolbarButton onClick={onClose}>Close</ToolbarButton>
        </div>
        {email.reason && <p className="text-xs text-amber-300">Email: {email.reason}</p>}
        {whatsApp.reason && <p className="text-xs text-amber-300">WhatsApp: {whatsApp.reason}</p>}
        <p className="text-xs text-slate-400">
          The app doesn't attach the PDF: print this invoice to PDF first, then attach it to the
          email or WhatsApp message before sending.
        </p>
        {!doc.linesMatchSubtotal && (
          <p className="text-xs text-slate-400">
            This invoice's subtotal was adjusted, so it is not labor + parts. The invoice's own
            subtotal, tax and total are what's printed as owed.
          </p>
        )}
      </div>

      <article className="invoice-print-sheet mx-auto max-w-3xl rounded-lg bg-white p-8 text-black shadow-xl">
        <header className="flex flex-wrap items-start justify-between gap-4 border-b border-gray-300 pb-4">
          <h1 className="text-3xl font-bold tracking-tight">Invoice</h1>
          <dl className="text-right text-sm">
            <Row label="Invoice no.">{doc.invoiceNumber}</Row>
            <Row label="Date">{doc.date}</Row>
            <Row label="Status">{doc.paymentStatus}</Row>
          </dl>
        </header>

        <section className="grid grid-cols-2 gap-6 py-4 text-sm">
          <div>
            <h2 className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-600">
              Bill to
            </h2>
            <p className="font-semibold">{doc.customer.name}</p>
            {doc.customer.phone && <p>{doc.customer.phone}</p>}
            {doc.customer.email && <p>{doc.customer.email}</p>}
          </div>
          <div>
            <h2 className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-600">
              Vehicle
            </h2>
            {doc.vehicle ? (
              <>
                <p className="font-semibold">{doc.vehicle.label}</p>
                {doc.vehicle.plate && <p>Plate {doc.vehicle.plate}</p>}
              </>
            ) : (
              <p>No vehicle on file</p>
            )}
          </div>
        </section>

        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-gray-400 text-left">
              <th className="py-2 font-semibold">Description</th>
              <th className="py-2 text-right font-semibold">Amount</th>
            </tr>
          </thead>
          <tbody>
            {doc.lines.map((line) => (
              <tr key={line.label} className="border-b border-gray-200">
                <td className="py-2">
                  {line.label}
                  {line.detail && <span className="ml-2 text-gray-600">{line.detail}</span>}
                </td>
                <td className="py-2 text-right">{money(line.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <dl className="ml-auto mt-4 w-64 space-y-1 text-sm">
          <Total label={doc.linesMatchSubtotal ? 'Subtotal' : 'Subtotal (as invoiced)'}>
            {money(doc.subtotal)}
          </Total>
          <Total label="Tax">{money(doc.tax)}</Total>
          <div className="flex justify-between border-t border-gray-400 pt-2 text-base font-bold">
            <dt>Total</dt>
            <dd>{money(doc.total)}</dd>
          </div>
        </dl>

        <p className="mt-6 border-t border-gray-300 pt-3 text-sm">
          <span className="font-semibold">Payment status:</span> {doc.paymentStatus}
        </p>
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

function Total({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex justify-between">
      <dt className="text-gray-700">{label}</dt>
      <dd>{children}</dd>
    </div>
  )
}

const BUTTON =
  'rounded-lg px-3 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50'
const PRIMARY = `${BUTTON} bg-blue-600 text-white hover:bg-blue-500`
const SECONDARY = `${BUTTON} border border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700`

function ToolbarButton({
  children,
  onClick,
  primary = false,
}: {
  children: ReactNode
  onClick: () => void
  primary?: boolean
}) {
  return (
    <button type="button" onClick={onClick} className={primary ? PRIMARY : SECONDARY}>
      {children}
    </button>
  )
}

/** Opens the shop's own email / WhatsApp. The app itself never sends anything. */
function SendButton({ link, label, newTab = false }: { link: SendLink; label: string; newTab?: boolean }) {
  if (link.href === null) {
    return (
      <button type="button" disabled title={link.reason} className={SECONDARY}>
        {label}
      </button>
    )
  }
  return (
    <a
      href={link.href}
      className={SECONDARY}
      {...(newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {label}
    </a>
  )
}
