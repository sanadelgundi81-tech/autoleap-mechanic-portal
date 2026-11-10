import { useEffect, useState, type FormEvent } from 'react'
import { createCustomer, createVehicle, fetchCustomers } from '../lib/data'
import { vehicleLabel } from '../lib/format'
import type { CustomerWithVehicles } from '../lib/types'
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

export function Customers() {
  const [customers, setCustomers] = useState<CustomerWithVehicles[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [showCustomerForm, setShowCustomerForm] = useState(false)
  const [savingCustomer, setSavingCustomer] = useState(false)
  const [vehicleFormFor, setVehicleFormFor] = useState<string | null>(null)
  const [savingVehicle, setSavingVehicle] = useState(false)

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [notes, setNotes] = useState('')

  const [year, setYear] = useState('')
  const [make, setMake] = useState('')
  const [model, setModel] = useState('')
  const [trim, setTrim] = useState('')
  const [transmission, setTransmission] = useState('')
  const [engine, setEngine] = useState('')
  const [vin, setVin] = useState('')
  const [licensePlate, setLicensePlate] = useState('')
  const [mileageKm, setMileageKm] = useState('')

  async function load() {
    try {
      const data = await fetchCustomers()
      setCustomers(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    }
  }

  useEffect(() => {
    let cancelled = false
    async function loadOnce() {
      try {
        const data = await fetchCustomers()
        if (!cancelled) setCustomers(data)
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

  async function handleCreateCustomer(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setSavingCustomer(true)
    try {
      await createCustomer({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        notes: notes.trim(),
      })
      setName('')
      setPhone('')
      setEmail('')
      setNotes('')
      setShowCustomerForm(false)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setSavingCustomer(false)
    }
  }

  async function handleAddVehicle(event: FormEvent, customerId: string) {
    event.preventDefault()
    setError(null)
    setSavingVehicle(true)
    try {
      await createVehicle({
        customer_id: customerId,
        year: year === '' ? null : Number(year),
        make: make.trim(),
        model: model.trim(),
        trim: trim.trim(),
        transmission: transmission.trim(),
        engine: engine.trim(),
        vin: vin.trim(),
        license_plate: licensePlate.trim(),
        mileage_km: mileageKm === '' ? null : Number(mileageKm),
      })
      setYear('')
      setMake('')
      setModel('')
      setTrim('')
      setTransmission('')
      setEngine('')
      setVin('')
      setLicensePlate('')
      setMileageKm('')
      setVehicleFormFor(null)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setSavingVehicle(false)
    }
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
            <Field label="Full name">
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClassName}
                placeholder="e.g. Marcus Vance"
              />
            </Field>
            <Field label="Phone">
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={inputClassName}
                placeholder="(555) 000-0000"
              />
            </Field>
            <Field label="Email">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClassName}
                placeholder="customer@example.com"
              />
            </Field>
            <Field label="Notes">
              <input
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className={inputClassName}
                placeholder="Optional note"
              />
            </Field>
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
            <Card key={customer.id}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">{customer.name}</h3>
                  <p className="text-xs text-slate-400">
                    {customer.phone ?? 'No phone'}
                    {customer.email ? ` · ${customer.email}` : ''}
                  </p>
                  {customer.notes && (
                    <p className="mt-1 text-xs text-slate-500">{customer.notes}</p>
                  )}
                </div>
                <SecondaryButton
                  onClick={() =>
                    setVehicleFormFor((v) => (v === customer.id ? null : customer.id))
                  }
                >
                  {vehicleFormFor === customer.id ? 'Cancel' : 'Add Vehicle'}
                </SecondaryButton>
              </div>

              <div className="mt-3 space-y-2">
                {customer.vehicles.length === 0 ? (
                  <p className="text-sm text-slate-500">No vehicles on file.</p>
                ) : (
                  customer.vehicles.map((v) => (
                    <div
                      key={v.id}
                      className="rounded-lg border border-slate-700 bg-slate-800/60 p-3 text-sm"
                    >
                      <div className="font-semibold text-slate-100">{vehicleLabel(v)}</div>
                      <div className="text-xs text-slate-400">
                        {[v.transmission, v.engine, v.vin ? `VIN ${v.vin}` : null, v.license_plate, v.mileage_km !== null ? `${v.mileage_km.toLocaleString()} km` : null]
                          .filter(Boolean)
                          .join(' · ') || 'No details recorded'}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {vehicleFormFor === customer.id && (
                <form
                  onSubmit={(e) => void handleAddVehicle(e, customer.id)}
                  className="mt-4 grid grid-cols-1 gap-3 border-t border-slate-800 pt-4 md:grid-cols-2"
                >
                  <Field label="Year">
                    <input
                      type="number"
                      min="1900"
                      max="2100"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      className={inputClassName}
                      placeholder="2021"
                    />
                  </Field>
                  <Field label="Make">
                    <input
                      required
                      value={make}
                      onChange={(e) => setMake(e.target.value)}
                      className={inputClassName}
                      placeholder="Ford"
                    />
                  </Field>
                  <Field label="Model">
                    <input
                      required
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      className={inputClassName}
                      placeholder="F-150"
                    />
                  </Field>
                  <Field label="Trim">
                    <input
                      value={trim}
                      onChange={(e) => setTrim(e.target.value)}
                      className={inputClassName}
                      placeholder="XLT"
                    />
                  </Field>
                  <Field label="Transmission">
                    <input
                      value={transmission}
                      onChange={(e) => setTransmission(e.target.value)}
                      className={inputClassName}
                      placeholder="Automatic"
                    />
                  </Field>
                  <Field label="Engine">
                    <input
                      value={engine}
                      onChange={(e) => setEngine(e.target.value)}
                      className={inputClassName}
                      placeholder="3.5L Hybrid"
                    />
                  </Field>
                  <Field label="VIN">
                    <input
                      value={vin}
                      onChange={(e) => setVin(e.target.value)}
                      className={inputClassName}
                    />
                  </Field>
                  <Field label="License plate">
                    <input
                      value={licensePlate}
                      onChange={(e) => setLicensePlate(e.target.value)}
                      className={inputClassName}
                    />
                  </Field>
                  <Field label="Mileage (KM)">
                    <input
                      type="number"
                      min="0"
                      value={mileageKm}
                      onChange={(e) => setMileageKm(e.target.value)}
                      className={inputClassName}
                    />
                  </Field>
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
