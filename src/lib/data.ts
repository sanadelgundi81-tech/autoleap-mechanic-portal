import { requireClient } from './supabase'
import { formatAppointmentTime, money } from './format'
import type {
  AppNotification,
  Appointment,
  AppointmentStatus,
  Customer,
  CustomerWithVehicles,
  DashboardStats,
  Estimate,
  EstimateStatus,
  Inspection,
  InspectionCounts,
  InspectionResult,
  InspectionResultState,
  InspectionSummary,
  InspectionTemplate,
  InspectionTemplateItem,
  Invoice,
  InvoiceStatus,
  NotificationRelatedType,
  NotificationType,
  OrderService,
  RepairOrder,
  RepairOrderPriority,
  RepairOrderStatus,
  ServiceCounts,
  Vehicle,
} from './types'
import {
  APPOINTMENT_EDITABLE_STATUSES,
  APPOINTMENT_STATUS_TRANSITIONS,
  ESTIMATE_STATUS_TRANSITIONS,
  INVOICE_STATUS_TRANSITIONS,
  REPAIR_ORDER_STATUS_LABELS,
} from './types'

function throwIfError(error: { message: string } | null, what: string): void {
  if (error) throw new Error(`${what}: ${error.message}`)
}

const RO_SELECT =
  '*, customers(id, name, phone, email), vehicles(id, year, make, model, trim, transmission, engine, vin, license_plate, mileage_km)'

// ---------- Dashboard ----------

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const client = requireClient()
  const [activeRos, paidInvoices, allRos, findings] = await Promise.all([
    client
      .from('repair_orders')
      .select('id', { count: 'exact', head: true })
      .is('technician_completed_at', null),
    client.from('invoices').select('total').eq('status', 'paid'),
    client.from('repair_orders').select('labor_hours'),
    client
      .from('inspection_results')
      .select('state')
      .in('state', ['attention', 'failed']),
  ])

  throwIfError(activeRos.error, 'Failed to load active repair orders')
  throwIfError(paidInvoices.error, 'Failed to load paid invoices')
  throwIfError(allRos.error, 'Failed to load repair orders')
  throwIfError(findings.error, 'Failed to load inspection findings')

  const collected = (paidInvoices.data ?? []).reduce(
    (sum, row) => sum + Number(row.total ?? 0),
    0,
  )
  const billedHours = (allRos.data ?? []).reduce(
    (sum, row) => sum + Number(row.labor_hours ?? 0),
    0,
  )
  const states = (findings.data ?? []).map((row) => row.state as InspectionResultState)

  return {
    activeRepairOrders: activeRos.count ?? 0,
    collectedPaidInvoices: collected,
    billedHours,
    openFindings: states.length,
    attentionFindings: states.filter((s) => s === 'attention').length,
    failedFindings: states.filter((s) => s === 'failed').length,
  }
}

export interface OpenFinding {
  id: string
  state: InspectionResultState
  note: string | null
  itemName: string
  roNumber: string
}

export async function fetchOpenInspectionFindings(): Promise<OpenFinding[]> {
  const client = requireClient()
  const { data, error } = await client
    .from('inspection_results')
    .select(
      'id, state, note, inspection_template_items(name), inspections!inner(repair_orders!inner(ro_number))',
    )
    .in('state', ['attention', 'failed'])
    .order('created_at', { ascending: false })
    .limit(10)
  throwIfError(error, 'Failed to load inspection findings')
  return ((data ?? []) as unknown as {
    id: string
    state: InspectionResultState
    note: string | null
    inspection_template_items: { name: string } | null
    inspections: { repair_orders: { ro_number: string } | null } | null
  }[]).map((row) => ({
    id: row.id,
    state: row.state,
    note: row.note,
    itemName: row.inspection_template_items?.name ?? 'Unknown item',
    roNumber: row.inspections?.repair_orders?.ro_number ?? '',
  }))
}

// ---------- Repair orders ----------

export async function fetchRepairOrders(): Promise<RepairOrder[]> {
  const client = requireClient()
  const { data, error } = await client
    .from('repair_orders')
    .select(RO_SELECT)
    .order('created_at', { ascending: true })
  throwIfError(error, 'Failed to load repair orders')
  return (data ?? []) as RepairOrder[]
}

export async function fetchActiveRepairOrders(): Promise<RepairOrder[]> {
  const client = requireClient()
  const { data, error } = await client
    .from('repair_orders')
    .select(RO_SELECT)
    .is('technician_completed_at', null)
    .order('created_at', { ascending: true })
  throwIfError(error, 'Failed to load active repair orders')
  return (data ?? []) as RepairOrder[]
}

export async function fetchVehicleHistory(
  vehicleId: string,
  excludeRepairOrderId: string,
): Promise<RepairOrder[]> {
  const client = requireClient()
  const { data, error } = await client
    .from('repair_orders')
    .select(RO_SELECT)
    .eq('vehicle_id', vehicleId)
    .neq('id', excludeRepairOrderId)
    .order('created_at', { ascending: false })
  throwIfError(error, 'Failed to load vehicle history')
  return (data ?? []) as RepairOrder[]
}

export interface RepairOrderDetail {
  repairOrder: RepairOrder
  estimates: Estimate[]
  invoices: Invoice[]
  inspectionSummary: InspectionSummary
  services: OrderService[]
  appointments: Appointment[]
}

export async function fetchRepairOrderDetail(id: string): Promise<RepairOrderDetail> {
  const client = requireClient()
  const [ro, estimates, invoices, inspection, services, appointments] = await Promise.all([
    client.from('repair_orders').select(RO_SELECT).eq('id', id).single(),
    client
      .from('estimates')
      .select('*')
      .eq('repair_order_id', id)
      .order('created_at', { ascending: false }),
    client
      .from('invoices')
      .select('*')
      .eq('repair_order_id', id)
      .order('created_at', { ascending: false }),
    client
      .from('inspections')
      .select('*, inspection_templates(id, name)')
      .eq('repair_order_id', id)
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle(),
    fetchOrderServices(id),
    fetchAppointmentsByRepairOrder(id),
  ])

  throwIfError(ro.error, 'Failed to load repair order')
  throwIfError(estimates.error, 'Failed to load estimates')
  throwIfError(invoices.error, 'Failed to load invoices')
  throwIfError(inspection.error, 'Failed to load inspection')

  let inspectionSummary: InspectionSummary = { inspection: null, counts: null }
  const found = inspection.data as Inspection | null
  if (found) {
    inspectionSummary = {
      inspection: found,
      counts: await fetchInspectionCounts(found.id),
    }
  }

  return {
    repairOrder: ro.data as RepairOrder,
    estimates: (estimates.data ?? []) as Estimate[],
    invoices: (invoices.data ?? []) as Invoice[],
    inspectionSummary,
    services,
    appointments,
  }
}

export interface NewRepairOrderInput {
  customer_id: string
  vehicle_id: string
  priority: RepairOrderPriority
  concern: string
  technician: string
  bay: string
  labor_hours: number
  labor_rate: number
  parts_total: number
}

export async function createRepairOrder(input: NewRepairOrderInput): Promise<RepairOrder> {
  const client = requireClient()
  const { data, error } = await client
    .from('repair_orders')
    .insert({ ...input, status: 'estimate' })
    .select(RO_SELECT)
    .single()
  throwIfError(error, 'Failed to create repair order')
  return data as RepairOrder
}

export async function updateRepairOrderStatus(
  id: string,
  status: RepairOrderStatus,
): Promise<void> {
  const client = requireClient()
  // Moving into a waiting status creates an order_waiting notification,
  // so read the previous status first (only for those two targets).
  const waiting = status === 'waiting_for_approval' || status === 'waiting_for_parts'
  let previous: { status: RepairOrderStatus; ro_number: string } | null = null
  if (waiting) {
    const { data, error: readError } = await client
      .from('repair_orders')
      .select('status, ro_number')
      .eq('id', id)
      .single()
    throwIfError(readError, 'Failed to load repair order')
    previous = data as { status: RepairOrderStatus; ro_number: string }
  }
  const { error } = await client.from('repair_orders').update({ status }).eq('id', id)
  throwIfError(error, 'Failed to update repair order status')
  if (previous && previous.status !== status) {
    await notify({
      type: 'order_waiting',
      title: `${previous.ro_number} is ${REPAIR_ORDER_STATUS_LABELS[status].toLowerCase()}`,
      body: `Moved from ${REPAIR_ORDER_STATUS_LABELS[previous.status]} to ${REPAIR_ORDER_STATUS_LABELS[status]}.`,
      related_type: 'repair_order',
      related_id: id,
    })
  }
}

/**
 * Mark an order's work complete (completed = true) or reopen it
 * (completed = false, clears the timestamp). This is the
 * technician-completion state that drives the Assigned/Completed
 * tabs — separate from the order status workflow; it does not
 * change the order's status.
 */
export async function setRepairOrderWorkCompleted(
  id: string,
  completed: boolean,
): Promise<void> {
  const client = requireClient()
  const { error } = await client
    .from('repair_orders')
    .update({
      technician_completed_at: completed ? new Date().toISOString() : null,
    })
    .eq('id', id)
  throwIfError(error, 'Failed to update work completion')
}

export interface RepairOrderFieldUpdates {
  odometer_km?: number | null
  priority?: RepairOrderPriority
  shop_notes?: string | null
  customer_recommendations?: string | null
}

export async function updateRepairOrderFields(
  id: string,
  updates: RepairOrderFieldUpdates,
): Promise<void> {
  const client = requireClient()
  const { error } = await client.from('repair_orders').update(updates).eq('id', id)
  throwIfError(error, 'Failed to update repair order')
}

// ---------- Order services ----------

export async function fetchOrderServices(repairOrderId: string): Promise<OrderService[]> {
  const client = requireClient()
  const { data, error } = await client
    .from('repair_order_services')
    .select('*')
    .eq('repair_order_id', repairOrderId)
    .order('position', { ascending: true })
    .order('created_at', { ascending: true })
  throwIfError(error, 'Failed to load services')
  return (data ?? []) as OrderService[]
}

export interface NewOrderServiceInput {
  repair_order_id: string
  name: string
  description: string | null
  labor_hours: number
  labor_rate: number
  parts_total: number
}

/** Adds a service at the end of the order's list (position = max + 1). */
export async function createOrderService(input: NewOrderServiceInput): Promise<OrderService> {
  const client = requireClient()
  const { data: last, error: lastError } = await client
    .from('repair_order_services')
    .select('position')
    .eq('repair_order_id', input.repair_order_id)
    .order('position', { ascending: false })
    .limit(1)
    .maybeSingle()
  throwIfError(lastError, 'Failed to load service positions')
  const position = last ? (last as { position: number }).position + 1 : 0
  const { data, error } = await client
    .from('repair_order_services')
    .insert({ ...input, position })
    .select('*')
    .single()
  throwIfError(error, 'Failed to add service')
  return data as OrderService
}

export interface OrderServiceUpdates {
  name?: string
  description?: string | null
  labor_hours?: number
  labor_rate?: number
  parts_total?: number
  is_done?: boolean
}

export async function updateOrderService(
  id: string,
  updates: OrderServiceUpdates,
): Promise<void> {
  const client = requireClient()
  const { error } = await client.from('repair_order_services').update(updates).eq('id', id)
  throwIfError(error, 'Failed to update service')
}

export async function deleteOrderService(id: string): Promise<void> {
  const client = requireClient()
  const { error } = await client.from('repair_order_services').delete().eq('id', id)
  throwIfError(error, 'Failed to delete service')
}

/** Service progress (done / total) per repair order. Orders with no services are absent. */
export async function fetchServiceCountsByRepairOrder(): Promise<
  Record<string, ServiceCounts>
> {
  const client = requireClient()
  const { data, error } = await client
    .from('repair_order_services')
    .select('repair_order_id, is_done')
  throwIfError(error, 'Failed to load services')
  const counts: Record<string, ServiceCounts> = {}
  for (const row of (data ?? []) as { repair_order_id: string; is_done: boolean }[]) {
    const entry = (counts[row.repair_order_id] ??= { total: 0, done: 0 })
    entry.total += 1
    if (row.is_done) entry.done += 1
  }
  return counts
}

// ---------- Estimates & invoices ----------
// There is no tax rate anywhere: tax is an amount the user enters.
// Totals are always computed here, never typed in:
//   estimate total = labor_total + parts_total + tax
//   invoice total  = subtotal + tax

/** Rounds to cents so stored totals match numeric(10,2). */
function cents(value: number): number {
  return Math.round(value * 100) / 100
}

function requireAmount(value: number, label: string): number {
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(`${label} must be a number of 0 or more.`)
  }
  return cents(value)
}

export interface AmountPrefill {
  labor: number
  parts: number
}

/**
 * Labour/parts prefill for a new estimate: the sums of the order's
 * services (labor_hours × labor_rate, parts_total). With no services,
 * falls back to the order-level labor_hours × labor_rate and parts_total.
 */
export function estimatePrefill(detail: RepairOrderDetail): AmountPrefill {
  const { services, repairOrder: ro } = detail
  if (services.length > 0) {
    return {
      labor: cents(
        services.reduce((sum, s) => sum + Number(s.labor_hours) * Number(s.labor_rate), 0),
      ),
      parts: cents(services.reduce((sum, s) => sum + Number(s.parts_total), 0)),
    }
  }
  return {
    labor: cents(Number(ro.labor_hours) * Number(ro.labor_rate)),
    parts: cents(Number(ro.parts_total)),
  }
}

/**
 * Subtotal prefill for a new invoice: the latest approved estimate's
 * total if there is one, otherwise labour + parts from estimatePrefill.
 */
export function invoiceSubtotalPrefill(detail: RepairOrderDetail): number {
  const approved = detail.estimates
    .filter((e) => e.status === 'approved')
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0]
  if (approved) return cents(Number(approved.total))
  const { labor, parts } = estimatePrefill(detail)
  return cents(labor + parts)
}

async function fetchEstimate(id: string): Promise<Estimate> {
  const client = requireClient()
  const { data, error } = await client.from('estimates').select('*').eq('id', id).single()
  throwIfError(error, 'Failed to load estimate')
  return data as Estimate
}

async function fetchInvoice(id: string): Promise<Invoice> {
  const client = requireClient()
  const { data, error } = await client.from('invoices').select('*').eq('id', id).single()
  throwIfError(error, 'Failed to load invoice')
  return data as Invoice
}

export interface NewEstimateInput {
  repair_order_id: string
  labor_total: number
  parts_total: number
  tax: number
  notes: string | null
}

export async function createEstimate(input: NewEstimateInput): Promise<Estimate> {
  const client = requireClient()
  const labor = requireAmount(input.labor_total, 'Labour')
  const parts = requireAmount(input.parts_total, 'Parts')
  const tax = requireAmount(input.tax, 'Tax')
  const { data, error } = await client
    .from('estimates')
    .insert({
      repair_order_id: input.repair_order_id,
      status: 'draft',
      labor_total: labor,
      parts_total: parts,
      tax,
      total: cents(labor + parts + tax),
      notes: input.notes,
    })
    .select('*')
    .single()
  throwIfError(error, 'Failed to create estimate')
  return data as Estimate
}

export interface EstimateUpdates {
  labor_total?: number
  parts_total?: number
  tax?: number
  notes?: string | null
  status?: EstimateStatus
}

/**
 * Amounts can only change while the estimate is draft; status follows
 * ESTIMATE_STATUS_TRANSITIONS; nothing changes once it is declined.
 * The total is recomputed on every update. The update only applies if
 * the status is still what was read, so two people can't race past
 * the rules.
 */
export async function updateEstimate(id: string, updates: EstimateUpdates): Promise<void> {
  const client = requireClient()
  const current = await fetchEstimate(id)
  if (current.status === 'declined') {
    throw new Error('A declined estimate can no longer be changed.')
  }
  const changesAmounts =
    updates.labor_total !== undefined ||
    updates.parts_total !== undefined ||
    updates.tax !== undefined
  if (changesAmounts && current.status !== 'draft') {
    throw new Error('Only a draft estimate can have its amounts edited.')
  }
  if (
    updates.status !== undefined &&
    updates.status !== current.status &&
    !ESTIMATE_STATUS_TRANSITIONS[current.status].includes(updates.status)
  ) {
    throw new Error(`An estimate can't move from ${current.status} to ${updates.status}.`)
  }
  const labor = requireAmount(updates.labor_total ?? Number(current.labor_total), 'Labour')
  const parts = requireAmount(updates.parts_total ?? Number(current.parts_total), 'Parts')
  const tax = requireAmount(updates.tax ?? Number(current.tax), 'Tax')
  const { data, error } = await client
    .from('estimates')
    .update({
      ...updates,
      labor_total: labor,
      parts_total: parts,
      tax,
      total: cents(labor + parts + tax),
    })
    .eq('id', id)
    .eq('status', current.status)
    .select('id')
  throwIfError(error, 'Failed to update estimate')
  if (!data || data.length === 0) {
    throw new Error('The estimate changed while you were editing it. Reload and try again.')
  }
  if (updates.status !== undefined && updates.status !== current.status) {
    const event = ESTIMATE_NOTIFICATIONS[updates.status]
    if (event) {
      const ro = await roNumberFor(current.repair_order_id)
      await notify({
        type: event.type,
        title: `Estimate ${event.verb} — ${ro}`,
        body: `Total ${money(cents(labor + parts + tax))}`,
        related_type: 'repair_order',
        related_id: current.repair_order_id,
      })
    }
  }
}

const ESTIMATE_NOTIFICATIONS: Partial<
  Record<EstimateStatus, { type: NotificationType; verb: string }>
> = {
  sent: { type: 'estimate_sent', verb: 'sent' },
  approved: { type: 'estimate_approved', verb: 'approved' },
  declined: { type: 'estimate_declined', verb: 'declined' },
}

const INVOICE_NOTIFICATIONS: Partial<
  Record<InvoiceStatus, { type: NotificationType; verb: string }>
> = {
  sent: { type: 'invoice_sent', verb: 'sent' },
  paid: { type: 'invoice_paid', verb: 'paid' },
  void: { type: 'invoice_void', verb: 'voided' },
}

export async function deleteEstimate(id: string): Promise<void> {
  const client = requireClient()
  const { data, error } = await client
    .from('estimates')
    .delete()
    .eq('id', id)
    .eq('status', 'draft')
    .select('id')
  throwIfError(error, 'Failed to delete estimate')
  if (!data || data.length === 0) {
    throw new Error('Only a draft estimate can be deleted.')
  }
}

export interface NewInvoiceInput {
  repair_order_id: string
  subtotal: number
  tax: number
}

/** invoice_number is NOT set here: the database default fills INV-####. */
export async function createInvoice(input: NewInvoiceInput): Promise<Invoice> {
  const client = requireClient()
  const subtotal = requireAmount(input.subtotal, 'Subtotal')
  const tax = requireAmount(input.tax, 'Tax')
  const { data, error } = await client
    .from('invoices')
    .insert({
      repair_order_id: input.repair_order_id,
      status: 'draft',
      subtotal,
      tax,
      total: cents(subtotal + tax),
    })
    .select('*')
    .single()
  throwIfError(error, 'Failed to create invoice')
  return data as Invoice
}

export interface InvoiceUpdates {
  subtotal?: number
  tax?: number
  status?: InvoiceStatus
}

/**
 * Amounts can only change while the invoice is draft; status follows
 * INVOICE_STATUS_TRANSITIONS; nothing changes once it is void.
 * Moving to 'paid' sets paid_at to now; moving away from 'paid'
 * clears it. The total is recomputed on every update.
 */
export async function updateInvoice(id: string, updates: InvoiceUpdates): Promise<void> {
  const client = requireClient()
  const current = await fetchInvoice(id)
  if (current.status === 'void') {
    throw new Error('A void invoice can no longer be changed.')
  }
  const changesAmounts = updates.subtotal !== undefined || updates.tax !== undefined
  if (changesAmounts && current.status !== 'draft') {
    throw new Error('Only a draft invoice can have its amounts edited.')
  }
  const nextStatus = updates.status ?? current.status
  if (
    nextStatus !== current.status &&
    !INVOICE_STATUS_TRANSITIONS[current.status].includes(nextStatus)
  ) {
    throw new Error(`An invoice can't move from ${current.status} to ${nextStatus}.`)
  }
  const subtotal = requireAmount(updates.subtotal ?? Number(current.subtotal), 'Subtotal')
  const tax = requireAmount(updates.tax ?? Number(current.tax), 'Tax')
  let paidAt = current.paid_at
  if (nextStatus === 'paid' && current.status !== 'paid') paidAt = new Date().toISOString()
  if (nextStatus !== 'paid') paidAt = null
  const { data, error } = await client
    .from('invoices')
    .update({
      subtotal,
      tax,
      total: cents(subtotal + tax),
      status: nextStatus,
      paid_at: paidAt,
    })
    .eq('id', id)
    .eq('status', current.status)
    .select('id')
  throwIfError(error, 'Failed to update invoice')
  if (!data || data.length === 0) {
    throw new Error('The invoice changed while you were editing it. Reload and try again.')
  }
  if (nextStatus !== current.status) {
    const event = INVOICE_NOTIFICATIONS[nextStatus]
    if (event) {
      const ro = await roNumberFor(current.repair_order_id)
      await notify({
        type: event.type,
        title: `Invoice ${current.invoice_number} ${event.verb} — ${ro}`,
        body: `Total ${money(cents(subtotal + tax))}`,
        related_type: 'repair_order',
        related_id: current.repair_order_id,
      })
    }
  }
}

export async function deleteInvoice(id: string): Promise<void> {
  const client = requireClient()
  const { data, error } = await client
    .from('invoices')
    .delete()
    .eq('id', id)
    .eq('status', 'draft')
    .select('id')
  throwIfError(error, 'Failed to delete invoice')
  if (!data || data.length === 0) {
    throw new Error('Only a draft invoice can be deleted.')
  }
}

// ---------- Appointments ----------
// A customer is required; the vehicle and repair order are optional
// (a booking can exist before any repair order). Deleting a repair
// order keeps its appointments (FK is SET NULL); deleting a customer
// deletes theirs (CASCADE). Times are timestamptz, sent as ISO strings.

const APPOINTMENT_SELECT =
  '*, customers(id, name), vehicles(id, year, make, model, trim, license_plate), repair_orders(id, ro_number)'

/** All appointments with customer, vehicle and order joined, earliest start first. */
export async function fetchAppointments(): Promise<Appointment[]> {
  const client = requireClient()
  const { data, error } = await client
    .from('appointments')
    .select(APPOINTMENT_SELECT)
    .order('starts_at', { ascending: true })
  throwIfError(error, 'Failed to load appointments')
  return (data ?? []) as Appointment[]
}

export async function fetchAppointmentsByRepairOrder(
  repairOrderId: string,
): Promise<Appointment[]> {
  const client = requireClient()
  const { data, error } = await client
    .from('appointments')
    .select(APPOINTMENT_SELECT)
    .eq('repair_order_id', repairOrderId)
    .order('starts_at', { ascending: true })
  throwIfError(error, 'Failed to load appointments')
  return (data ?? []) as Appointment[]
}

export async function fetchAppointmentsByCustomer(customerId: string): Promise<Appointment[]> {
  const client = requireClient()
  const { data, error } = await client
    .from('appointments')
    .select(APPOINTMENT_SELECT)
    .eq('customer_id', customerId)
    .order('starts_at', { ascending: true })
  throwIfError(error, 'Failed to load appointments')
  return (data ?? []) as Appointment[]
}

/** Rejects a missing/invalid start, or an end that is not after the start. */
function checkAppointmentTimes(startsAt: string, endsAt: string | null): void {
  const start = new Date(startsAt).getTime()
  if (Number.isNaN(start)) throw new Error('A valid start time is required.')
  if (endsAt !== null) {
    const end = new Date(endsAt).getTime()
    if (Number.isNaN(end)) throw new Error('The end time is not valid.')
    if (end <= start) throw new Error('The end time must be after the start time.')
  }
}

/** The vehicle on an appointment must belong to the appointment's customer. */
async function checkVehicleBelongsToCustomer(
  vehicleId: string | null,
  customerId: string,
): Promise<void> {
  if (vehicleId === null) return
  const client = requireClient()
  const { data, error } = await client
    .from('vehicles')
    .select('customer_id')
    .eq('id', vehicleId)
    .single()
  throwIfError(error, 'Failed to load vehicle')
  if ((data as { customer_id: string }).customer_id !== customerId) {
    throw new Error("That vehicle doesn't belong to this customer.")
  }
}

/** A linked repair order must belong to the appointment's customer. */
async function checkOrderBelongsToCustomer(
  repairOrderId: string | null,
  customerId: string,
): Promise<void> {
  if (repairOrderId === null) return
  const client = requireClient()
  const { data, error } = await client
    .from('repair_orders')
    .select('customer_id')
    .eq('id', repairOrderId)
    .single()
  throwIfError(error, 'Failed to load repair order')
  if ((data as { customer_id: string }).customer_id !== customerId) {
    throw new Error("That repair order doesn't belong to this customer.")
  }
}

export interface NewAppointmentInput {
  customer_id: string
  vehicle_id: string | null
  repair_order_id: string | null
  starts_at: string
  ends_at: string | null
  service: string | null
  notes: string | null
}

export async function createAppointment(input: NewAppointmentInput): Promise<Appointment> {
  const client = requireClient()
  if (!input.customer_id) throw new Error('A customer is required.')
  checkAppointmentTimes(input.starts_at, input.ends_at)
  await checkVehicleBelongsToCustomer(input.vehicle_id, input.customer_id)
  await checkOrderBelongsToCustomer(input.repair_order_id, input.customer_id)
  const { data, error } = await client
    .from('appointments')
    .insert({ ...input, status: 'booked' })
    .select(APPOINTMENT_SELECT)
    .single()
  throwIfError(error, 'Failed to book appointment')
  const created = data as Appointment
  await notify({
    type: 'appointment_created',
    title: `Appointment booked — ${created.customers?.name ?? 'customer'}`,
    body: appointmentSummary(created),
    related_type: 'appointment',
    related_id: created.id,
  })
  return created
}

function appointmentSummary(a: Appointment): string {
  return [formatAppointmentTime(a.starts_at, a.ends_at), a.service].filter(Boolean).join(' · ')
}

export interface AppointmentUpdates {
  starts_at?: string
  ends_at?: string | null
  service?: string | null
  notes?: string | null
  vehicle_id?: string | null
  status?: AppointmentStatus
}

/**
 * Time/service/vehicle (and notes) can only change while booked or
 * confirmed; status follows APPOINTMENT_STATUS_TRANSITIONS; completed,
 * cancelled and no_show are terminal. The update only applies if the
 * status is still what was read.
 */
export async function updateAppointment(id: string, updates: AppointmentUpdates): Promise<void> {
  const client = requireClient()
  const { data: found, error: findError } = await client
    .from('appointments')
    .select(APPOINTMENT_SELECT)
    .eq('id', id)
    .single()
  throwIfError(findError, 'Failed to load appointment')
  const current = found as Appointment
  if (APPOINTMENT_STATUS_TRANSITIONS[current.status].length === 0) {
    throw new Error(`A ${current.status.replace('_', '-')} appointment can no longer be changed.`)
  }
  const { status, ...details } = updates
  const changesDetails = Object.values(details).some((v) => v !== undefined)
  if (changesDetails && !APPOINTMENT_EDITABLE_STATUSES.includes(current.status)) {
    throw new Error('Only a booked or confirmed appointment can be edited.')
  }
  if (
    status !== undefined &&
    status !== current.status &&
    !APPOINTMENT_STATUS_TRANSITIONS[current.status].includes(status)
  ) {
    throw new Error(`An appointment can't move from ${current.status} to ${status}.`)
  }
  checkAppointmentTimes(
    updates.starts_at ?? current.starts_at,
    updates.ends_at !== undefined ? updates.ends_at : current.ends_at,
  )
  if (updates.vehicle_id !== undefined) {
    await checkVehicleBelongsToCustomer(updates.vehicle_id, current.customer_id)
  }
  const { data, error } = await client
    .from('appointments')
    .update(updates)
    .eq('id', id)
    .eq('status', current.status)
    .select('id')
  throwIfError(error, 'Failed to update appointment')
  if (!data || data.length === 0) {
    throw new Error('The appointment changed while you were editing it. Reload and try again.')
  }
  if ((status === 'cancelled' || status === 'no_show') && status !== current.status) {
    await notify({
      type: 'appointment_cancelled',
      title: `${status === 'cancelled' ? 'Appointment cancelled' : 'Appointment marked no-show'} — ${
        current.customers?.name ?? 'customer'
      }`,
      body: appointmentSummary(current),
      related_type: 'appointment',
      related_id: id,
    })
  }
}

export async function deleteAppointment(id: string): Promise<void> {
  const client = requireClient()
  const { data, error } = await client
    .from('appointments')
    .delete()
    .eq('id', id)
    .in('status', APPOINTMENT_EDITABLE_STATUSES)
    .select('id')
  throwIfError(error, 'Failed to delete appointment')
  if (!data || data.length === 0) {
    throw new Error('Only a booked or confirmed appointment can be deleted.')
  }
}

// ---------- Notifications ----------
// In-app only (no push/email/SMS). Rows are created ONLY by notify(),
// which is called ONLY from these event sites in this file:
//   createAppointment (appointment_created), updateAppointment
//   (appointment_cancelled for cancelled / no_show), updateEstimate
//   (estimate_sent / _approved / _declined), updateInvoice (invoice_sent /
//   _paid / _void), updateRepairOrderStatus (order_waiting).

interface NewNotification {
  type: NotificationType
  title: string
  body: string | null
  related_type: NotificationRelatedType
  related_id: string
}

/**
 * Internal: inserts one notification row. The event's own change is
 * already saved when this runs, so a failed insert is logged rather than
 * thrown — a missing notification must not make a saved booking or
 * payment look like it failed.
 */
async function notify(notification: NewNotification): Promise<void> {
  try {
    const client = requireClient()
    const { error } = await client.from('notifications').insert(notification)
    if (error) console.error(`Failed to create notification: ${error.message}`)
  } catch (err) {
    console.error('Failed to create notification:', err)
  }
}

/** RO number for notification titles; falls back to a generic label. */
async function roNumberFor(repairOrderId: string): Promise<string> {
  const client = requireClient()
  const { data } = await client
    .from('repair_orders')
    .select('ro_number')
    .eq('id', repairOrderId)
    .maybeSingle()
  return (data as { ro_number: string } | null)?.ro_number ?? 'repair order'
}

/** All notifications: unread first, then newest first. */
export async function fetchNotifications(): Promise<AppNotification[]> {
  const client = requireClient()
  const { data, error } = await client
    .from('notifications')
    .select('*')
    .order('is_read', { ascending: true })
    .order('created_at', { ascending: false })
  throwIfError(error, 'Failed to load notifications')
  return (data ?? []) as AppNotification[]
}

export async function fetchUnreadNotificationCount(): Promise<number> {
  const client = requireClient()
  const { count, error } = await client
    .from('notifications')
    .select('id', { count: 'exact', head: true })
    .eq('is_read', false)
  throwIfError(error, 'Failed to count notifications')
  return count ?? 0
}

/** Marks one notification read (keeps the original read_at if already read). */
export async function markNotificationRead(id: string): Promise<void> {
  const client = requireClient()
  const { error } = await client
    .from('notifications')
    .update({ is_read: true, read_at: new Date().toISOString() })
    .eq('id', id)
    .eq('is_read', false)
  throwIfError(error, 'Failed to mark notification read')
}

export async function markAllNotificationsRead(): Promise<void> {
  const client = requireClient()
  const { error } = await client
    .from('notifications')
    .update({ is_read: true, read_at: new Date().toISOString() })
    .eq('is_read', false)
  throwIfError(error, 'Failed to mark notifications read')
}

export async function deleteNotification(id: string): Promise<void> {
  const client = requireClient()
  const { data, error } = await client.from('notifications').delete().eq('id', id).select('id')
  throwIfError(error, 'Failed to delete notification')
  if (!data || data.length === 0) throw new Error('That notification was already deleted.')
}

export interface NotificationTarget {
  kind: 'repair_order' | 'appointment' | 'customer'
  id: string
}

/**
 * Where a notification should open. Estimates and invoices open their
 * repair order. Returns null when the related record no longer exists.
 */
export async function resolveNotificationTarget(
  notification: AppNotification,
): Promise<NotificationTarget | null> {
  const { related_type: type, related_id: id } = notification
  if (!type || !id) return null
  const client = requireClient()
  if (type === 'estimate' || type === 'invoice') {
    const { data, error } = await client
      .from(type === 'estimate' ? 'estimates' : 'invoices')
      .select('repair_order_id')
      .eq('id', id)
      .maybeSingle()
    throwIfError(error, 'Failed to load the related record')
    const roId = (data as { repair_order_id: string } | null)?.repair_order_id
    return roId ? { kind: 'repair_order', id: roId } : null
  }
  const table =
    type === 'repair_order' ? 'repair_orders' : type === 'appointment' ? 'appointments' : 'customers'
  const { data, error } = await client.from(table).select('id').eq('id', id).maybeSingle()
  throwIfError(error, 'Failed to load the related record')
  return data ? { kind: type, id } : null
}

// ---------- Inspections ----------

export async function fetchActiveInspectionTemplate(): Promise<{
  template: InspectionTemplate
  items: InspectionTemplateItem[]
}> {
  const client = requireClient()
  const { data: template, error: templateError } = await client
    .from('inspection_templates')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: true })
    .limit(1)
    .single()
  throwIfError(templateError, 'Failed to load inspection template')
  const { data: items, error: itemsError } = await client
    .from('inspection_template_items')
    .select('*')
    .eq('template_id', (template as InspectionTemplate).id)
    .order('section_order', { ascending: true })
    .order('position', { ascending: true })
  throwIfError(itemsError, 'Failed to load inspection template items')
  return {
    template: template as InspectionTemplate,
    items: (items ?? []) as InspectionTemplateItem[],
  }
}

export async function getOrCreateInspection(
  repairOrderId: string,
  assignedTo: string | null,
): Promise<Inspection> {
  const client = requireClient()
  const { template } = await fetchActiveInspectionTemplate()
  const { data: existing, error: existingError } = await client
    .from('inspections')
    .select('*, inspection_templates(id, name)')
    .eq('repair_order_id', repairOrderId)
    .eq('template_id', template.id)
    .maybeSingle()
  throwIfError(existingError, 'Failed to load inspection')
  if (existing) return existing as Inspection
  const { data, error } = await client
    .from('inspections')
    .insert({
      repair_order_id: repairOrderId,
      template_id: template.id,
      status: 'in_progress',
      assigned_to: assignedTo,
    })
    .select('*, inspection_templates(id, name)')
    .single()
  throwIfError(error, 'Failed to start inspection')
  return data as Inspection
}

export async function fetchInspectionCountsByRepairOrder(): Promise<
  Record<string, InspectionCounts>
> {
  const client = requireClient()
  const { data, error } = await client
    .from('inspections')
    .select('id, repair_order_id')
  throwIfError(error, 'Failed to load inspections')
  const counts: Record<string, InspectionCounts> = {}
  for (const row of (data ?? []) as { id: string; repair_order_id: string }[]) {
    counts[row.repair_order_id] = await fetchInspectionCounts(row.id)
  }
  return counts
}

export async function fetchInspectionCounts(inspectionId: string): Promise<InspectionCounts> {
  const client = requireClient()
  const { data: inspection, error: inspectionError } = await client
    .from('inspections')
    .select('template_id')
    .eq('id', inspectionId)
    .single()
  throwIfError(inspectionError, 'Failed to load inspection')
  const templateId = (inspection as { template_id: string }).template_id
  const [items, results] = await Promise.all([
    client
      .from('inspection_template_items')
      .select('id', { count: 'exact', head: true })
      .eq('template_id', templateId),
    client.from('inspection_results').select('state').eq('inspection_id', inspectionId),
  ])
  throwIfError(items.error, 'Failed to count inspection items')
  throwIfError(results.error, 'Failed to load inspection results')
  const states = (results.data ?? []).map((row) => row.state as InspectionResultState)
  const total = items.count ?? 0
  return {
    total,
    good: states.filter((s) => s === 'good').length,
    attention: states.filter((s) => s === 'attention').length,
    failed: states.filter((s) => s === 'failed').length,
    unmarked: total - states.length,
  }
}

export interface InspectionDetail {
  inspection: Inspection
  template: InspectionTemplate
  items: InspectionTemplateItem[]
  results: Map<string, InspectionResult>
  counts: InspectionCounts
}

export async function fetchInspectionDetail(inspectionId: string): Promise<InspectionDetail> {
  const client = requireClient()
  const { data: inspection, error: inspectionError } = await client
    .from('inspections')
    .select('*, inspection_templates(id, name)')
    .eq('id', inspectionId)
    .single()
  throwIfError(inspectionError, 'Failed to load inspection')
  const found = inspection as Inspection
  const { data: template, error: templateError } = await client
    .from('inspection_templates')
    .select('*')
    .eq('id', found.template_id)
    .single()
  throwIfError(templateError, 'Failed to load inspection template')
  const { data: items, error: itemsError } = await client
    .from('inspection_template_items')
    .select('*')
    .eq('template_id', found.template_id)
    .order('section_order', { ascending: true })
    .order('position', { ascending: true })
  throwIfError(itemsError, 'Failed to load inspection items')
  const { data: results, error: resultsError } = await client
    .from('inspection_results')
    .select('*')
    .eq('inspection_id', inspectionId)
  throwIfError(resultsError, 'Failed to load inspection results')

  const resultMap = new Map<string, InspectionResult>()
  for (const row of (results ?? []) as InspectionResult[]) {
    resultMap.set(row.template_item_id, row)
  }
  const itemList = (items ?? []) as InspectionTemplateItem[]
  const states = [...resultMap.values()].map((r) => r.state)
  return {
    inspection: found,
    template: template as InspectionTemplate,
    items: itemList,
    results: resultMap,
    counts: {
      total: itemList.length,
      good: states.filter((s) => s === 'good').length,
      attention: states.filter((s) => s === 'attention').length,
      failed: states.filter((s) => s === 'failed').length,
      unmarked: itemList.length - states.length,
    },
  }
}

/**
 * Mark an item (or unmark it when state is null — the result row
 * is deleted, so unmarked = no row).
 */
export async function setInspectionResult(
  inspectionId: string,
  templateItemId: string,
  state: InspectionResultState | null,
  note: string | null,
): Promise<void> {
  const client = requireClient()
  if (state === null) {
    const { error } = await client
      .from('inspection_results')
      .delete()
      .eq('inspection_id', inspectionId)
      .eq('template_item_id', templateItemId)
    throwIfError(error, 'Failed to clear inspection result')
    return
  }
  const { error } = await client.from('inspection_results').upsert(
    {
      inspection_id: inspectionId,
      template_item_id: templateItemId,
      state,
      note: note ?? null,
    },
    { onConflict: 'inspection_id,template_item_id' },
  )
  throwIfError(error, 'Failed to save inspection result')
}

export async function completeInspection(inspectionId: string): Promise<void> {
  const client = requireClient()
  const { error } = await client
    .from('inspections')
    .update({ status: 'complete', completed_at: new Date().toISOString() })
    .eq('id', inspectionId)
  throwIfError(error, 'Failed to complete inspection')
}

export async function reopenInspection(inspectionId: string): Promise<void> {
  const client = requireClient()
  const { error } = await client
    .from('inspections')
    .update({ status: 'in_progress', completed_at: null })
    .eq('id', inspectionId)
  throwIfError(error, 'Failed to reopen inspection')
}

// ---------- Customers & vehicles ----------

export async function fetchCustomers(): Promise<CustomerWithVehicles[]> {
  const client = requireClient()
  const { data, error } = await client
    .from('customers')
    .select('*, vehicles(*)')
    .order('name', { ascending: true })
  throwIfError(error, 'Failed to load customers')
  return (data ?? []) as CustomerWithVehicles[]
}

export async function fetchCustomerList(): Promise<Customer[]> {
  const client = requireClient()
  const { data, error } = await client
    .from('customers')
    .select('*')
    .order('name', { ascending: true })
  throwIfError(error, 'Failed to load customers')
  return (data ?? []) as Customer[]
}

export async function fetchVehiclesForCustomer(customerId: string): Promise<Vehicle[]> {
  const client = requireClient()
  const { data, error } = await client
    .from('vehicles')
    .select('*')
    .eq('customer_id', customerId)
    .order('created_at', { ascending: true })
  throwIfError(error, 'Failed to load vehicles')
  return (data ?? []) as Vehicle[]
}

export interface NewCustomerInput {
  name: string
  phone: string
  email: string
  notes: string
}

export async function createCustomer(input: NewCustomerInput): Promise<Customer> {
  const client = requireClient()
  const { data, error } = await client
    .from('customers')
    .insert({
      name: input.name,
      phone: input.phone || null,
      email: input.email || null,
      notes: input.notes || null,
    })
    .select('*')
    .single()
  throwIfError(error, 'Failed to create customer')
  return data as Customer
}

export interface NewVehicleInput {
  customer_id: string
  year: number | null
  make: string
  model: string
  trim: string
  transmission: string
  engine: string
  vin: string
  license_plate: string
  mileage_km: number | null
}

export async function createVehicle(input: NewVehicleInput): Promise<Vehicle> {
  const client = requireClient()
  const { data, error } = await client
    .from('vehicles')
    .insert({
      customer_id: input.customer_id,
      year: input.year,
      make: input.make,
      model: input.model,
      trim: input.trim || null,
      transmission: input.transmission || null,
      engine: input.engine || null,
      vin: input.vin || null,
      license_plate: input.license_plate || null,
      mileage_km: input.mileage_km,
    })
    .select('*')
    .single()
  throwIfError(error, 'Failed to add vehicle')
  return data as Vehicle
}
