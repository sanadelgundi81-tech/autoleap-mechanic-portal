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

/** Appointment time in local time, e.g. "Fri, Nov 13, 2026, 9:00 AM – 10:30 AM". */
export function formatAppointmentTime(startsAt: string, endsAt: string | null): string {
  const start = new Date(startsAt)
  const startText = start.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
  if (!endsAt) return startText
  const end = new Date(endsAt)
  const sameDay = end.toDateString() === start.toDateString()
  const endText = sameDay
    ? end.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    : end.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      })
  return `${startText} – ${endText}`
}

/** ISO timestamp → value for an <input type="datetime-local"> (local time). */
export function toDateTimeLocalValue(iso: string | null | undefined): string {
  if (!iso) return ''
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

/** <input type="datetime-local"> value (local time) → ISO timestamp; blank → null. */
export function fromDateTimeLocalValue(value: string): string | null {
  if (value.trim() === '') return null
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? null : d.toISOString()
}

/**
 * Whole minutes between start and end; a running timelog (no end)
 * counts up to `now`. Never negative.
 */
export function timelogMinutes(
  startedAt: string,
  endedAt: string | null,
  now: number = Date.now(),
): number {
  const end = endedAt ? new Date(endedAt).getTime() : now
  return Math.max(0, Math.floor((end - new Date(startedAt).getTime()) / 60000))
}

/** Minutes as "45 min" or "2 h 05 min". */
export function formatDuration(minutes: number): string {
  const m = Math.max(0, Math.floor(minutes))
  if (m < 60) return `${m} min`
  return `${Math.floor(m / 60)} h ${String(m % 60).padStart(2, '0')} min`
}

/** Timelog range in local time, e.g. "Nov 16, 9:00 AM – 10:30 AM" or "… – running". */
export function formatTimelogRange(startedAt: string, endedAt: string | null): string {
  const start = new Date(startedAt)
  const startText = start.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
  if (!endedAt) return `${startText} – running`
  const end = new Date(endedAt)
  const endText =
    end.toDateString() === start.toDateString()
      ? end.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
      : end.toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
        })
  return `${startText} – ${endText}`
}

export function formatKm(value: number | null | undefined): string {
  if (value === null || value === undefined) return '—'
  return `${Number(value).toLocaleString('en-US')} km`
}
