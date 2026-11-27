import { useCallback, useEffect, useState, type FormEvent, type ReactNode } from 'react'
import {
  deleteCustomer,
  deleteVehicle,
  fetchCustomerDetail,
  updateCustomer,
  updateVehicle,
  type CustomerDetail,
} from '../lib/data'
import { formatAppointmentTime, formatDate, formatKm, money, vehicleLabel } from '../lib/format'
import { INVOICE_STATUS_LABELS, type Vehicle } from '../lib/types'
import {
  AppointmentStatusBadge,
  Card,
  EmptyState,
  ErrorBanner,
  LoadingState,
  PrimaryButton,
  RepairOrderStatusBadge,
  SecondaryButton,
} from '../components/ui'
import { OverflowMenu } from '../components/OverflowMenu'
import {
  CustomerFormFields,
  EMPTY_CUSTOMER,
  EMPTY_VEHICLE,
  VehicleFormFields,
  confirmDeleteCustomer,
  confirmDeleteVehicle,
  customerToForm,
  message,
  vehicleFields,
  vehicleToForm,
  type CustomerFormValues,
  type VehicleFormValues,
} from '../components/customerForms'
import type { View } from '../components/Layout'

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex justify-between gap-4 py-0.5">
      <dt className="shrink-0 text-slate-400">{label}</dt>
      <dd className="min-w-0 break-words text-right text-slate-200">{children}</dd>
    </div>
  )
}

/** The full customer record, read-only; editing goes through the ⋯ menus. */
export function CustomerDetailPage({
  id,
  onNavigate,
}: {
  id: string
  onNavigate: (view: View) => void
}) {
  const [detail, setDetail] = useState<CustomerDetail | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [editingCustomer, setEditingCustomer] = useState(false)
  const [customerEdit, setCustomerEdit] = useState<CustomerFormValues>(EMPTY_CUSTOMER)
  const [editingVehicleId, setEditingVehicleId] = useState<string | null>(null)
  const [vehicleEdit, setVehicleEdit] = useState<VehicleFormValues>(EMPTY_VEHICLE)
  const nextYear = new Date().getFullYear() + 1

  const load = useCallback(async () => {
    try {
      setDetail(await fetchCustomerDetail(id))
    } catch (err) {
      setError(message(err))
    }
  }, [id])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetchCustomerDetail(id)
      .then((d) => {
        if (!cancelled) setDetail(d)
      })
      .catch((err) => {
        if (!cancelled) setError(message(err))
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [id])

  async function run(key: string, action: () => Promise<unknown>): Promise<boolean> {
    setError(null)
    setBusyId(key)
    try {
      await action()
      await load()
      return true
    } catch (err) {
      setError(message(err))
      return false
    } finally {
      setBusyId(null)
    }
  }

  const backToList = () => onNavigate({ name: 'customers', focusCustomerId: id })

  if (loading) return <LoadingState message="Loading customer…" />
  if (!detail) {
    return (
      <div className="flex flex-col gap-4">
        <div>
          <SecondaryButton onClick={() => onNavigate({ name: 'customers' })}>
            ← All Customers
          </SecondaryButton>
        </div>
        <ErrorBanner message={error ?? 'Customer not found.'} />
      </div>
    )
  }

  const { customer, orders, appointments, invoices } = detail
  const orderNumber = new Map(orders.map((o) => [o.id, o.ro_number]))

  async function handleSaveCustomer(event: FormEvent) {
    event.preventDefault()
    const ok = await run(customer.id, () => updateCustomer(customer.id, customerEdit))
    if (ok) setEditingCustomer(false)
  }

  async function handleDeleteCustomer() {
    if (!confirmDeleteCustomer(customer)) return
    setError(null)
    setBusyId(customer.id)
    try {
      await deleteCustomer(customer.id)
      onNavigate({ name: 'customers' })
    } catch (err) {
      setError(message(err))
      setBusyId(null)
    }
  }

  async function handleSaveVehicle(event: FormEvent, vehicle: Vehicle) {
    event.preventDefault()
    const ok = await run(vehicle.id, () => updateVehicle(vehicle.id, vehicleFields(vehicleEdit)))
    if (ok) setEditingVehicleId(null)
  }

  function handleDeleteVehicle(vehicle: Vehicle) {
    if (!confirmDeleteVehicle(vehicle)) return
    void run(vehicle.id, () => deleteVehicle(vehicle.id))
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <SecondaryButton onClick={backToList}>← All Customers</SecondaryButton>
      </div>

      <ErrorBanner message={error} />

      <Card>
        {editingCustomer ? (
          <form onSubmit={(e) => void handleSaveCustomer(e)} className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <p className="text-sm font-semibold text-white md:col-span-2">Edit customer</p>
            <CustomerFormFields values={customerEdit} onChange={setCustomerEdit} />
            <div className="flex gap-2 md:col-span-2">
              <PrimaryButton type="submit" disabled={busyId === customer.id}>
                {busyId === customer.id ? 'Saving…' : 'Save'}
              </PrimaryButton>
              <SecondaryButton onClick={() => setEditingCustomer(false)}>Cancel</SecondaryButton>
            </div>
          </form>
        ) : (
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                Customer
              </span>
              <h1 className="break-words text-2xl font-bold text-white">{customer.name}</h1>
              <dl className="mt-3 text-sm">
                <Row label="Phone">{customer.phone ?? '—'}</Row>
                <Row label="Email">{customer.email ?? '—'}</Row>
                <Row label="Notes">
                  <span className="whitespace-pre-wrap">{customer.notes ?? '—'}</span>
                </Row>
                <Row label="Customer since">{formatDate(customer.created_at)}</Row>
              </dl>
            </div>
            <OverflowMenu
              label={`Actions for ${customer.name}`}
              disabled={busyId === customer.id}
              items={[
                {
                  label: 'Edit',
                  onSelect: () => {
                    setEditingVehicleId(null)
                    setCustomerEdit(customerToForm(customer))
                    setEditingCustomer(true)
                  },
                },
                {
                  label: busyId === customer.id ? 'Deleting…' : 'Delete',
                  danger: true,
                  onSelect: () => void handleDeleteCustomer(),
                },
              ]}
            />
          </div>
        )}
      </Card>

      <Card>
        <h2 className="mb-3 text-base font-bold text-white">
          Vehicles ({customer.vehicles.length})
        </h2>
        {customer.vehicles.length === 0 ? (
          <EmptyState message="No vehicles on file. Add one from the Customers page." />
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {customer.vehicles.map((v) =>
              editingVehicleId === v.id ? (
                <form
                  key={v.id}
                  onSubmit={(e) => void handleSaveVehicle(e, v)}
                  className="grid grid-cols-1 gap-3 rounded-lg border border-blue-500/50 bg-slate-800/60 p-3 md:col-span-2 md:grid-cols-2"
                >
                  <p className="text-sm font-semibold text-white md:col-span-2">Edit vehicle</p>
                  <VehicleFormFields values={vehicleEdit} onChange={setVehicleEdit} maxYear={nextYear} />
                  <div className="flex gap-2 md:col-span-2">
                    <PrimaryButton type="submit" disabled={busyId === v.id}>
                      {busyId === v.id ? 'Saving…' : 'Save'}
                    </PrimaryButton>
                    <SecondaryButton onClick={() => setEditingVehicleId(null)}>Cancel</SecondaryButton>
                  </div>
                </form>
              ) : (
                <div key={v.id} className="rounded-lg border border-slate-700 bg-slate-800/60 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-slate-100">{vehicleLabel(v)}</p>
                    <OverflowMenu
                      label={`Actions for ${vehicleLabel(v)}`}
                      disabled={busyId === v.id}
                      items={[
                        {
                          label: 'Edit',
                          onSelect: () => {
                            setEditingCustomer(false)
                            setVehicleEdit(vehicleToForm(v))
                            setEditingVehicleId(v.id)
                          },
                        },
                        {
                          label: busyId === v.id ? 'Deleting…' : 'Delete',
                          danger: true,
                          onSelect: () => handleDeleteVehicle(v),
                        },
                      ]}
                    />
                  </div>
                  <dl className="mt-2 text-sm">
                    <Row label="Year">{v.year ?? '—'}</Row>
                    <Row label="Make">{v.make}</Row>
                    <Row label="Model">{v.model}</Row>
                    <Row label="Trim">{v.trim ?? '—'}</Row>
                    <Row label="Transmission">{v.transmission ?? '—'}</Row>
                    <Row label="Engine">{v.engine ?? '—'}</Row>
                    <Row label="VIN">{v.vin ?? '—'}</Row>
                    <Row label="License plate">{v.license_plate ?? '—'}</Row>
                    <Row label="Mileage (KM)">{formatKm(v.mileage_km)}</Row>
                  </dl>
                </div>
              ),
            )}
          </div>
        )}
      </Card>

      <Card>
        <h2 className="mb-3 text-base font-bold text-white">Orders ({orders.length})</h2>
        {orders.length === 0 ? (
          <EmptyState message="No orders for this customer yet." />
        ) : (
          <div className="space-y-2">
            {orders.map((o) => (
              <button
                key={o.id}
                onClick={() => onNavigate({ name: 'repair-order', id: o.id })}
                className="flex w-full flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-700 bg-slate-800/60 p-3 text-left text-sm hover:border-slate-600"
              >
                <div className="min-w-0">
                  <p className="font-semibold text-blue-400">{o.ro_number}</p>
                  <p className="text-xs text-slate-300">{vehicleLabel(o.vehicles)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <RepairOrderStatusBadge status={o.status} />
                  <span className="text-xs text-slate-400">{formatDate(o.created_at)}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </Card>

      <Card>
        <h2 className="mb-3 text-base font-bold text-white">
          Appointments ({appointments.length})
        </h2>
        {appointments.length === 0 ? (
          <EmptyState message="No appointments for this customer." />
        ) : (
          <div className="space-y-2">
            {appointments.map((a) => (
              <button
                key={a.id}
                onClick={() => onNavigate({ name: 'appointments', focusAppointmentId: a.id })}
                className="flex w-full flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-700 bg-slate-800/60 p-3 text-left text-sm hover:border-slate-600"
              >
                <div className="min-w-0">
                  <p className="font-semibold text-slate-100">
                    {formatAppointmentTime(a.starts_at, a.ends_at)}
                  </p>
                  <p className="text-xs text-slate-400">
                    {a.service ?? 'No service noted'}
                    {a.vehicles ? ` · ${vehicleLabel(a.vehicles)}` : ''}
                    {a.repair_orders ? ` · ${a.repair_orders.ro_number}` : ''}
                  </p>
                </div>
                <AppointmentStatusBadge status={a.status} />
              </button>
            ))}
          </div>
        )}
      </Card>

      <Card>
        <h2 className="mb-3 text-base font-bold text-white">Invoices ({invoices.length})</h2>
        {invoices.length === 0 ? (
          <EmptyState message="No invoices for this customer." />
        ) : (
          <div className="space-y-2">
            {invoices.map((inv) => (
              <button
                key={inv.id}
                onClick={() => onNavigate({ name: 'repair-order', id: inv.repair_order_id })}
                className="flex w-full flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-700 bg-slate-800/60 p-3 text-left text-sm hover:border-slate-600"
              >
                <div className="min-w-0">
                  <p className="font-semibold text-slate-100">{inv.invoice_number}</p>
                  <p className="text-xs text-slate-400">
                    {orderNumber.get(inv.repair_order_id) ?? ''} · {formatDate(inv.created_at)}
                    {' · '}
                    {INVOICE_STATUS_LABELS[inv.status]}
                  </p>
                </div>
                <span className="font-bold text-white">{money(Number(inv.total))}</span>
              </button>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
