// The printable invoice and its send links. Pure functions only: everything
// comes from the repair order and the invoice as stored. Nothing is invented —
// no shop details (none are stored), no extra line items.
import { formatDate, money, vehicleLabel } from './format'
import { INVOICE_STATUS_LABELS, type Invoice, type RepairOrder } from './types'

export interface InvoiceLine {
  label: string
  /** e.g. "2.5 hrs × $120.00/hr"; empty for parts. */
  detail: string
  amount: number
}

export interface InvoiceDocument {
  invoiceNumber: string
  /** The invoice's created date, formatted like the rest of the app. */
  date: string
  status: Invoice['status']
  statusLabel: string
  /** Formatted paid date, only for a paid invoice. */
  paidDate: string | null
  /** "Paid on Nov 17, 2026", "Sent · not yet paid", "Draft", "Void". */
  paymentStatus: string
  customer: { name: string; phone: string | null; email: string | null }
  /** Null when the order carries no vehicle. */
  vehicle: { label: string; plate: string | null } | null
  /** The order's labor (hours × rate) and parts. Reference lines only. */
  lines: InvoiceLine[]
  /** The invoice's own stored amounts: the authority for what is owed. */
  subtotal: number
  tax: number
  total: number
  /** False when the stored subtotal is not labor + parts (it was adjusted on the invoice). */
  linesMatchSubtotal: boolean
}

function cents(value: number): number {
  return Math.round(value * 100) / 100
}

function clean(value: string | null | undefined): string | null {
  const trimmed = (value ?? '').trim()
  return trimmed === '' ? null : trimmed
}

export function paymentStatusText(invoice: Pick<Invoice, 'status' | 'paid_at'>): string {
  if (invoice.status === 'paid') {
    return invoice.paid_at ? `Paid on ${formatDate(invoice.paid_at)}` : 'Paid'
  }
  if (invoice.status === 'sent') return 'Sent · not yet paid'
  return INVOICE_STATUS_LABELS[invoice.status]
}

export function buildInvoiceDocument(ro: RepairOrder, invoice: Invoice): InvoiceDocument {
  const laborHours = Number(ro.labor_hours)
  const laborRate = Number(ro.labor_rate)
  const labor = cents(laborHours * laborRate)
  const parts = cents(Number(ro.parts_total))
  const subtotal = Number(invoice.subtotal)
  const v = ro.vehicles ?? null
  return {
    invoiceNumber: invoice.invoice_number,
    date: formatDate(invoice.created_at),
    status: invoice.status,
    statusLabel: INVOICE_STATUS_LABELS[invoice.status],
    paidDate: invoice.status === 'paid' && invoice.paid_at ? formatDate(invoice.paid_at) : null,
    paymentStatus: paymentStatusText(invoice),
    customer: {
      name: ro.customers?.name ?? 'Customer',
      phone: clean(ro.customers?.phone),
      email: clean(ro.customers?.email),
    },
    vehicle: v ? { label: vehicleLabel(v), plate: clean(v.license_plate) } : null,
    lines: [
      {
        label: 'Labor',
        detail: `${laborHours.toFixed(1)} hrs × ${money(laborRate)}/hr`,
        amount: labor,
      },
      { label: 'Parts', detail: '', amount: parts },
    ],
    subtotal,
    tax: Number(invoice.tax),
    total: Number(invoice.total),
    linesMatchSubtotal: cents(labor + parts) === cents(subtotal),
  }
}

function vehicleText(doc: InvoiceDocument): string {
  if (!doc.vehicle) return 'No vehicle on file'
  return doc.vehicle.plate ? `${doc.vehicle.label} (${doc.vehicle.plate})` : doc.vehicle.label
}

/** The short summary used as the email body and the WhatsApp message. */
export function invoiceSummaryText(doc: InvoiceDocument): string {
  return [
    `Hello ${doc.customer.name},`,
    '',
    `Here is your invoice ${doc.invoiceNumber}, dated ${doc.date}.`,
    `Vehicle: ${vehicleText(doc)}`,
    `Total: ${money(doc.total)}`,
    `Status: ${doc.paymentStatus}`,
    '',
    'Thank you.',
  ].join('\n')
}

export type SendLink = { href: string; reason: null } | { href: null; reason: string }

const EMAIL_SHAPE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** mailto: link to the customer's stored email; disabled with a reason when there is none. */
export function invoiceEmailLink(doc: InvoiceDocument): SendLink {
  const email = doc.customer.email
  if (!email) return { href: null, reason: 'No email on file for this customer.' }
  if (!EMAIL_SHAPE.test(email)) {
    return { href: null, reason: `The stored email "${email}" doesn't look like an email address.` }
  }
  // encodeURIComponent, not URLSearchParams: mail apps show a "+" literally.
  const subject = encodeURIComponent(`Invoice ${doc.invoiceNumber}`)
  const body = encodeURIComponent(invoiceSummaryText(doc))
  return { href: `mailto:${email}?subject=${subject}&body=${body}`, reason: null }
}

export interface WhatsAppNumber {
  /** Digits as wa.me wants them: country code first, no "+". */
  digits: string
  /** The stored number already carried its country code ("+…" or "00…"). */
  international: boolean
  /** The shop's default country code was put in front. */
  codeAdded: boolean
}

/**
 * How a stored phone becomes a wa.me number. Spaces, dashes and brackets are
 * removed first. Then:
 * - "+44 …" or "0044 …" already has its country code: used as is (without + / 00).
 * - Otherwise, with a default country code set: one leading 0 (the trunk
 *   prefix) is dropped and the code is put in front: "020 7946 0018" + 44 →
 *   442079460018.
 * - Otherwise (no default set): the digits exactly as stored.
 * Null when anything other than digits is left (e.g. "ext 2").
 */
export function resolveWhatsAppNumber(
  phone: string | null,
  defaultCountryCode: string | null = null,
): WhatsAppNumber | null {
  if (!phone) return null
  const cleaned = phone.trim().replace(/[\s\-()[\]]/g, '')
  let digits = cleaned
  let international = false
  if (cleaned.startsWith('+')) {
    digits = cleaned.slice(1)
    international = true
  } else if (cleaned.startsWith('00')) {
    digits = cleaned.slice(2)
    international = true
  }
  if (!/^\d+$/.test(digits)) return null
  if (!international && defaultCountryCode) {
    return { digits: defaultCountryCode + digits.replace(/^0/, ''), international, codeAdded: true }
  }
  return { digits, international, codeAdded: false }
}

/** Just the digits of resolveWhatsAppNumber. */
export function whatsAppDigits(
  phone: string | null,
  defaultCountryCode: string | null = null,
): string | null {
  return resolveWhatsAppNumber(phone, defaultCountryCode)?.digits ?? null
}

/**
 * wa.me link to the customer's stored phone, using the shop's default country
 * code when the phone has none. Disabled with a reason when there is no phone.
 */
export function invoiceWhatsAppLink(
  doc: InvoiceDocument,
  defaultCountryCode: string | null = null,
): SendLink {
  if (!doc.customer.phone) return { href: null, reason: 'No phone on file for this customer.' }
  const digits = whatsAppDigits(doc.customer.phone, defaultCountryCode)
  if (!digits) {
    return {
      href: null,
      reason: `The stored phone "${doc.customer.phone}" has characters other than digits, spaces, dashes and brackets.`,
    }
  }
  return {
    href: `https://wa.me/${digits}?text=${encodeURIComponent(invoiceSummaryText(doc))}`,
    reason: null,
  }
}
