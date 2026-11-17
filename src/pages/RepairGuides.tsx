import { useEffect, useMemo, useState, type FormEvent } from 'react'
import {
  createRepairGuide,
  deleteRepairGuide,
  fetchRepairGuides,
  filterRepairGuides,
  updateRepairGuide,
  type RepairGuideInput,
} from '../lib/data'
import type { RepairGuide, RepairGuideCategory } from '../lib/types'
import {
  REPAIR_GUIDE_CATEGORIES,
  REPAIR_GUIDE_CATEGORY_LABELS,
  REPAIR_GUIDE_CATEGORY_TABS,
} from '../lib/types'
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

interface FormValues {
  title: string
  category: RepairGuideCategory
  content: string
  make: string
  model: string
  yearFrom: string
  yearTo: string
}

function emptyForm(category: RepairGuideCategory): FormValues {
  return { title: '', category, content: '', make: '', model: '', yearFrom: '', yearTo: '' }
}

function formFromGuide(g: RepairGuide): FormValues {
  return {
    title: g.title,
    category: g.category,
    content: g.content,
    make: g.vehicle_make ?? '',
    model: g.vehicle_model ?? '',
    yearFrom: g.year_from === null ? '' : String(g.year_from),
    yearTo: g.year_to === null ? '' : String(g.year_to),
  }
}

/** '' = not set; anything else is passed on as a number (NaN is refused by validation). */
function parseYear(value: string): number | null {
  const trimmed = value.trim()
  return trimmed === '' ? null : Number(trimmed)
}

function toInput(values: FormValues): RepairGuideInput {
  return {
    title: values.title,
    category: values.category,
    content: values.content,
    vehicle_make: values.make,
    vehicle_model: values.model,
    year_from: parseYear(values.yearFrom),
    year_to: parseYear(values.yearTo),
  }
}

function yearRange(g: RepairGuide): string {
  if (g.year_from !== null && g.year_to !== null) {
    return g.year_from === g.year_to ? String(g.year_from) : `${g.year_from}–${g.year_to}`
  }
  if (g.year_from !== null) return `${g.year_from} and later`
  if (g.year_to !== null) return `up to ${g.year_to}`
  return ''
}

/** "Toyota Camry · 2018–2022", or "All vehicles" when no make/model/years are set. */
function appliesTo(g: RepairGuide): string {
  const vehicle = [g.vehicle_make, g.vehicle_model].filter(Boolean).join(' ')
  const years = yearRange(g)
  if (!vehicle && !years) return 'All vehicles'
  if (!vehicle) return `All makes · ${years}`
  return years ? `${vehicle} · ${years}` : vehicle
}

function snippet(text: string, max = 160): string {
  const flat = text.replace(/\s+/g, ' ').trim()
  return flat.length > max ? `${flat.slice(0, max)}…` : flat
}

export function RepairGuides() {
  const [guides, setGuides] = useState<RepairGuide[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [tab, setTab] = useState<RepairGuideCategory>('procedure')
  const [search, setSearch] = useState('')
  const [make, setMake] = useState('')
  const [model, setModel] = useState('')

  const [selectedId, setSelectedId] = useState<string | null>(null)
  /** null = no form open; 'new' = creating; otherwise the id being edited. */
  const [formMode, setFormMode] = useState<'new' | string | null>(null)
  const [form, setForm] = useState<FormValues>(emptyForm('procedure'))
  const [formError, setFormError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetchRepairGuides()
      .then((list) => {
        if (!cancelled) setGuides(list)
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : String(err))
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const matching = useMemo(
    () => filterRepairGuides(guides, { search, make, model }),
    [guides, search, make, model],
  )
  const tabCounts = useMemo(() => {
    const counts: Record<RepairGuideCategory, number> = { procedure: 0, spec: 0, wiring: 0, bulletin: 0 }
    for (const g of matching) counts[g.category]++
    return counts
  }, [matching])
  const visible = useMemo(() => matching.filter((g) => g.category === tab), [matching, tab])
  const selected = guides.find((g) => g.id === selectedId) ?? null
  const filtering = search.trim() !== '' || make.trim() !== ''

  async function reload() {
    try {
      setGuides(await fetchRepairGuides())
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    }
  }

  function openNew() {
    setForm(emptyForm(tab))
    setFormError(null)
    setFormMode('new')
    setSelectedId(null)
  }

  function openEdit(g: RepairGuide) {
    setForm(formFromGuide(g))
    setFormError(null)
    setFormMode(g.id)
  }

  function closeForm() {
    setFormMode(null)
    setFormError(null)
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault()
    setFormError(null)
    setSaving(true)
    try {
      const saved =
        formMode === 'new'
          ? await createRepairGuide(toInput(form))
          : await updateRepairGuide(formMode as string, toInput(form))
      await reload()
      setFormMode(null)
      setTab(saved.category)
      setSelectedId(saved.id)
    } catch (err) {
      setFormError(err instanceof Error ? err.message : String(err))
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    setDeleting(true)
    setError(null)
    try {
      await deleteRepairGuide(id)
      setSelectedId(null)
      setConfirmDelete(false)
      await reload()
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setDeleting(false)
    }
  }

  const set = (key: keyof FormValues) => (value: string) => setForm((f) => ({ ...f, [key]: value }))

  if (loading) return <LoadingState message="Loading repair guides…" />

  // ---------- Create / edit form ----------
  if (formMode !== null) {
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        <h2 className="text-2xl font-bold text-white">
          {formMode === 'new' ? 'New repair guide' : 'Edit repair guide'}
        </h2>
        <Card>
          <form onSubmit={(e) => void handleSave(e)} className="space-y-4" noValidate>
            <div className="grid gap-4 sm:grid-cols-[1fr_12rem]">
              <Field label="Title *">
                <input
                  className={inputClassName}
                  value={form.title}
                  onChange={(e) => set('title')(e.target.value)}
                  placeholder="e.g. Front brake pad replacement"
                />
              </Field>
              <Field label="Category *">
                <select
                  className={inputClassName}
                  value={form.category}
                  onChange={(e) => set('category')(e.target.value)}
                >
                  {REPAIR_GUIDE_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {REPAIR_GUIDE_CATEGORY_LABELS[c]}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <div>
              <p className="mb-2 text-xs text-slate-400">
                Applies to — leave make and model empty for a guide that applies to every vehicle.
              </p>
              <div className="grid gap-4 sm:grid-cols-4">
                <Field label="Make">
                  <input
                    className={inputClassName}
                    value={form.make}
                    onChange={(e) => set('make')(e.target.value)}
                    placeholder="e.g. Toyota"
                  />
                </Field>
                <Field label="Model">
                  <input
                    className={inputClassName}
                    value={form.model}
                    onChange={(e) => set('model')(e.target.value)}
                    placeholder="e.g. Camry"
                  />
                </Field>
                <Field label="Year from">
                  <input
                    className={inputClassName}
                    inputMode="numeric"
                    value={form.yearFrom}
                    onChange={(e) => set('yearFrom')(e.target.value)}
                    placeholder="e.g. 2018"
                  />
                </Field>
                <Field label="Year to">
                  <input
                    className={inputClassName}
                    inputMode="numeric"
                    value={form.yearTo}
                    onChange={(e) => set('yearTo')(e.target.value)}
                    placeholder="e.g. 2022"
                  />
                </Field>
              </div>
            </div>

            <Field label="Content *">
              <textarea
                className={`${inputClassName} min-h-[16rem] font-mono`}
                value={form.content}
                onChange={(e) => set('content')(e.target.value)}
                placeholder="Steps, torque values, wire colours, bulletin text…"
              />
            </Field>

            <ErrorBanner message={formError} />

            <div className="flex gap-2">
              <PrimaryButton type="submit" disabled={saving}>
                {saving ? 'Saving…' : formMode === 'new' ? 'Save guide' : 'Save changes'}
              </PrimaryButton>
              <SecondaryButton onClick={closeForm} disabled={saving}>
                Cancel
              </SecondaryButton>
            </div>
          </form>
        </Card>
      </div>
    )
  }

  // ---------- Detail view ----------
  if (selected) {
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        <button
          onClick={() => {
            setSelectedId(null)
            setConfirmDelete(false)
          }}
          className="text-sm text-blue-400 hover:underline"
        >
          ← Back to {REPAIR_GUIDE_CATEGORY_TABS[selected.category]}
        </button>
        <ErrorBanner message={error} />
        <Card className="space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <span className="inline-block rounded border border-blue-500/30 bg-blue-500/10 px-2 py-0.5 text-xs font-bold text-blue-400">
                {REPAIR_GUIDE_CATEGORY_LABELS[selected.category]}
              </span>
              <h2 className="mt-2 break-words text-2xl font-bold text-white">{selected.title}</h2>
              <p className="mt-1 text-sm text-slate-400">Applies to: {appliesTo(selected)}</p>
            </div>
            <div className="flex gap-2">
              <SecondaryButton onClick={() => openEdit(selected)}>Edit</SecondaryButton>
              {!confirmDelete && (
                <SecondaryButton onClick={() => setConfirmDelete(true)}>Delete</SecondaryButton>
              )}
            </div>
          </div>

          {confirmDelete && (
            <div className="flex flex-wrap items-center gap-3 rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-200">
              <span>Delete “{selected.title}”? Only this guide is deleted. This cannot be undone.</span>
              <button
                onClick={() => void handleDelete(selected.id)}
                disabled={deleting}
                className="rounded-lg bg-rose-600 px-3 py-1.5 font-semibold text-white hover:bg-rose-500 disabled:opacity-50"
              >
                {deleting ? 'Deleting…' : 'Yes, delete'}
              </button>
              <SecondaryButton onClick={() => setConfirmDelete(false)} disabled={deleting}>
                Cancel
              </SecondaryButton>
            </div>
          )}

          <div className="whitespace-pre-wrap break-words rounded-lg bg-slate-950/60 p-4 font-mono text-sm leading-relaxed text-slate-200">
            {selected.content}
          </div>
          <p className="text-xs text-slate-500">
            Last updated {new Date(selected.updated_at).toLocaleString()}
          </p>
        </Card>
      </div>
    )
  }

  // ---------- Library ----------
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-white">Repair Guides</h2>
          <p className="text-sm text-slate-400">The shop's own procedures, specs, wiring notes and bulletins.</p>
        </div>
        <PrimaryButton onClick={openNew}>New guide</PrimaryButton>
      </div>

      <ErrorBanner message={error} />

      <Card className="grid gap-3 sm:grid-cols-[2fr_1fr_1fr]">
        <Field label="Search title and content">
          <input
            className={inputClassName}
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="e.g. torque"
          />
        </Field>
        <Field label="Vehicle make">
          <input
            className={inputClassName}
            value={make}
            onChange={(e) => setMake(e.target.value)}
            placeholder="Any make"
          />
        </Field>
        <Field label="Vehicle model">
          <input
            className={`${inputClassName} disabled:opacity-50`}
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder={make.trim() ? 'Any model' : 'Type a make first'}
            disabled={!make.trim()}
          />
        </Field>
        {make.trim() !== '' && (
          <p className="text-xs text-slate-400 sm:col-span-3">
            Showing guides for this vehicle plus guides that apply to all vehicles.
          </p>
        )}
      </Card>

      <div className="flex gap-1 overflow-x-auto border-b border-slate-800">
        {REPAIR_GUIDE_CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setTab(c)}
            className={`shrink-0 border-b-2 px-4 py-2 text-sm font-semibold transition ${
              tab === c
                ? 'border-blue-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {REPAIR_GUIDE_CATEGORY_TABS[c]}
            <span className="ml-1.5 text-xs text-slate-500">{tabCounts[c]}</span>
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <EmptyState
          message={
            filtering
              ? `No ${REPAIR_GUIDE_CATEGORY_TABS[tab].toLowerCase()} match this search.`
              : `No ${REPAIR_GUIDE_CATEGORY_TABS[tab].toLowerCase()} yet. Use “New guide” to add one.`
          }
        />
      ) : (
        <ul className="space-y-2">
          {visible.map((g) => (
            <li key={g.id}>
              <button
                onClick={() => setSelectedId(g.id)}
                className="block w-full rounded-xl border border-slate-800 bg-slate-900 p-4 text-left transition hover:border-slate-600"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="font-semibold text-white">{g.title}</span>
                  <span className="text-xs text-slate-400">{appliesTo(g)}</span>
                </div>
                <p className="mt-1 text-sm text-slate-400">{snippet(g.content)}</p>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
