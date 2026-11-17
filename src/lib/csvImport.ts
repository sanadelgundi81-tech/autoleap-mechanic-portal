// CSV import of customers + vehicles. One CSV row = one customer and
// optionally one vehicle. Writes go only through createCustomer /
// createVehicle in data.ts; existing records are read with fetchCustomers.
//
// Merge / skip rules (they make re-running the same file a no-op):
// - Customer: same phone (trimmed, exact) as an existing customer → merge
//   into it. With no phone on the row: same name (trimmed, case-insensitive).
//   A merged customer is never updated.
// - Vehicle (under the matched/created customer): same VIN, or same licence
//   plate (trimmed, case-insensitive, spaces ignored) → skipped as already
//   there. A vehicle with neither VIN nor plate is matched on year + make +
//   model instead, so it isn't duplicated on a re-run either.

import { isBlankRecord } from './csv'
import { createCustomer, createVehicle, fetchCustomers } from './data'
import type { CustomerWithVehicles, Vehicle } from './types'

export type ImportFieldKey =
  | 'name'
  | 'phone'
  | 'email'
  | 'notes'
  | 'year'
  | 'make'
  | 'model'
  | 'trim'
  | 'transmission'
  | 'engine'
  | 'vin'
  | 'license_plate'
  | 'mileage_km'

export interface ImportFieldDef {
  key: ImportFieldKey
  label: string
  group: 'customer' | 'vehicle'
  required?: boolean
}

export const IMPORT_FIELDS: ImportFieldDef[] = [
  { key: 'name', label: 'Name', group: 'customer', required: true },
  { key: 'phone', label: 'Phone', group: 'customer' },
  { key: 'email', label: 'Email', group: 'customer' },
  { key: 'notes', label: 'Notes', group: 'customer' },
  { key: 'year', label: 'Year', group: 'vehicle' },
  { key: 'make', label: 'Make', group: 'vehicle' },
  { key: 'model', label: 'Model', group: 'vehicle' },
  { key: 'trim', label: 'Trim', group: 'vehicle' },
  { key: 'transmission', label: 'Transmission', group: 'vehicle' },
  { key: 'engine', label: 'Engine', group: 'vehicle' },
  { key: 'vin', label: 'VIN', group: 'vehicle' },
  { key: 'license_plate', label: 'License plate', group: 'vehicle' },
  { key: 'mileage_km', label: 'Mileage (km)', group: 'vehicle' },
]

/** Field → CSV column index, or null for "not mapped" (left empty). */
export type ColumnMapping = Record<ImportFieldKey, number | null>

export function emptyMapping(): ColumnMapping {
  return Object.fromEntries(IMPORT_FIELDS.map((f) => [f.key, null])) as ColumnMapping
}

/**
 * Header keywords per field, strongest first. Fields are guessed in this
 * order so specific headers are claimed before generic ones ("Customer
 * Phone" goes to phone before name looks for "customer"; "Model Year" goes
 * to year before model looks for "model"). Headers are compared lowercased
 * with everything except letters and digits removed.
 */
const GUESS_RULES: [ImportFieldKey, string[]][] = [
  ['vin', ['vin', 'chassis']],
  ['license_plate', ['plate', 'licen', 'registration', 'rego']],
  ['email', ['email']],
  ['phone', ['phone', 'mobile', 'cell', 'tel']],
  ['year', ['year', 'yr']],
  ['mileage_km', ['mileage', 'odometer', 'odo', 'kilomet', 'km']],
  ['transmission', ['transmission', 'gearbox']],
  ['engine', ['engine', 'motor']],
  ['trim', ['trim', 'variant', 'submodel']],
  ['make', ['make', 'manufacturer', 'brand']],
  ['model', ['model']],
  ['notes', ['note', 'comment', 'remark', 'memo']],
  ['name', ['fullname', 'customername', 'clientname', 'name', 'client', 'customer', 'owner', 'contact']],
]

const normalizeHeader = (h: string) => h.toLowerCase().replace(/[^a-z0-9]/g, '')

/** Auto-guess from the header row. Each column is used for at most one field. */
export function guessMapping(headers: string[]): ColumnMapping {
  const mapping = emptyMapping()
  const norm = headers.map(normalizeHeader)
  const used = new Set<number>()
  for (const [key, words] of GUESS_RULES) {
    for (const word of words) {
      const col = norm.findIndex((h, i) => !used.has(i) && h !== '' && h.includes(word))
      if (col !== -1) {
        mapping[key] = col
        used.add(col)
        break
      }
    }
  }
  return mapping
}

// ---------- Row building + validation ----------

export interface ImportRowValues {
  name: string
  phone: string
  email: string
  notes: string
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

export interface PreparedRow {
  /** Row number as a spreadsheet shows it (the header row is usually row 1). */
  rowNumber: number
  values: ImportRowValues
  hasVehicle: boolean
  /** Problems that make the row fail. Empty = the row will import. */
  problems: string[]
}

const EMAIL_SHAPE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MAX_INT = 2147483647

/** The year range accepted: 1900 through next year. */
export function yearRange(now: Date = new Date()): { min: number; max: number } {
  return { min: 1900, max: now.getFullYear() + 1 }
}

/**
 * Turns data records into rows with values and per-row problems. Blank
 * records are skipped but still counted, so row numbers match the file.
 * firstRowNumber is the spreadsheet row of records[0] (2 when the header is row 1).
 */
export function prepareRows(
  records: string[][],
  mapping: ColumnMapping,
  firstRowNumber = 2,
  now: Date = new Date(),
): PreparedRow[] {
  const { min, max } = yearRange(now)
  const rows: PreparedRow[] = []
  records.forEach((record, index) => {
    if (isBlankRecord(record)) return
    const cell = (key: ImportFieldKey) => {
      const col = mapping[key]
      return col === null ? '' : (record[col] ?? '').trim()
    }
    const problems: string[] = []

    const name = cell('name')
    if (name === '') problems.push('missing name')

    const email = cell('email').toLowerCase()
    if (email !== '' && !EMAIL_SHAPE.test(email)) problems.push(`email "${email}" doesn't look like an email`)

    let year: number | null = null
    const yearText = cell('year')
    if (yearText !== '') {
      if (!/^\d+$/.test(yearText)) problems.push(`year "${yearText}" is not a number`)
      else {
        year = Number(yearText)
        if (year < min || year > max) problems.push(`year ${year} is outside ${min}–${max}`)
      }
    }

    let mileage: number | null = null
    const mileageText = cell('mileage_km')
    if (mileageText !== '') {
      // Accept thousands separators and a trailing "km": "123,456 km" → 123456.
      const cleaned = mileageText.replace(/km$/i, '').replace(/[\s,]/g, '')
      if (!/^-?\d+(\.\d+)?$/.test(cleaned)) problems.push(`mileage "${mileageText}" is not a number`)
      else {
        const n = Math.round(Number(cleaned))
        if (n < 0) problems.push(`mileage ${mileageText} is negative`)
        else if (n > MAX_INT) problems.push(`mileage ${mileageText} is too large`)
        else mileage = n
      }
    }

    const make = cell('make')
    const model = cell('model')
    const hasVehicle = make !== '' || model !== ''
    if (hasVehicle && (make === '' || model === '')) problems.push('vehicle needs both make and model')

    rows.push({
      rowNumber: firstRowNumber + index,
      values: {
        name,
        phone: cell('phone'),
        email,
        notes: cell('notes'),
        year,
        make,
        model,
        trim: cell('trim'),
        transmission: cell('transmission'),
        engine: cell('engine'),
        vin: cell('vin'),
        license_plate: cell('license_plate'),
        mileage_km: mileage,
      },
      hasVehicle,
      problems,
    })
  })
  return rows
}

// ---------- Import ----------

export interface ImportFailure {
  rowNumber: number
  reason: string
}

export interface ImportReport {
  customersCreated: number
  /** Rows whose customer matched one already in the app (or created earlier in this file). */
  customersMerged: number
  vehiclesAdded: number
  /** Rows where the vehicle was already on file under that customer. */
  vehiclesAlreadyThere: number
  /** Rows that wrote nothing: customer matched, and no vehicle or vehicle already there. */
  rowsAlreadyThere: number
  failed: ImportFailure[]
}

const key = (s: string) => s.trim().toLowerCase()
const plateKey = (s: string) => s.toLowerCase().replace(/\s+/g, '')

function sameVehicle(existing: Vehicle, v: ImportRowValues): boolean {
  if (v.vin !== '' && existing.vin && key(existing.vin) === key(v.vin)) return true
  if (v.license_plate !== '' && existing.license_plate && plateKey(existing.license_plate) === plateKey(v.license_plate))
    return true
  if (v.vin === '' && v.license_plate === '') {
    return (
      (existing.year ?? null) === v.year &&
      key(existing.make) === key(v.make) &&
      key(existing.model) === key(v.model)
    )
  }
  return false
}

/**
 * Imports the rows in order. Rows with problems are reported as failed and
 * not written. A database error on one row fails that row only; the rest
 * continue. Existing customers are read once up front, and customers /
 * vehicles created during the run are added to the same lookup, so repeats
 * inside one file merge/skip as well.
 */
export async function importRows(
  rows: PreparedRow[],
  onProgress?: (done: number, total: number) => void,
): Promise<ImportReport> {
  const report: ImportReport = {
    customersCreated: 0,
    customersMerged: 0,
    vehiclesAdded: 0,
    vehiclesAlreadyThere: 0,
    rowsAlreadyThere: 0,
    failed: [],
  }
  const customers: CustomerWithVehicles[] = await fetchCustomers()
  // Oldest first, so a name shared by several customers resolves to the same one every run.
  customers.sort((a, b) => a.created_at.localeCompare(b.created_at) || a.id.localeCompare(b.id))

  const findCustomer = (v: ImportRowValues) =>
    v.phone !== ''
      ? customers.find((c) => c.phone !== null && c.phone.trim() === v.phone)
      : customers.find((c) => key(c.name) === key(v.name))

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    onProgress?.(i, rows.length)
    if (row.problems.length > 0) {
      report.failed.push({ rowNumber: row.rowNumber, reason: row.problems.join('; ') })
      continue
    }
    const v = row.values
    let customerSaved = false
    try {
      let customer = findCustomer(v)
      const merged = customer !== undefined
      if (!customer) {
        const created = await createCustomer({ name: v.name, phone: v.phone, email: v.email, notes: v.notes })
        customer = { ...created, vehicles: [] }
        customers.push(customer)
        report.customersCreated++
      } else {
        report.customersMerged++
      }

      let wroteVehicle = false
      if (row.hasVehicle) {
        if (customer.vehicles.some((existing) => sameVehicle(existing, v))) {
          report.vehiclesAlreadyThere++
        } else {
          customerSaved = true
          const vehicle = await createVehicle({
            customer_id: customer.id,
            year: v.year,
            make: v.make,
            model: v.model,
            trim: v.trim,
            transmission: v.transmission,
            engine: v.engine,
            vin: v.vin,
            license_plate: v.license_plate,
            mileage_km: v.mileage_km,
          })
          customer.vehicles.push(vehicle)
          report.vehiclesAdded++
          wroteVehicle = true
        }
      }
      if (merged && !wroteVehicle) report.rowsAlreadyThere++
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      report.failed.push({
        rowNumber: row.rowNumber,
        // The customer half is already saved; a re-run merges into it and retries the vehicle.
        reason: customerSaved ? `customer saved, but the vehicle failed: ${message}` : message,
      })
    }
  }
  onProgress?.(rows.length, rows.length)
  return report
}
