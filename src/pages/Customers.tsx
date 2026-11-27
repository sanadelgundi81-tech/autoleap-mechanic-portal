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
  LoadingState,
  PrimaryButton,
  SecondaryButton,
} from '../components/ui'
import { OverflowMenu } from '../components/OverflowMenu'
import {
  CustomerFormFields,
  EMPTY_CUSTOMER,
  EMPTY_VEHICLE,
  VehicleFormFields,
  customerToForm,
  message,
  vehicleFields,
  vehicleToForm,
  type CustomerFormValues,
  type VehicleFormValues,
} from '../components/customerForms'
import type { View } from '../components/Layout'
import { useDeleteWarning } from '../components/DeleteWarning'
import { customerWarning, vehicleWarning } from '../lib/deleteWarnings'

export function Customers({
  focusCustomerId,
  onNavigate,
}: {
  focusCustomerId?: string
  onNavigate: (view: View) => void
}) {
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
  const deleteWarning = useDeleteWarning()

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

  // Back from a customer's detail view: bring that customer into view.
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
    deleteWarning.ask({
      title: `Delete customer "${customer.name}"?`,
      load: () => customerWarning(customer.id),
      run: () => deleteCustomer(customer.id),
      onDeleted: load,
    })
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
    deleteWarning.ask({
      title: `Delete vehicle "${vehicleLabel(vehicle)}"?`,
      load: () => vehicleWarning(vehicle.id),
      run: () => deleteVehicle(vehicle.id),
      onDeleted: load,
    })
  }

  function openCustomer(customerId: string) {
    onNavigate({ name: 'customer', id: customerId })
  }

  if (loading) return <LoadingState message="Loading customers…" />

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-white">Customers &amp; Vehicles</h1>
        <PrimaryButton onClick={() => setShowCustomerForm((v) => !v)}>
          {showCustomerForm ? 'Cancel' : 'New Customer'}
        </PrimaryButton>
      </div>

      <ErrorBanner message={error} />
      {deleteWarning.dialog}

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
                <div className="flex items-start justify-between gap-2">
                  {/* The whole summary opens the customer; the name is the keyboard target. */}
                  <div
                    className="min-w-0 flex-1 cursor-pointer"
                    onClick={() => openCustomer(customer.id)}
                  >
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        openCustomer(customer.id)
                      }}
                      className="text-left text-lg font-bold text-white hover:text-blue-300"
                    >
                      {customer.name}
                    </button>
                    <p className="text-xs text-slate-400">
                      {customer.phone ?? 'No phone'}
                      {customer.email ? ` · ${customer.email}` : ''}
                    </p>
                    {customer.notes && (
                      <p className="mt-1 text-xs text-slate-400">{customer.notes}</p>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <SecondaryButton
                      onClick={() =>
                        setVehicleFormFor((v) => (v === customer.id ? null : customer.id))
                      }
                    >
                      {vehicleFormFor === customer.id ? 'Cancel' : 'Add Vehicle'}
                    </SecondaryButton>
                    <OverflowMenu
                      label={`Actions for ${customer.name}`}
                      disabled={busyId === customer.id}
                      items={[
                        { label: 'Edit', onSelect: () => startEditCustomer(customer) },
                        {
                          label: busyId === customer.id ? 'Deleting…' : 'Delete',
                          danger: true,
                          onSelect: () => handleDeleteCustomer(customer),
                        },
                      ]}
                    />
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
                  <p className="text-sm text-slate-400">No vehicles on file.</p>
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
                        onClick={() => openCustomer(customer.id)}
                        className="flex cursor-pointer items-start justify-between gap-2 rounded-lg border border-slate-700 bg-slate-800/60 p-3 text-sm hover:border-slate-600"
                      >
                        <div className="min-w-0">
                          <div className="font-semibold text-slate-100">{vehicleLabel(v)}</div>
                          <div className="break-words text-xs text-slate-400">
                            {[v.transmission, v.engine, v.vin ? `VIN ${v.vin}` : null, v.license_plate, v.mileage_km !== null ? `${v.mileage_km.toLocaleString()} km` : null]
                              .filter(Boolean)
                              .join(' · ') || 'No details recorded'}
                          </div>
                        </div>
                        <OverflowMenu
                          label={`Actions for ${vehicleLabel(v)}`}
                          disabled={busyId === v.id}
                          items={[
                            { label: 'Edit', onSelect: () => startEditVehicle(v) },
                            {
                              label: busyId === v.id ? 'Deleting…' : 'Delete',
                              danger: true,
                              onSelect: () => handleDeleteVehicle(v),
                            },
                          ]}
                        />
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
