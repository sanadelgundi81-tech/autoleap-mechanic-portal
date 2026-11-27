import { useEffect, useMemo, useState, type FormEvent } from 'react'
import {
  createTorqueSpec,
  deleteTorqueSpec,
  fetchTorqueSpecs,
  updateTorqueSpec,
  type TorqueSpecInput,
} from '../lib/data'
import type { TorqueSpec } from '../lib/types'
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
import { useDeleteWarning } from '../components/DeleteWarning'
import { simpleWarning } from '../lib/deleteWarnings'
import { OverflowMenu } from '../components/OverflowMenu'

export const TORQUE_NOTE =
  'Reference only — always verify against the vehicle’s service manual before torquing.'

const NM_PER_FTLB = 1.3558179483
const SHOW_LIMIT = 100

/** The job category: the part before " — " ("Wheel lug nut — Wheel bolts F30" → "Wheel lug nut"). */
function jobCategory(job: string): string {
  return job.split(' — ')[0].trim()
}

function fmt(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(1).replace(/\.0$/, '')
}

function range(lo: number, hi: number | null): string {
  return hi === null || hi === lo ? fmt(lo) : `${fmt(lo)}–${fmt(hi)}`
}

/** Stated value, or a converted one (marked ≈) when the source gives only the other unit. */
function torqueText(spec: TorqueSpec): { nm: string; ftlb: string; nmConverted: boolean; ftlbConverted: boolean } {
  const nm =
    spec.torque_nm !== null
      ? range(spec.torque_nm, spec.torque_nm_max)
      : spec.torque_ftlb !== null
        ? range(
            Math.round(spec.torque_ftlb * NM_PER_FTLB),
            spec.torque_ftlb_max !== null ? Math.round(spec.torque_ftlb_max * NM_PER_FTLB) : null,
          )
        : '—'
  const ftlb =
    spec.torque_ftlb !== null
      ? range(spec.torque_ftlb, spec.torque_ftlb_max)
      : spec.torque_nm !== null
        ? range(
            Math.round(spec.torque_nm / NM_PER_FTLB),
            spec.torque_nm_max !== null ? Math.round(spec.torque_nm_max / NM_PER_FTLB) : null,
          )
        : '—'
  return { nm, ftlb, nmConverted: spec.torque_nm === null, ftlbConverted: spec.torque_ftlb === null }
}

function years(spec: TorqueSpec): string {
  if (spec.year_to === null) return `${spec.year_from}–present`
  if (spec.year_to === spec.year_from) return String(spec.year_from)
  return `${spec.year_from}–${spec.year_to}`
}

function sourceLabel(source: string): { text: string; href: string | null } {
  if (/^https?:\/\//i.test(source)) {
    try {
      return { text: new URL(source).hostname.replace(/^www\./, ''), href: source }
    } catch {
      return { text: source, href: null }
    }
  }
  return { text: source, href: null }
}

interface FormValues {
  make: string
  model: string
  yearFrom: string
  yearTo: string
  job: string
  nm: string
  nmMax: string
  ftlb: string
  ftlbMax: string
  source: string
}

const EMPTY_FORM: FormValues = {
  make: '',
  model: '',
  yearFrom: '',
  yearTo: '',
  job: '',
  nm: '',
  nmMax: '',
  ftlb: '',
  ftlbMax: '',
  source: '',
}

function specToForm(s: TorqueSpec): FormValues {
  const str = (n: number | null) => (n === null ? '' : String(n))
  return {
    make: s.make,
    model: s.model,
    yearFrom: String(s.year_from),
    yearTo: str(s.year_to),
    job: s.job,
    nm: str(s.torque_nm),
    nmMax: str(s.torque_nm_max),
    ftlb: str(s.torque_ftlb),
    ftlbMax: str(s.torque_ftlb_max),
    source: s.source,
  }
}

/** Blank → null; anything else → a number (an invalid one is refused by validateTorqueSpec). */
function optionalNumber(value: string): number | null {
  return value.trim() === '' ? null : Number(value)
}

function formToInput(v: FormValues): TorqueSpecInput {
  return {
    make: v.make,
    model: v.model,
    year_from: optionalNumber(v.yearFrom),
    year_to: optionalNumber(v.yearTo),
    job: v.job,
    torque_nm: optionalNumber(v.nm),
    torque_nm_max: optionalNumber(v.nmMax),
    torque_ftlb: optionalNumber(v.ftlb),
    torque_ftlb_max: optionalNumber(v.ftlbMax),
    source: v.source,
  }
}

function message(err: unknown): string {
  return err instanceof Error ? err.message : String(err)
}

export function TorqueSpecs() {
  const [specs, setSpecs] = useState<TorqueSpec[]>([])
  const deleteWarning = useDeleteWarning()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [makeFilter, setMakeFilter] = useState('')
  const [modelQuery, setModelQuery] = useState('')
  const [yearQuery, setYearQuery] = useState('')
  const [jobFilter, setJobFilter] = useState('')
  const [fastenerQuery, setFastenerQuery] = useState('')

  const [showAdd, setShowAdd] = useState(false)
  const [addValues, setAddValues] = useState<FormValues>(EMPTY_FORM)
  const [formError, setFormError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValues, setEditValues] = useState<FormValues>(EMPTY_FORM)
  const [busyId, setBusyId] = useState<string | null>(null)

  async function load() {
    try {
      setSpecs(await fetchTorqueSpecs())
    } catch (err) {
      setError(message(err))
    }
  }

  useEffect(() => {
    let cancelled = false
    fetchTorqueSpecs()
      .then((rows) => {
        if (!cancelled) setSpecs(rows)
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
  }, [])

  const makes = useMemo(
    () => [...new Set(specs.map((s) => s.make))].sort((a, b) => a.localeCompare(b)),
    [specs],
  )
  const jobs = useMemo(
    () => [...new Set(specs.map((s) => jobCategory(s.job)))].sort((a, b) => a.localeCompare(b)),
    [specs],
  )

  const filtered = useMemo(() => {
    const model = modelQuery.trim().toLowerCase()
    const fastener = fastenerQuery.trim().toLowerCase()
    const year = /^\d{4}$/.test(yearQuery.trim()) ? Number(yearQuery.trim()) : null
    return specs.filter((s) => {
      if (makeFilter && s.make !== makeFilter) return false
      if (model && !s.model.toLowerCase().includes(model)) return false
      if (year !== null && (year < s.year_from || (s.year_to !== null && year > s.year_to))) return false
      if (jobFilter && jobCategory(s.job) !== jobFilter) return false
      if (fastener && !s.job.toLowerCase().includes(fastener)) return false
      return true
    })
  }, [specs, makeFilter, modelQuery, yearQuery, jobFilter, fastenerQuery])

  const anyFilter = makeFilter || modelQuery || yearQuery || jobFilter || fastenerQuery

  async function handleAdd(event: FormEvent) {
    event.preventDefault()
    setFormError(null)
    setSaving(true)
    try {
      await createTorqueSpec(formToInput(addValues))
      setAddValues(EMPTY_FORM)
      setShowAdd(false)
      await load()
    } catch (err) {
      setFormError(message(err))
    } finally {
      setSaving(false)
    }
  }

  async function handleSaveEdit(event: FormEvent, id: string) {
    event.preventDefault()
    setFormError(null)
    setBusyId(id)
    try {
      await updateTorqueSpec(id, formToInput(editValues))
      setEditingId(null)
      await load()
    } catch (err) {
      setFormError(message(err))
    } finally {
      setBusyId(null)
    }
  }

  function handleDelete(spec: TorqueSpec) {
    deleteWarning.ask({
      title: 'Delete this torque spec?',
      load: simpleWarning(`${spec.job} — ${spec.make} ${spec.model} (${years(spec)})`),
      run: () => deleteTorqueSpec(spec.id),
      onDeleted: load,
    })
  }

  if (loading) return <LoadingState message="Loading torque specs…" />

  const shown = filtered.slice(0, SHOW_LIMIT)

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-white">Torque Specs</h1>
        <PrimaryButton
          onClick={() => {
            setShowAdd((v) => !v)
            setFormError(null)
            setAddValues({ ...EMPTY_FORM, make: makeFilter })
          }}
        >
          {showAdd ? 'Cancel' : 'Add torque spec'}
        </PrimaryButton>
      </div>

      <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm font-semibold text-amber-300">
        {TORQUE_NOTE}
      </p>

      <ErrorBanner message={error} />
      {deleteWarning.dialog}

      {showAdd && (
        <Card>
          <form onSubmit={(e) => void handleAdd(e)} className="flex flex-col gap-3">
            <p className="text-sm font-semibold text-white">New torque spec</p>
            <TorqueFormFields values={addValues} onChange={setAddValues} makes={makes} jobs={jobs} />
            {formError && <ErrorBanner message={formError} />}
            <div>
              <PrimaryButton type="submit" disabled={saving}>
                {saving ? 'Saving…' : 'Save torque spec'}
              </PrimaryButton>
            </div>
          </form>
        </Card>
      )}

      <Card>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-5">
          <Field label="Make">
            <select
              value={makeFilter}
              onChange={(e) => setMakeFilter(e.target.value)}
              className={inputClassName}
            >
              <option value="">All makes</option>
              {makes.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Model">
            <input
              value={modelQuery}
              onChange={(e) => setModelQuery(e.target.value)}
              className={inputClassName}
              placeholder="e.g. F-150"
            />
          </Field>
          <Field label="Year">
            <input
              value={yearQuery}
              onChange={(e) => setYearQuery(e.target.value)}
              className={inputClassName}
              inputMode="numeric"
              placeholder="e.g. 2016"
            />
          </Field>
          <Field label="Job">
            <select
              value={jobFilter}
              onChange={(e) => setJobFilter(e.target.value)}
              className={inputClassName}
            >
              <option value="">All jobs</option>
              {jobs.map((j) => (
                <option key={j} value={j}>
                  {j}
                </option>
              ))}
            </select>
          </Field>
          <div className="sm:col-span-2 md:col-span-1">
            <Field label="Fastener contains">
              <input
                value={fastenerQuery}
                onChange={(e) => setFastenerQuery(e.target.value)}
                className={inputClassName}
                placeholder="e.g. caliper"
              />
            </Field>
          </div>
        </div>
        <p className="mt-3 text-xs text-slate-400">
          {filtered.length} of {specs.length} specs
          {filtered.length > SHOW_LIMIT ? ` · showing the first ${SHOW_LIMIT} — narrow the search` : ''}
          {' · '}≈ = converted from the unit the source states
        </p>
      </Card>

      {specs.length === 0 ? (
        <EmptyState message="No torque specs yet. Use Add torque spec to add the first one." />
      ) : filtered.length === 0 ? (
        <EmptyState
          message={anyFilter ? 'No specs match this search.' : 'No torque specs yet.'}
        />
      ) : (
        <div className="space-y-2">
          {shown.map((spec) =>
            editingId === spec.id ? (
              <Card key={spec.id} className="border-blue-500/50">
                <form onSubmit={(e) => void handleSaveEdit(e, spec.id)} className="flex flex-col gap-3">
                  <p className="text-sm font-semibold text-white">Edit torque spec</p>
                  <TorqueFormFields values={editValues} onChange={setEditValues} makes={makes} jobs={jobs} />
                  {formError && <ErrorBanner message={formError} />}
                  <div className="flex gap-2">
                    <PrimaryButton type="submit" disabled={busyId === spec.id}>
                      {busyId === spec.id ? 'Saving…' : 'Save'}
                    </PrimaryButton>
                    <SecondaryButton onClick={() => setEditingId(null)}>Cancel</SecondaryButton>
                  </div>
                </form>
              </Card>
            ) : (
              <SpecRow
                key={spec.id}
                spec={spec}
                busy={busyId === spec.id}
                onEdit={() => {
                  setFormError(null)
                  setEditValues(specToForm(spec))
                  setEditingId(spec.id)
                }}
                onDelete={() => void handleDelete(spec)}
              />
            ),
          )}
        </div>
      )}
    </div>
  )
}

function SpecRow({
  spec,
  busy,
  onEdit,
  onDelete,
}: {
  spec: TorqueSpec
  busy: boolean
  onEdit: () => void
  onDelete: () => void
}) {
  const t = torqueText(spec)
  const src = sourceLabel(spec.source)
  return (
    <div className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-900 p-3">
      <div className="min-w-0 flex-1">
        <p className="break-words font-semibold text-slate-100">{spec.job}</p>
        <p className="text-sm text-slate-300">
          {spec.make} {spec.model} · {years(spec)}
        </p>
        <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1">
          <span className="text-base font-bold text-white">
            {t.nmConverted ? '≈ ' : ''}
            {t.nm} Nm
          </span>
          <span className="text-base font-bold text-white">
            {t.ftlbConverted ? '≈ ' : ''}
            {t.ftlb} ft-lb
          </span>
        </div>
        <p className="mt-1 break-all text-xs text-slate-400">
          Source:{' '}
          {src.href ? (
            <a
              href={src.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300"
            >
              {src.text}
            </a>
          ) : (
            src.text
          )}
        </p>
      </div>
      <OverflowMenu
        label={`Actions for ${spec.make} ${spec.model} ${spec.job}`}
        disabled={busy}
        items={[
          { label: 'Edit', onSelect: onEdit },
          { label: busy ? 'Deleting…' : 'Delete', danger: true, onSelect: onDelete },
        ]}
      />
    </div>
  )
}

function TorqueFormFields({
  values,
  onChange,
  makes,
  jobs,
}: {
  values: FormValues
  onChange: (v: FormValues) => void
  makes: string[]
  jobs: string[]
}) {
  const set = (key: keyof FormValues, value: string) => onChange({ ...values, [key]: value })
  const num = (key: keyof FormValues, label: string, placeholder?: string) => (
    <Field label={label}>
      <input
        type="number"
        inputMode={key === 'yearFrom' || key === 'yearTo' ? 'numeric' : 'decimal'}
        min="0"
        step="any"
        value={values[key]}
        onChange={(e) => set(key, e.target.value)}
        className={inputClassName}
        placeholder={placeholder}
      />
    </Field>
  )
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
      <Field label="Make">
        <input
          required
          list="torque-makes"
          value={values.make}
          onChange={(e) => set('make', e.target.value)}
          className={inputClassName}
          placeholder="e.g. BMW"
        />
      </Field>
      <Field label="Model">
        <input
          required
          value={values.model}
          onChange={(e) => set('model', e.target.value)}
          className={inputClassName}
          placeholder="e.g. 3 Series"
        />
      </Field>
      {num('yearFrom', 'Year from', '2012')}
      {num('yearTo', 'Year to (blank = present)')}
      <div className="sm:col-span-2 md:col-span-4">
        <Field label="Job / fastener">
          <input
            required
            list="torque-jobs"
            value={values.job}
            onChange={(e) => set('job', e.target.value)}
            className={inputClassName}
            placeholder="e.g. Oil drain plug"
          />
        </Field>
      </div>
      {num('nm', 'Nm')}
      {num('nmMax', 'Nm (max, if a range)')}
      {num('ftlb', 'ft-lb')}
      {num('ftlbMax', 'ft-lb (max, if a range)')}
      <div className="sm:col-span-2 md:col-span-4">
        <Field label="Source">
          <input
            required
            value={values.source}
            onChange={(e) => set('source', e.target.value)}
            className={inputClassName}
            placeholder="Owner's manual p. 212, or a link to the published chart"
          />
        </Field>
      </div>
      <datalist id="torque-makes">
        {makes.map((m) => (
          <option key={m} value={m} />
        ))}
      </datalist>
      <datalist id="torque-jobs">
        {jobs.map((j) => (
          <option key={j} value={j} />
        ))}
      </datalist>
    </div>
  )
}
