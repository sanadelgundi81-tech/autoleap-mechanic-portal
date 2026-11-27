// Customer & vehicle form pieces shared by the Customers list and the
// customer detail view, so both edit with the same fields and delete with
// the same confirmation text.

import { vehicleLabel } from '../lib/format'
import type { Customer, CustomerWithVehicles, Vehicle } from '../lib/types'
import { Field, inputClassName } from './ui'

export interface CustomerFormValues {
  name: string
  phone: string
  email: string
  notes: string
}

export interface VehicleFormValues {
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

export const EMPTY_CUSTOMER: CustomerFormValues = { name: '', phone: '', email: '', notes: '' }
export const EMPTY_VEHICLE: VehicleFormValues = {
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

export function customerToForm(c: Customer): CustomerFormValues {
  return { name: c.name, phone: c.phone ?? '', email: c.email ?? '', notes: c.notes ?? '' }
}

export function vehicleToForm(v: Vehicle): VehicleFormValues {
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
export function optionalNumber(value: string): number | null {
  return value.trim() === '' ? null : Number(value)
}

export function vehicleFields(values: VehicleFormValues) {
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

export function message(err: unknown): string {
  return err instanceof Error ? err.message : String(err)
}

/** Name, phone, email, notes: the same fields for create and edit. */
export function CustomerFormFields({
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
export function VehicleFormFields({
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

/** Confirm text for deleting a customer (vehicles + appointments go with it). */
export function confirmDeleteCustomer(customer: CustomerWithVehicles): boolean {
  const n = customer.vehicles.length
  const goesWith =
    n === 0
      ? 'Their appointments are deleted too.'
      : `Their ${n === 1 ? 'vehicle' : `${n} vehicles`} and appointments are deleted too.`
  return window.confirm(`Delete customer "${customer.name}"? ${goesWith} This cannot be undone.`)
}

/** Confirm text for deleting a vehicle (its appointments stay, vehicle cleared). */
export function confirmDeleteVehicle(vehicle: Vehicle): boolean {
  return window.confirm(
    `Delete vehicle "${vehicleLabel(vehicle)}"? Its appointments stay, with the vehicle cleared. This cannot be undone.`,
  )
}
