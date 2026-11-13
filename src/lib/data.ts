import { requireClient } from './supabase'
import type {
  Customer,
  CustomerWithVehicles,
  DashboardStats,
  Estimate,
  Inspection,
  InspectionCounts,
  InspectionResult,
  InspectionResultState,
  InspectionSummary,
  InspectionTemplate,
  InspectionTemplateItem,
  Invoice,
  OrderService,
  RepairOrder,
  RepairOrderPriority,
  RepairOrderStatus,
  ServiceCounts,
  Vehicle,
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
}

export async function fetchRepairOrderDetail(id: string): Promise<RepairOrderDetail> {
  const client = requireClient()
  const [ro, estimates, invoices, inspection, services] = await Promise.all([
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
  const { error } = await client.from('repair_orders').update({ status }).eq('id', id)
  throwIfError(error, 'Failed to update repair order status')
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
