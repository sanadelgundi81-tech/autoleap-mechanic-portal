import { useEffect, useMemo, useState, type FormEvent } from 'react'
import {
  createAppointment,
  deleteAppointment,
  fetchAppointments,
  fetchCustomers,
  updateAppointment,
} from '../lib/data'
import {
  formatAppointmentTime,
  fromDateTimeLocalValue,
  toDateTimeLocalValue,
  vehicleLabel,
} from '../lib/format'
import {
  APPOINTMENT_EDITABLE_STATUSES,
  APPOINTMENT_STATUS_TRANSITIONS,
  type Appointment,
  type AppointmentStatus,
  type CustomerWithVehicles,
  type Vehicle,
} from '../lib/types'
import {
  AppointmentStatusBadge,
  Card,
  EmptyState,
  ErrorBanner,
  Field,
  LoadingState,
  PrimaryButton,
  SecondaryButton,
  inputClassName,
} from '../components/ui'
import { OverflowMenu } from '../components/OverflowMenu'
import type { AppointmentPrefill, View } from '../components/Layout'

const STATUS_ACTION_LABELS: Record<AppointmentStatus, string> = {
  booked: 'Book',
  confirmed: 'Confirm',
  in_progress: 'Start',
  completed: 'Complete',
  cancelled: 'Cancel',
  no_show: 'No-show',
}

interface AppointmentFormValues {
  customerId: string
  vehicleId: string
  startsAt: string
  endsAt: string
  service: string
  notes: string
}

const EMPTY_FORM: AppointmentFormValues = {
  customerId: '',
  vehicleId: '',
  startsAt: '',
  endsAt: '',
  service: '',
  notes: '',
}

/** Form-side check, same rule as the database: end (if given) after start. */
function timeRangeError(values: AppointmentFormValues): string | null {
  if (values.startsAt === '') return null
  const start = fromDateTimeLocalValue(values.startsAt)
  if (start === null) return 'The start time is not valid.'
  if (values.endsAt === '') return null
  const end = fromDateTimeLocalValue(values.endsAt)
  if (end === null) return 'The end time is not valid.'
  if (new Date(end).getTime() <= new Date(start).getTime()) {
    return 'The end time must be after the start time.'
  }
  return null
}

function startOfToday(): number {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

export function Appointments({
  prefill,
  focusAppointmentId,
  onNavigate,
}: {
  prefill?: AppointmentPrefill
  /** Opened from a notification: scroll to and highlight this appointment. */
  focusAppointmentId?: string
  onNavigate: (view: View) => void
}) {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [customers, setCustomers] = useState<CustomerWithVehicles[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<string | null>(null)

  const [showForm, setShowForm] = useState(Boolean(prefill))
  const [formValues, setFormValues] = useState<AppointmentFormValues>(
    prefill
      ? { ...EMPTY_FORM, customerId: prefill.customerId, vehicleId: prefill.vehicleId ?? '' }
      : EMPTY_FORM,
  )
  // Linked order for the New appointment form (only when opened from an order).
  const [linkedOrder, setLinkedOrder] = useState<AppointmentPrefill | null>(prefill ?? null)

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValues, setEditValues] = useState<AppointmentFormValues>(EMPTY_FORM)

  async function load() {
    try {
      setAppointments(await fetchAppointments())
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    }
  }

  useEffect(() => {
    let cancelled = false
    async function loadOnce() {
      try {
        const [list, customerList] = await Promise.all([fetchAppointments(), fetchCustomers()])
        if (cancelled) return
        setAppointments(list)
        setCustomers(customerList)
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

  useEffect(() => {
    if (loading || !focusAppointmentId) return
    document
      .getElementById(`appointment-${focusAppointmentId}`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [loading, focusAppointmentId])

  // Upcoming = today and later, earliest first; past = before today, most recent first.
  const { upcoming, past } = useMemo(() => {
    const cutoff = startOfToday()
    const up: Appointment[] = []
    const before: Appointment[] = []
    for (const a of appointments) {
      if (new Date(a.starts_at).getTime() >= cutoff) up.push(a)
      else before.push(a)
    }
    up.sort((a, b) => new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime())
    before.sort((a, b) => new Date(b.starts_at).getTime() - new Date(a.starts_at).getTime())
    return { upcoming: up, past: before }
  }, [appointments])

  function vehiclesFor(customerId: string): Vehicle[] {
    return customers.find((c) => c.id === customerId)?.vehicles ?? []
  }

  /** Runs a change, then reloads the list. */
  async function run(id: string, action: () => Promise<unknown>): Promise<boolean> {
    setError(null)
    setBusyId(id)
    try {
      await action()
      await load()
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
      return false
    } finally {
      setBusyId(null)
    }
  }

  function toggleForm() {
    if (showForm) {
      setShowForm(false)
      return
    }
    setLinkedOrder(null)
    setFormValues(EMPTY_FORM)
    setShowForm(true)
  }

  async function handleCreate(event: FormEvent) {
    event.preventDefault()
    if (timeRangeError(formValues)) return
    const startsAt = fromDateTimeLocalValue(formValues.startsAt)
    if (!formValues.customerId || !startsAt) return
    const ok = await run('new', () =>
      createAppointment({
        customer_id: formValues.customerId,
        vehicle_id: formValues.vehicleId || null,
        repair_order_id: linkedOrder?.repairOrderId ?? null,
        starts_at: startsAt,
        ends_at: fromDateTimeLocalValue(formValues.endsAt),
        service: formValues.service.trim() || null,
        notes: formValues.notes.trim() || null,
      }),
    )
    if (ok) {
      setShowForm(false)
      setFormValues(EMPTY_FORM)
      setLinkedOrder(null)
    }
  }

  function startEdit(a: Appointment) {
    setEditingId(a.id)
    setEditValues({
      customerId: a.customer_id,
      vehicleId: a.vehicle_id ?? '',
      startsAt: toDateTimeLocalValue(a.starts_at),
      endsAt: toDateTimeLocalValue(a.ends_at),
      service: a.service ?? '',
      notes: a.notes ?? '',
    })
  }

  async function handleSaveEdit(event: FormEvent) {
    event.preventDefault()
    if (!editingId || timeRangeError(editValues)) return
    const startsAt = fromDateTimeLocalValue(editValues.startsAt)
    if (!startsAt) return
    const id = editingId
    const ok = await run(id, () =>
      updateAppointment(id, {
        starts_at: startsAt,
        ends_at: fromDateTimeLocalValue(editValues.endsAt),
        vehicle_id: editValues.vehicleId || null,
        service: editValues.service.trim() || null,
        notes: editValues.notes.trim() || null,
      }),
    )
    if (ok) setEditingId(null)
  }

  function handleStatus(a: Appointment, status: AppointmentStatus) {
    if (
      (status === 'cancelled' || status === 'no_show') &&
      !window.confirm(
        `Mark this appointment as ${status === 'cancelled' ? 'cancelled' : 'a no-show'}? This cannot be undone.`,
      )
    ) {
      return
    }
    void run(a.id, () => updateAppointment(a.id, { status }))
  }

  function handleDelete(a: Appointment) {
    if (!window.confirm('Delete this appointment?')) return
    void run(a.id, () => deleteAppointment(a.id))
  }

  if (loading) return <LoadingState message="Loading appointments…" />

  const createError = timeRangeError(formValues)

  function renderAppointment(a: Appointment) {
    if (editingId === a.id) {
      const editError = timeRangeError(editValues)
      return (
        <form
          key={a.id}
          onSubmit={handleSaveEdit}
          className="rounded-xl border border-blue-500/50 bg-slate-900 p-4"
        >
          <p className="mb-3 text-sm font-semibold text-white">
            {a.customers?.name ?? 'Customer'}
          </p>
          <AppointmentFormFields
            values={editValues}
            onChange={setEditValues}
            vehicles={vehiclesFor(a.customer_id)}
          />
          {editError && <p className="mt-2 text-sm text-red-400">{editError}</p>}
          <div className="mt-3 flex gap-2">
            <PrimaryButton
              type="submit"
              disabled={busyId === a.id || editError !== null || editValues.startsAt === ''}
            >
              {busyId === a.id ? 'Saving…' : 'Save'}
            </PrimaryButton>
            <SecondaryButton onClick={() => setEditingId(null)}>Cancel</SecondaryButton>
          </div>
        </form>
      )
    }
    const editable = APPOINTMENT_EDITABLE_STATUSES.includes(a.status)
    return (
      <div
        key={a.id}
        id={`appointment-${a.id}`}
        className={`rounded-xl border border-slate-800 bg-slate-900 p-4 ${
          a.id === focusAppointmentId ? 'ring-2 ring-blue-500' : ''
        }`}
      >
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <p className="font-semibold text-white">{formatAppointmentTime(a.starts_at, a.ends_at)}</p>
            <p className="mt-0.5 text-sm text-slate-300">{a.service ?? 'No service noted'}</p>
          </div>
          <AppointmentStatusBadge status={a.status} />
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
          <button
            onClick={() => onNavigate({ name: 'customer', id: a.customer_id })}
            className="font-semibold text-blue-400 hover:text-blue-300"
          >
            {a.customers?.name ?? 'Customer'}
          </button>
          <span className="text-slate-400">
            {a.vehicles ? vehicleLabel(a.vehicles) : 'No vehicle'}
          </span>
          {a.repair_orders && (
            <button
              onClick={() => onNavigate({ name: 'repair-order', id: a.repair_orders!.id })}
              className="font-semibold text-blue-400 hover:text-blue-300"
            >
              {a.repair_orders.ro_number}
            </button>
          )}
        </div>
        {a.notes && <p className="mt-1 whitespace-pre-wrap text-xs text-slate-400">{a.notes}</p>}
        {(APPOINTMENT_STATUS_TRANSITIONS[a.status].length > 0 || editable) && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {APPOINTMENT_STATUS_TRANSITIONS[a.status].map((next) => (
              <SecondaryButton
                key={next}
                onClick={() => handleStatus(a, next)}
                disabled={busyId === a.id}
              >
                {STATUS_ACTION_LABELS[next]}
              </SecondaryButton>
            ))}
            {editable && (
              <div className="ml-auto">
                <OverflowMenu
                  label="Appointment actions"
                  disabled={busyId === a.id}
                  items={[
                    { label: 'Edit', onSelect: () => startEdit(a) },
                    { label: 'Delete', danger: true, onSelect: () => handleDelete(a) },
                  ]}
                />
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-white">Appointments</h1>
        <PrimaryButton onClick={toggleForm} disabled={customers.length === 0}>
          {showForm ? 'Cancel' : 'New appointment'}
        </PrimaryButton>
      </div>

      <ErrorBanner message={error} />

      {customers.length === 0 && (
        <EmptyState message="No customers yet. Add a customer on the Customers page first, then book an appointment." />
      )}

      {showForm && customers.length > 0 && (
        <Card>
          <form onSubmit={handleCreate}>
            {linkedOrder && (
              <p className="mb-3 text-sm text-slate-300">
                For order{' '}
                <span className="font-semibold text-blue-400">{linkedOrder.roNumber}</span>
              </p>
            )}
            <div className="mb-3">
              <Field label="Customer">
                <select
                  required
                  value={formValues.customerId}
                  onChange={(e) =>
                    setFormValues({ ...formValues, customerId: e.target.value, vehicleId: '' })
                  }
                  className={inputClassName}
                  disabled={linkedOrder !== null}
                >
                  <option value="">Select a customer…</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                      {c.phone ? ` — ${c.phone}` : ''}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
            <AppointmentFormFields
              values={formValues}
              onChange={setFormValues}
              vehicles={vehiclesFor(formValues.customerId)}
              vehicleDisabled={!formValues.customerId}
            />
            {createError && <p className="mt-2 text-sm text-red-400">{createError}</p>}
            <PrimaryButton
              type="submit"
              className="mt-3"
              disabled={
                busyId === 'new' ||
                createError !== null ||
                !formValues.customerId ||
                formValues.startsAt === ''
              }
            >
              {busyId === 'new' ? 'Booking…' : 'Book appointment'}
            </PrimaryButton>
          </form>
        </Card>
      )}

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-bold text-white">Upcoming ({upcoming.length})</h2>
        {upcoming.length === 0 ? (
          <EmptyState message="No upcoming appointments." />
        ) : (
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">{upcoming.map(renderAppointment)}</div>
        )}
      </section>

      {past.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-bold text-white">Past ({past.length})</h2>
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">{past.map(renderAppointment)}</div>
        </section>
      )}
    </div>
  )
}

function AppointmentFormFields({
  values,
  onChange,
  vehicles,
  vehicleDisabled = false,
}: {
  values: AppointmentFormValues
  onChange: (values: AppointmentFormValues) => void
  vehicles: Vehicle[]
  vehicleDisabled?: boolean
}) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      <div className="md:col-span-2">
        <Field label="Vehicle (optional)">
          <select
            value={values.vehicleId}
            onChange={(e) => onChange({ ...values, vehicleId: e.target.value })}
            className={inputClassName}
            disabled={vehicleDisabled}
          >
            <option value="">{vehicleDisabled ? 'Select a customer first' : 'No vehicle'}</option>
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {vehicleLabel(v)}
                {v.license_plate ? ` — ${v.license_plate}` : ''}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <Field label="Starts">
        <input
          type="datetime-local"
          required
          value={values.startsAt}
          onChange={(e) => onChange({ ...values, startsAt: e.target.value })}
          className={inputClassName}
        />
      </Field>
      <Field label="Ends (optional)">
        <input
          type="datetime-local"
          value={values.endsAt}
          onChange={(e) => onChange({ ...values, endsAt: e.target.value })}
          className={inputClassName}
        />
      </Field>
      <div className="md:col-span-2">
        <Field label="Service">
          <input
            value={values.service}
            onChange={(e) => onChange({ ...values, service: e.target.value })}
            className={inputClassName}
            placeholder="e.g. Brake inspection"
          />
        </Field>
      </div>
      <div className="md:col-span-2">
        <Field label="Notes">
          <textarea
            value={values.notes}
            onChange={(e) => onChange({ ...values, notes: e.target.value })}
            className={inputClassName}
            rows={2}
            placeholder="Optional"
          />
        </Field>
      </div>
    </div>
  )
}
