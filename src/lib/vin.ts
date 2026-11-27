// VIN check, decode and recall lookup — free public sources only, called
// straight from the browser (no key, no server code). Nothing here stores or
// logs a VIN; the only place a VIN is saved is vehicles.vin, by the form.

/** Uppercase, drop spaces / dashes / anything not a letter or digit. */
export function normalizeVin(raw: string): string {
  return raw.toUpperCase().replace(/[^A-Z0-9]/g, '')
}

/**
 * A scanned Code 39 VIN label often carries a leading "I" (import) marker,
 * giving 18 characters. Keep the 17-character VIN.
 */
export function vinFromScan(text: string): string {
  const vin = normalizeVin(text)
  if (vin.length === 18 && vin.startsWith('I')) return vin.slice(1)
  return vin
}

const TRANSLITERATION: Record<string, number> = {
  A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8,
  J: 1, K: 2, L: 3, M: 4, N: 5, P: 7, R: 9,
  S: 2, T: 3, U: 4, V: 5, W: 6, X: 7, Y: 8, Z: 9,
}
const WEIGHTS = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2]

export const INVALID_VIN_MESSAGE = "That VIN doesn't check out — recheck the characters"

/**
 * ISO 3779 / North American check: exactly 17 characters, letters and digits
 * only, no I, O or Q, and position 9 must equal the weighted check digit.
 */
export function isValidVin(vin: string): boolean {
  if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(vin)) return false
  let sum = 0
  for (let i = 0; i < 17; i++) {
    const ch = vin[i]
    const value = /\d/.test(ch) ? Number(ch) : TRANSLITERATION[ch]
    sum += value * WEIGHTS[i]
  }
  const remainder = sum % 11
  const expected = remainder === 10 ? 'X' : String(remainder)
  return vin[8] === expected
}

/** Only the fields vPIC actually filled; anything it left blank is absent. */
export interface DecodedVehicle {
  year?: string
  make?: string
  model?: string
  trim?: string
  engine?: string
  transmission?: string
}

export type DecodeResult =
  | { kind: 'found'; vehicle: DecodedVehicle }
  | { kind: 'no-match' }
  | { kind: 'error'; message: string }

function clean(value: unknown): string {
  const text = typeof value === 'string' ? value.trim() : ''
  return text === '' || text.toLowerCase() === 'not applicable' ? '' : text
}

/** Title-case an all-caps make ("BMW" stays, "FORD" → "Ford"). */
function tidyMake(make: string): string {
  if (make.length <= 3) return make
  return make
    .toLowerCase()
    .split(' ')
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(' ')
}

/** NHTSA vPIC DecodeVinValues (free, no key). Call only with a VIN that passed isValidVin. */
export async function decodeVin(vin: string): Promise<DecodeResult> {
  let body: { Results?: Record<string, unknown>[] }
  try {
    const res = await fetch(
      `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/${encodeURIComponent(vin)}?format=json`,
    )
    if (!res.ok) return { kind: 'error', message: `The VIN lookup failed (HTTP ${res.status}). Enter the details by hand.` }
    body = await res.json()
  } catch {
    return { kind: 'error', message: 'The VIN lookup could not be reached. Enter the details by hand.' }
  }
  const r = body.Results?.[0]
  if (!r) return { kind: 'no-match' }
  const year = clean(r.ModelYear)
  const make = clean(r.Make)
  const model = clean(r.Model)
  if (!make && !model && !year) return { kind: 'no-match' }

  const vehicle: DecodedVehicle = {}
  if (year) vehicle.year = year
  if (make) vehicle.make = tidyMake(make)
  if (model) vehicle.model = model
  const trim = clean(r.Trim) || clean(r.Series)
  if (trim) vehicle.trim = trim

  const displacement = clean(r.DisplacementL)
  const cylinders = clean(r.EngineCylinders)
  const engineModel = clean(r.EngineModel)
  const engineParts = [
    displacement ? `${Number(displacement).toFixed(1)}L` : '',
    cylinders ? `${cylinders}-cyl` : '',
    engineModel,
  ].filter(Boolean)
  if (engineParts.length > 0) vehicle.engine = engineParts.join(' ')

  const style = clean(r.TransmissionStyle)
  const speeds = clean(r.TransmissionSpeeds)
  const transmissionParts = [style, speeds ? `${speeds}-speed` : ''].filter(Boolean)
  if (transmissionParts.length > 0) vehicle.transmission = transmissionParts.join(' ')

  return { kind: 'found', vehicle }
}

export interface Recall {
  campaignNumber: string
  component: string
  summary: string
  remedy: string
  reportDate: string
}

/**
 * NHTSA recalls for a make / model / model year (free, no key). Recalls are a
 * bonus: any failure returns null and the caller hides the section.
 */
export async function fetchRecalls(make: string, model: string, year: number): Promise<Recall[] | null> {
  try {
    const params = new URLSearchParams({ make, model, modelYear: String(year) })
    const res = await fetch(`https://api.nhtsa.gov/recalls/recallsByVehicle?${params}`)
    if (!res.ok) return null
    const body = (await res.json()) as { results?: Record<string, unknown>[] }
    if (!Array.isArray(body.results)) return null
    return body.results.map((r) => ({
      campaignNumber: clean(r.NHTSACampaignNumber),
      component: clean(r.Component),
      summary: clean(r.Summary),
      remedy: clean(r.Remedy),
      reportDate: clean(r.ReportReceivedDate),
    }))
  } catch {
    return null
  }
}

/** NICB VINCheck: free, but needs a captcha on their site — never called by the app. */
export const NICB_VINCHECK_URL = 'https://www.nicb.org/vincheck'

/** Paid history reports, VIN prefilled. No affiliate code, no key. */
export function carfaxUrl(vin: string): string {
  return `https://www.carfax.com/VehicleHistory/p/Report.cfx?vin=${encodeURIComponent(vin)}`
}
export function autoCheckUrl(vin: string): string {
  return `https://www.autocheck.com/vehiclehistory/?vin=${encodeURIComponent(vin)}`
}
