// Types mirror the tables in
// supabase/migrations/20261110010000_autoleap_foundation.sql
// Status values and checklist structure follow the reference spec:
// ~/workspace/autoleap/reference-spec-2026-11-10.md

export type RepairOrderStatus =
  | 'estimate'
  | 'waiting_for_approval'
  | 'waiting_for_parts'
  | 'appointment_confirmed'
  | 'invoice'

export type RepairOrderPriority = 'low' | 'medium' | 'high'

export type EstimateStatus = 'draft' | 'sent' | 'approved' | 'declined'

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'void'

export type AppointmentStatus =
  | 'booked'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'no_show'

export type InspectionStatus = 'in_progress' | 'complete'

/** Per-item marking. No 'unmarked' value: an item with no
 *  inspection_results row is unmarked. */
export type InspectionResultState = 'good' | 'attention' | 'failed'

export const REPAIR_ORDER_STATUSES: RepairOrderStatus[] = [
  'estimate',
  'waiting_for_approval',
  'waiting_for_parts',
  'appointment_confirmed',
  'invoice',
]

/**
 * Orders list tabs split on technician completion, NOT on order
 * status. Assigned = work not yet marked complete
 * (technician_completed_at is null); Completed = work marked
 * complete (technician_completed_at is set). In the reference
 * app the Completed tab holds orders with statuses like
 * "Waiting For Approval" and "Waiting For Parts", and the
 * Assigned tab holds "Waiting For Approval" too — no status
 * rule reproduces the tabs. Completion is a per-order
 * technician state, separate from the status workflow.
 */
export function isRepairOrderWorkComplete(ro: RepairOrder): boolean {
  return ro.technician_completed_at !== null
}

export const REPAIR_ORDER_STATUS_LABELS: Record<RepairOrderStatus, string> = {
  estimate: 'Estimate',
  waiting_for_approval: 'Waiting For Approval',
  waiting_for_parts: 'Waiting For Parts',
  appointment_confirmed: 'Appointment Confirmed',
  invoice: 'Invoice',
}

export const REPAIR_ORDER_PRIORITIES: RepairOrderPriority[] = ['low', 'medium', 'high']

export const REPAIR_ORDER_PRIORITY_LABELS: Record<RepairOrderPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
}

export const INSPECTION_RESULT_STATES: InspectionResultState[] = [
  'good',
  'attention',
  'failed',
]

export const INSPECTION_RESULT_STATE_LABELS: Record<InspectionResultState, string> = {
  good: 'Good',
  attention: 'Attention',
  failed: 'Failed',
}

export interface Customer {
  id: string
  name: string
  phone: string | null
  email: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface Vehicle {
  id: string
  customer_id: string
  year: number | null
  make: string
  model: string
  trim: string | null
  transmission: string | null
  engine: string | null
  vin: string | null
  license_plate: string | null
  mileage_km: number | null
  created_at: string
  updated_at: string
}

export interface RepairOrder {
  id: string
  ro_number: string
  customer_id: string
  vehicle_id: string
  status: RepairOrderStatus
  priority: RepairOrderPriority
  concern: string | null
  technician: string | null
  bay: string | null
  odometer_km: number | null
  labor_hours: number
  labor_rate: number
  parts_total: number
  /** Null while the work is in progress; set when the technician marks the work complete. Drives the Assigned/Completed tabs. */
  technician_completed_at: string | null
  shop_notes: string | null
  customer_recommendations: string | null
  created_at: string
  updated_at: string
  customers?: { id: string; name: string; phone: string | null; email: string | null } | null
  vehicles?: {
    id: string
    year: number | null
    make: string
    model: string
    trim: string | null
    transmission: string | null
    engine: string | null
    vin: string | null
    license_plate: string | null
    mileage_km: number | null
  } | null
}

export interface Estimate {
  id: string
  repair_order_id: string
  status: EstimateStatus
  labor_total: number
  parts_total: number
  tax: number
  total: number
  notes: string | null
  created_at: string
  updated_at: string
}

export interface Invoice {
  id: string
  repair_order_id: string
  invoice_number: string
  status: InvoiceStatus
  subtotal: number
  tax: number
  total: number
  paid_at: string | null
  created_at: string
  updated_at: string
}

export interface Appointment {
  id: string
  customer_id: string
  vehicle_id: string | null
  repair_order_id: string | null
  starts_at: string
  ends_at: string | null
  service: string | null
  status: AppointmentStatus
  notes: string | null
  created_at: string
  updated_at: string
}

export interface InspectionTemplate {
  id: string
  name: string
  description: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface InspectionTemplateItem {
  id: string
  template_id: string
  section: string
  section_order: number
  position: number
  name: string
  is_free_text: boolean
  created_at: string
  updated_at: string
}

export interface Inspection {
  id: string
  repair_order_id: string
  template_id: string
  status: InspectionStatus
  assigned_to: string | null
  completed_at: string | null
  created_at: string
  updated_at: string
  inspection_templates?: { id: string; name: string } | null
}

export interface InspectionResult {
  id: string
  inspection_id: string
  template_item_id: string
  state: InspectionResultState
  note: string | null
  created_at: string
  updated_at: string
}

export interface InspectionCounts {
  total: number
  unmarked: number
  good: number
  attention: number
  failed: number
}

export interface InspectionSummary {
  inspection: Inspection | null
  counts: InspectionCounts | null
}

/** A service (line item) on a repair order. Mirrors
 *  supabase/migrations/20261113010000_order_services.sql. */
export interface OrderService {
  id: string
  repair_order_id: string
  name: string
  description: string | null
  labor_hours: number
  labor_rate: number
  parts_total: number
  /** The wrench counter counts done services vs total. */
  is_done: boolean
  position: number
  created_at: string
  updated_at: string
}

/** Service progress for one order: done services / total services. */
export interface ServiceCounts {
  total: number
  done: number
}

export interface CustomerWithVehicles extends Customer {
  vehicles: Vehicle[]
}

export interface DashboardStats {
  activeRepairOrders: number
  collectedPaidInvoices: number
  billedHours: number
  openFindings: number
  attentionFindings: number
  failedFindings: number
}
