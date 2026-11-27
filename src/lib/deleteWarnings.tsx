// The itemized delete warnings for customers, vehicles, orders, invoices and
// estimates. Each loader reads the live counts / amounts (data.ts) right before
// the dialog shows them.

import {
  customerDeleteImpact,
  estimateDeleteImpact,
  invoiceDeleteImpact,
  orderDeleteImpact,
  vehicleDeleteImpact,
  type InvoiceSummary,
} from './data'
import { formatDate, money } from './format'
import { ESTIMATE_STATUS_LABELS, INVOICE_STATUS_LABELS } from './types'
import { plural, type DeleteWarningContent } from '../components/DeleteWarning'

export async function customerWarning(id: string): Promise<DeleteWarningContent> {
  const n = await customerDeleteImpact(id)
  return {
    deletes: [
      `The customer record`,
      `${cap(plural(n.vehicles, 'vehicle'))} and ${plural(n.appointments, 'appointment')}`,
    ],
    keeps: [
      n.orders === 0
        ? 'No repair orders to detach'
        : `${cap(plural(n.orders, 'repair order'))} — detached (their services, estimates, invoices and history are kept; they show "Deleted customer")`,
    ],
  }
}

export async function vehicleWarning(id: string): Promise<DeleteWarningContent> {
  const n = await vehicleDeleteImpact(id)
  return {
    deletes: ['The vehicle record'],
    keeps: [
      n.orders === 0
        ? 'No repair orders to detach'
        : `${cap(plural(n.orders, 'repair order'))} — detached and kept (they show "Deleted vehicle")`,
      ...(n.appointments > 0
        ? [`${cap(plural(n.appointments, 'appointment'))} — kept, with the vehicle cleared`]
        : []),
    ],
  }
}

function invoiceLine(inv: InvoiceSummary) {
  const base = `${inv.invoice_number} — ${money(inv.total)}, ${INVOICE_STATUS_LABELS[inv.status].toLowerCase()}`
  if (inv.status === 'paid') {
    return (
      <>
        {base} —{' '}
        <strong className="text-rose-300">
          PAID{inv.paid_at ? ` on ${formatDate(inv.paid_at)}` : ''}
        </strong>
      </>
    )
  }
  return base
}

export async function orderWarning(id: string): Promise<DeleteWarningContent> {
  const n = await orderDeleteImpact(id)
  const deletes = [
    `Order ${n.roNumber}`,
    `${cap(plural(n.services, 'service'))}, ${plural(n.estimates, 'estimate')}, ${plural(n.timelogs, 'timelog')}`,
    n.invoices.length === 0 ? 'No invoices' : `${cap(plural(n.invoices.length, 'invoice'))}:`,
    ...n.invoices.map(invoiceLine),
    n.inspection
      ? `The inspection and its ${plural(n.inspection.results, 'result')}`
      : 'No inspection',
  ]
  return {
    deletes,
    keeps: [
      n.appointments === 0
        ? 'No appointments linked'
        : `${cap(plural(n.appointments, 'appointment'))} — kept, with the order cleared`,
    ],
  }
}

export async function invoiceWarning(id: string): Promise<DeleteWarningContent> {
  const inv = await invoiceDeleteImpact(id)
  return { deletes: [<>Invoice {invoiceLine(inv)}</>] }
}

export async function estimateWarning(id: string): Promise<DeleteWarningContent> {
  const est = await estimateDeleteImpact(id)
  return {
    deletes: [`Estimate — ${money(est.total)}, ${ESTIMATE_STATUS_LABELS[est.status].toLowerCase()}`],
  }
}

/** A warning for a single record that has nothing attached (appointment, timelog, …). */
export function simpleWarning(line: string): () => Promise<DeleteWarningContent> {
  return async () => ({ deletes: [line] })
}

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}
