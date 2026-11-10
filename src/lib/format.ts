import type { Vehicle } from './types'

const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

export function money(value: number | null | undefined): string {
  if (value === null || value === undefined) return '—'
  return usd.format(value)
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function formatDateTime(value: string | null | undefined): string {
  if (!value) return '—'
  return new Date(value).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function vehicleLabel(
  vehicle: Pick<Vehicle, 'year' | 'make' | 'model' | 'trim'> | null | undefined,
): string {
  if (!vehicle) return 'No vehicle'
  const parts = [
    vehicle.year ? String(vehicle.year) : null,
    vehicle.make,
    vehicle.model,
    vehicle.trim,
  ].filter(Boolean)
  return parts.join(' ')
}

export function hours(value: number): string {
  return `${Number(value).toFixed(1)} hrs`
}

export function formatKm(value: number | null | undefined): string {
  if (value === null || value === undefined) return '—'
  return `${Number(value).toLocaleString('en-US')} km`
}
