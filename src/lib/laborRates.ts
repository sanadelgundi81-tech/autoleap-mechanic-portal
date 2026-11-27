// Labour rates for the job timer. Data in code: edit this one file.
// A timer run on a service line bills that line at the rate below when it
// stops. The list decides the rate — the user never picks one.

/** $50/hr — jobs on SMALL_JOBS. */
export const SMALL_JOB_RATE_CENTS = 5000
/** $75/hr — every job not on SMALL_JOBS. */
export const BIG_JOB_RATE_CENTS = 7500

// PASTE THE OWNER'S SMALL-JOBS LIST HERE — one job name per line.
// Anything NOT on this list bills at the big-job rate automatically.
export const SMALL_JOBS: string[] = []

/** Lowercase, trim, collapse runs of whitespace — applied to both sides of the match. */
export function normalizeJobName(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, ' ')
}

const SMALL_JOB_SET = new Set(SMALL_JOBS.map(normalizeJobName))

export function isSmallJob(jobName: string): boolean {
  return SMALL_JOB_SET.has(normalizeJobName(jobName))
}

/** Hourly rate in cents for a job: small-job list match → $50/hr, otherwise $75/hr. */
export function rateForJob(jobName: string): number {
  return isSmallJob(jobName) ? SMALL_JOB_RATE_CENTS : BIG_JOB_RATE_CENTS
}

/** "$50/hr — small job" or "$75/hr", for a rate in cents. */
export function rateLabelForCents(cents: number): string {
  const text = `$${(cents / 100).toFixed(cents % 100 === 0 ? 0 : 2)}/hr`
  return cents === SMALL_JOB_RATE_CENTS ? `${text} — small job` : text
}

/** The label for the rate a job would bill at. */
export function rateLabel(jobName: string): string {
  return rateLabelForCents(rateForJob(jobName))
}

/** Elapsed minutes → labour hours, rounded to the nearest 0.1 h (6 minutes). */
export function minutesToBilledHours(minutes: number): number {
  return Math.round(minutes / 6) / 10
}
