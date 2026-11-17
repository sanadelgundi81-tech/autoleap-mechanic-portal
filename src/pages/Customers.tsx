import { useEffect, useState, type FormEvent } from 'react'
import {
  createCustomer,
  createVehicle,
  deleteCustomer,
  deleteVehicle,
  fetchCustomers,
  updateCustomer,
  updateVehicle,
} from '../lib/data'
import { vehicleLabel } from '../lib/format'
import type { Customer, CustomerWithVehicles, Vehicle } from '../lib/types'
import {
  Card,
  EmptyState,
  ErrorBanner,
  Field,
  LoadingState,
  PrimaryButton,
  SecondaryButton,
  inputClassName,
} from '../components/ui'

interface CustomerFormValues {
  name: string
  phone: string
  email: string
  notes: string
}

interface VehicleFormValues {
  year: string
  make: string
  model: string
  trim: string
  transmission: string
  engine: string
  vin: string
  licensePlate: string
  mileageKm: string
}

const EMPTY_CUSTOMER: CustomerFormValues = { name: '', phone: '', email: '', notes: '' }
const EMPTY_VEHICLE: VehicleFormValues = {
  year: '',
  make: '',
  model: '',
  trim: '',
  transmission: '',
  engine: '',
  vin: '',
  licensePlate: '',
  mileageKm: '',
}

function customerToForm(c: Customer): CustomerFormValues {
  return { name: c.name, phone: c.phone ?? '', email: c.email ?? '', notes: c.notes ?? '' }
}

function vehicleToForm(v: Vehicle): VehicleFormValues {
  return {
    year: v.year === null ? '' : String(v.year),
    make: v.make,
    model: v.model,
    trim: v.trim ?? '',
    transmission: v.transmission ?? '',
    engine: v.engine ?? '',
    vin: v.vin ?? '',
    licensePlate: v.license_plate ?? '',
    mileageKm: v.mileage_km === null ? '' : String(v.mileage_km),
  }
}

/** Blank → not set; anything else → a number (an invalid one is refused by data.ts). */
function optionalNumber(value: string): number | null {
  return value.trim() === '' ? null : Number(value)
}

function vehicleFields(values: VehicleFormValues) {
  return {
    year: optionalNumber(values.year),
    make: values.make.trim(),
    model: values.model.trim(),
    trim: values.trim.trim(),
    transmission: values.transmission.trim(),
    engine: values.engine.trim(),
    vin: values.vin.trim(),
    license_plate: values.licensePlate.trim(),
    mileage_km: optionalNumber(values.mileageKm),
  }
}

function message(err: unknown): string {
  return err instanceof Error ? err.message : String(err)
}

export function Customers({ focusCustomerId }: { focusCustomerId?: string } = {}) {
  const [customers, setCustomers] = useState<CustomerWithVehicles[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [showCustomerForm, setShowCustomerForm] = useState(false)
  const [savingCustomer, setSavingCustomer] = useState(false)
  const [vehicleFormFor, setVehicleFormFor] = useState<string | null>(null)
  const [savingVehicle, setSavingVehicle] = useState(false)
  const [newCustomer, setNewCustomer] = useState<CustomerFormValues>(EMPTY_CUSTOMER)
  const [newVehicle, setNewVehicle] = useState<VehicleFormValues>(EMPTY_VEHICLE)

  // Edit / delete. busyId is the customer or vehicle being saved or deleted.
  const [busyId, setBusyId] = useState<string | null>(null)
  const [editingCustomerId, setEditingCustomerId] = useState<string | null>(null)
  const [customerEdit, setCustomerEdit] = useState<CustomerFormValues>(EMPTY_CUSTOMER)
  const [editingVehicleId, setEditingVehicleId] = useState<string | null>(null)
  const [vehicleEdit, setVehicleEdit] = useState<VehicleFormValues>(EMPTY_VEHICLE)
  /** A failed edit or delete, shown on the card it belongs to (keyed by customer id). */
  const [cardError, setCardError] = useState<{ customerId: string; message: string } | null>(null)

  const nextYear = new Date().getFullYear() + 1

  async function load() {
    try {
      const data = await fetchCustomers()
      setCustomers(data)
    } catch (err) {
      setError(message(err))
    }
  }

  useEffect(() => {
    let cancelled = false
    async function loadOnce() {
      try {
        const data = await fetchCustomers()
        if (!cancelled) setCustomers(data)
      } catch (err) {
        if (!cancelled) setError(message(err))
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void loadOnce()
    return () => {
      cancelled = true
    }
  }, [])

  // Opened from an appointment's customer link: bring that customer into view.
  useEffect(() => {
    if (loading || !focusCustomerId) return
    document
      .getElementById(`customer-${focusCustomerId}`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [loading, focusCustomerId])

  async function handleCreateCustomer(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setSavingCustomer(true)
    try {
      await createCustomer({
        name: newCustomer.name.trim(),
        phone: newCustomer.phone.trim(),
        email: newCustomer.email.trim(),
        notes: newCustomer.notes.trim(),
      })
      setNewCustomer(EMPTY_CUSTOMER)
      setShowCustomerForm(false)
      await load()
    } catch (err) {
      setError(message(err))
    } finally {
      setSavingCustomer(false)
    }
  }

  async function handleAddVehicle(event: FormEvent, customerId: string) {
    event.preventDefault()
    setError(null)
    setSavingVehicle(true)
    try {
      await createVehicle({ customer_id: customerId, ...vehicleFields(newVehicle) })
      setNewVehicle(EMPTY_VEHICLE)
      setVehicleFormFor(null)
      await load()
    } catch (err) {
      setError(message(err))
    } finally {
      setSavingVehicle(false)
    }
  }

  /** Runs an edit/delete for one card. On failure the reason shows on that card and nothing changes. */
  async function run(customerId: string, id: string, action: () => Promise<unknown>): Promise<boolean> {
    setCardError(null)
    setBusyId(id)
    try {
      await action()
      await load()
      return true
    } catch (err) {
      setCardError({ customerId, message: message(err) })
      return false
    } finally {
      setBusyId(null)
    }
  }

  function startEditCustomer(customer: Customer) {
    setCardError(null)
    setEditingVehicleId(null)
    setCustomerEdit(customerToForm(customer))
    setEditingCustomerId(customer.id)
  }

  async function handleSaveCustomer(event: FormEvent, customerId: string) {
    event.preventDefault()
    const ok = await run(customerId, customerId, () => updateCustomer(customerId, customerEdit))
    if (ok) setEditingCustomerId(null)
  }

  function handleDeleteCustomer(customer: CustomerWithVehicles) {
    const n = customer.vehicles.length
    const goesWith =
      n === 0
        ? 'Their appointments are deleted too.'
        : `Their ${n === 1 ? 'vehicle' : `${n} vehicles`} and appointments are deleted too.`
    if (!window.confirm(`Delete customer "${customer.name}"? ${goesWith} This cannot be undone.`)) {
      return
    }
    void run(customer.id, customer.id, () => deleteCustomer(customer.id))
  }

  function startEditVehicle(vehicle: Vehicle) {
    setCardError(null)
    setEditingCustomerId(null)
    setVehicleEdit(vehicleToForm(vehicle))
    setEditingVehicleId(vehicle.id)
  }

  async function handleSaveVehicle(event: FormEvent, vehicle: Vehicle) {
    event.preventDefault()
    const ok = await run(vehicle.customer_id, vehicle.id, () =>
      updateVehicle(vehicle.id, vehicleFields(vehicleEdit)),
    )
    if (ok) setEditingVehicleId(null)
  }

  function handleDeleteVehicle(vehicle: Vehicle) {
    if (
      !window.confirm(
        `Delete vehicle "${vehicleLabel(vehicle)}"? Its appointments stay, with the vehicle cleared. This cannot be undone.`,
      )
    ) {
      return
    }
    void run(vehicle.customer_id, vehicle.id, () => deleteVehicle(vehicle.id))
  }

  if (loading) return <LoadingState message="Loading customers…" />

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Customers &amp; Vehicles</h1>
        <PrimaryButton onClick={() => setShowCustomerForm((v) => !v)}>
          {showCustomerForm ? 'Cancel' : 'New Customer'}
        </PrimaryButton>
      </div>

      <ErrorBanner message={error} />

      {showCustomerForm && (
        <Card>
          <form onSubmit={handleCreateCustomer} className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <CustomerFormFields values={newCustomer} onChange={setNewCustomer} />
            <div className="md:col-span-2">
              <PrimaryButton type="submit" disabled={savingCustomer}>
                {savingCustomer ? 'Creating…' : 'Create Customer'}
              </PrimaryButton>
            </div>
          </form>
        </Card>
      )}

      {customers.length === 0 ? (
        <EmptyState message="No customers yet. Create the first one above." />
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {customers.map((customer) => (
            <Card
              key={customer.id}
              id={`customer-${customer.id}`}
              className={customer.id === focusCustomerId ? 'ring-2 ring-blue-500' : ''}
            >
              {editingCustomerId === customer.id ? (
                <form
                  onSubmit={(e) => void handleSaveCustomer(e, customer.id)}
                  className="grid grid-cols-1 gap-3 md:grid-cols-2"
                >
                  <p className="text-sm font-semibold text-white md:col-span-2">Edit customer</p>
                  <CustomerFormFields values={customerEdit} onChange={setCustomerEdit} />
                  <div className="flex gap-2 md:col-span-2">
                    <PrimaryButton type="submit" disabled={busyId === customer.id}>
                      {busyId === customer.id ? 'Saving…' : 'Save'}
                    </PrimaryButton>
                    <SecondaryButton onClick={() => setEditingCustomerId(null)}>
                      Cancel
                    </SecondaryButton>
                  </div>
                </form>
              ) : (
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="text-lg font-bold text-white">{customer.name}</h3>
                    <p className="text-xs text-slate-400">
                      {customer.phone ?? 'No phone'}
                      {customer.email ? ` · ${customer.email}` : ''}
                    </p>
                    {customer.notes && (
                      <p className="mt-1 text-xs text-slate-500">{customer.notes}</p>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <SecondaryButton
                      onClick={() =>
                        setVehicleFormFor((v) => (v === customer.id ? null : customer.id))
                      }
                    >
                      {vehicleFormFor === customer.id ? 'Cancel' : 'Add Vehicle'}
                    </SecondaryButton>
                    <SecondaryButton
                      onClick={() => startEditCustomer(customer)}
                      disabled={busyId === customer.id}
                    >
                      Edit
                    </SecondaryButton>
                    <SecondaryButton
                      onClick={() => handleDeleteCustomer(customer)}
                      disabled={busyId === customer.id}
                    >
                      {busyId === customer.id ? 'Deleting…' : 'Delete'}
                    </SecondaryButton>
                  </div>
                </div>
              )}

              {cardError?.customerId === customer.id && (
                <div className="mt-3">
                  <ErrorBanner message={cardError.message} />
                </div>
              )}

              <div className="mt-3 space-y-2">
                {customer.vehicles.length === 0 ? (
                  <p className="text-sm text-slate-500">No vehicles on file.</p>
                ) : (
                  customer.vehicles.map((v) =>
                    editingVehicleId === v.id ? (
                      <form
                        key={v.id}
                        onSubmit={(e) => void handleSaveVehicle(e, v)}
                        className="grid grid-cols-1 gap-3 rounded-lg border border-blue-500/50 bg-slate-800/60 p-3 md:grid-cols-2"
                      >
                        <p className="text-sm font-semibold text-white md:col-span-2">
                          Edit vehicle
                        </p>
                        <VehicleFormFields
                          values={vehicleEdit}
                          onChange={setVehicleEdit}
                          maxYear={nextYear}
                        />
                        <div className="flex gap-2 md:col-span-2">
                          <PrimaryButton type="submit" disabled={busyId === v.id}>
                            {busyId === v.id ? 'Saving…' : 'Save'}
                          </PrimaryButton>
                          <SecondaryButton onClick={() => setEditingVehicleId(null)}>
                            Cancel
                          </SecondaryButton>
                        </div>
                      </form>
                    ) : (
                      <div
                        key={v.id}
                        className="flex flex-wrap items-start justify-between gap-2 rounded-lg border border-slate-700 bg-slate-800/60 p-3 text-sm"
                      >
                        <div className="min-w-0">
                          <div className="font-semibold text-slate-100">{vehicleLabel(v)}</div>
                          <div className="text-xs text-slate-400">
                            {[v.transmission, v.engine, v.vin ? `VIN ${v.vin}` : null, v.license_plate, v.mileage_km !== null ? `${v.mileage_km.toLocaleString()} km` : null]
                              .filter(Boolean)
                              .join(' · ') || 'No details recorded'}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <SecondaryButton
                            onClick={() => startEditVehicle(v)}
                            disabled={busyId === v.id}
                          >
                            Edit
                          </SecondaryButton>
                          <SecondaryButton
                            onClick={() => handleDeleteVehicle(v)}
                            disabled={busyId === v.id}
                          >
                            {busyId === v.id ? 'Deleting…' : 'Delete'}
                          </SecondaryButton>
                        </div>
                      </div>
                    ),
                  )
                )}
              </div>

              {vehicleFormFor === customer.id && (
                <form
                  onSubmit={(e) => void handleAddVehicle(e, customer.id)}
                  className="mt-4 grid grid-cols-1 gap-3 border-t border-slate-800 pt-4 md:grid-cols-2"
                >
                  <VehicleFormFields values={newVehicle} onChange={setNewVehicle} maxYear={nextYear} />
                  <div className="md:col-span-2">
                    <PrimaryButton type="submit" disabled={savingVehicle}>
                      {savingVehicle ? 'Adding…' : 'Add Vehicle'}
                    </PrimaryButton>
                  </div>
                </form>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

/** Name, phone, email, notes: the same fields for create and edit. */
function CustomerFormFields({
  values,
  onChange,
}: {
  values: CustomerFormValues
  onChange: (values: CustomerFormValues) => void
}) {
  const set = (key: keyof CustomerFormValues, value: string) => onChange({ ...values, [key]: value })
  return (
    <>
      <Field label="Full name">
        <input
          required
          value={values.name}
          onChange={(e) => set('name', e.target.value)}
          className={inputClassName}
          placeholder="e.g. Marcus Vance"
        />
      </Field>
      <Field label="Phone">
        <input
          value={values.phone}
          onChange={(e) => set('phone', e.target.value)}
          className={inputClassName}
          placeholder="(555) 000-0000"
        />
      </Field>
      <Field label="Email">
        <input
          type="email"
          value={values.email}
          onChange={(e) => set('email', e.target.value)}
          className={inputClassName}
          placeholder="customer@example.com"
        />
      </Field>
      <Field label="Notes">
        <input
          value={values.notes}
          onChange={(e) => set('notes', e.target.value)}
          className={inputClassName}
          placeholder="Optional note"
        />
      </Field>
    </>
  )
}

/** The add-vehicle fields, also used for edit. */
function VehicleFormFields({
  values,
  onChange,
  maxYear,
}: {
  values: VehicleFormValues
  onChange: (values: VehicleFormValues) => void
  maxYear: number
}) {
  const set = (key: keyof VehicleFormValues, value: string) => onChange({ ...values, [key]: value })
  return (
    <>
      <Field label="Year">
        <input
          type="number"
          min="1900"
          max={String(maxYear)}
          value={values.year}
          onChange={(e) => set('year', e.target.value)}
          className={inputClassName}
          placeholder="2021"
        />
      </Field>
      <Field label="Make">
        <input
          required
          value={values.make}
          onChange={(e) => set('make', e.target.value)}
          className={inputClassName}
          placeholder="Ford"
        />
      </Field>
      <Field label="Model">
        <input
          required
          value={values.model}
          onChange={(e) => set('model', e.target.value)}
          className={inputClassName}
          placeholder="F-150"
        />
      </Field>
      <Field label="Trim">
        <input
          value={values.trim}
          onChange={(e) => set('trim', e.target.value)}
          className={inputClassName}
          placeholder="XLT"
        />
      </Field>
      <Field label="Transmission">
        <input
          value={values.transmission}
          onChange={(e) => set('transmission', e.target.value)}
          className={inputClassName}
          placeholder="Automatic"
        />
      </Field>
      <Field label="Engine">
        <input
          value={values.engine}
          onChange={(e) => set('engine', e.target.value)}
          className={inputClassName}
          placeholder="3.5L Hybrid"
        />
      </Field>
      <Field label="VIN">
        <input
          value={values.vin}
          onChange={(e) => set('vin', e.target.value)}
          className={inputClassName}
        />
      </Field>
      <Field label="License plate">
        <input
          value={values.licensePlate}
          onChange={(e) => set('licensePlate', e.target.value)}
          className={inputClassName}
        />
      </Field>
      <Field label="Mileage (KM)">
        <input
          type="number"
          min="0"
          value={values.mileageKm}
          onChange={(e) => set('mileageKm', e.target.value)}
          className={inputClassName}
        />
      </Field>
    </>
  )
}
