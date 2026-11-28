import { useEffect, useMemo, useState, type FormEvent } from 'react'
import {
  createRepairGuide,
  createRepairGuideLink,
  deleteRepairGuide,
  deleteRepairGuideLink,
  fetchRepairGuideLinks,
  fetchRepairGuides,
  filterRepairGuides,
  parseFilterYear,
  updateRepairGuide,
  updateRepairGuideLink,
  type RepairGuideInput,
  type RepairGuideLinkInput,
} from '../lib/data'
import type { RepairGuide, RepairGuideCategory, RepairGuideLink, RepairGuideLinkKind } from '../lib/types'
import {
  REPAIR_GUIDE_CATEGORIES,
  REPAIR_GUIDE_CATEGORY_LABELS,
  REPAIR_GUIDE_LINK_KINDS,
  REPAIR_GUIDE_LINK_KIND_LABELS,
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
import { useDeleteWarning } from '../components/DeleteWarning'
import { simpleWarning } from '../lib/deleteWarnings'
import { OverflowMenu } from '../components/OverflowMenu'

// ---------- one library: shop guides + external links ----------

/** The kind filter: the shop's own guides, or one kind of external link. */
type KindFilter = '' | 'guide' | RepairGuideLinkKind

const KIND_FILTER_LABELS: Record<Exclude<KindFilter, ''>, string> = {
  guide: 'Shop guide',
  ...REPAIR_GUIDE_LINK_KIND_LABELS,
}

/** Badge colours from the themed palettes (prompt 15 tokens), so both themes work. */
const KIND_BADGE: Record<Exclude<KindFilter, ''>, string> = {
  guide: 'border-blue-500/30 bg-blue-500/10 text-blue-400',
  manual: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
  diagram: 'border-teal-500/30 bg-teal-500/10 text-teal-400',
  bulletin: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
  video: 'border-rose-500/30 bg-rose-500/10 text-rose-400',
  forum: 'border-violet-500/30 bg-violet-500/10 text-violet-400',
}

type Entry =
  | { type: 'guide'; key: string; guide: RepairGuide }
  | { type: 'link'; key: string; link: RepairGuideLink }

function KindBadge({ kind, extra }: { kind: Exclude<KindFilter, ''>; extra?: string }) {
  return (
    <span
      className={`inline-block shrink-0 rounded border px-2 py-0.5 text-xs font-bold ${KIND_BADGE[kind]}`}
    >
      {KIND_FILTER_LABELS[kind]}
      {extra ? ` · ${extra}` : ''}
    </span>
  )
}

function yearText(from: number | null, to: number | null, openEnded: 'present' | 'later'): string {
  if (from !== null && to !== null) return from === to ? String(from) : `${from}–${to}`
  if (from !== null) return openEnded === 'present' ? `${from}–present` : `${from} and later`
  if (to !== null) return `up to ${to}`
  return ''
}

/** "Toyota Camry · 2018–2022", or "All vehicles" when no make/model/years are set. */
function guideAppliesTo(g: RepairGuide): string {
  const vehicle = [g.vehicle_make, g.vehicle_model].filter(Boolean).join(' ')
  const years = yearText(g.year_from, g.year_to, 'later')
  if (!vehicle && !years) return 'All vehicles'
  if (!vehicle) return `All makes · ${years}`
  return years ? `${vehicle} · ${years}` : vehicle
}

function linkAppliesTo(l: RepairGuideLink): string {
  const years = yearText(l.year_from, l.year_to, 'present')
  const vehicle = `${l.vehicle_make} ${l.vehicle_model}`
  return years ? `${vehicle} · ${years}` : vehicle
}

function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

function snippet(text: string, max = 140): string {
  const flat = text.replace(/\s+/g, ' ').trim()
  return flat.length > max ? `${flat.slice(0, max)}…` : flat
}

function norm(s: string | null | undefined): string {
  return (s ?? '').trim().toLowerCase()
}

/** Links match the vehicle filter the same way guides do (exact make/model, year inside the range). */
function linkMatches(l: RepairGuideLink, search: string, make: string, model: string, year: number | null): boolean {
  if (make && norm(l.vehicle_make) !== make) return false
  if (make && model && norm(l.vehicle_model) !== model) return false
  if (year !== null) {
    if (l.year_from !== null && year < l.year_from) return false
    if (l.year_to !== null && year > l.year_to) return false
  }
  if (search) {
    const hay = `${l.title} ${l.source} ${l.vehicle_make} ${l.vehicle_model} ${REPAIR_GUIDE_LINK_KIND_LABELS[l.kind]}`
    if (!hay.toLowerCase().includes(search)) return false
  }
  return true
}

/** Guide search also covers its vehicle text, so "F-150 brakes" style searches find it. */
function guideMatchesSearch(g: RepairGuide, search: string): boolean {
  if (!search) return true
  const hay = `${g.title} ${g.content} ${g.vehicle_make ?? ''} ${g.vehicle_model ?? ''}`
  return hay.toLowerCase().includes(search)
}

// ---------- forms ----------

interface GuideFormValues {
  title: string
  category: RepairGuideCategory
  content: string
  make: string
  model: string
  yearFrom: string
  yearTo: string
}

const EMPTY_GUIDE: GuideFormValues = {
  title: '',
  category: 'procedure',
  content: '',
  make: '',
  model: '',
  yearFrom: '',
  yearTo: '',
}

function guideToForm(g: RepairGuide): GuideFormValues {
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

function guideFormToInput(v: GuideFormValues): RepairGuideInput {
  return {
    title: v.title,
    category: v.category,
    content: v.content,
    vehicle_make: v.make,
    vehicle_model: v.model,
    year_from: parseYear(v.yearFrom),
    year_to: parseYear(v.yearTo),
  }
}

interface LinkFormValues {
  make: string
  model: string
  yearFrom: string
  yearTo: string
  kind: RepairGuideLinkKind
  title: string
  url: string
  source: string
}

const EMPTY_LINK: LinkFormValues = {
  make: '',
  model: '',
  yearFrom: '',
  yearTo: '',
  kind: 'video',
  title: '',
  url: '',
  source: '',
}

function linkToForm(l: RepairGuideLink): LinkFormValues {
  return {
    make: l.vehicle_make,
    model: l.vehicle_model,
    yearFrom: l.year_from === null ? '' : String(l.year_from),
    yearTo: l.year_to === null ? '' : String(l.year_to),
    kind: l.kind,
    title: l.title,
    url: l.url,
    source: l.source,
  }
}

function linkFormToInput(v: LinkFormValues): RepairGuideLinkInput {
  return {
    vehicle_make: v.make,
    vehicle_model: v.model,
    year_from: parseYear(v.yearFrom),
    year_to: parseYear(v.yearTo),
    kind: v.kind,
    title: v.title,
    url: v.url,
    source: v.source,
  }
}

function message(err: unknown): string {
  return err instanceof Error ? err.message : String(err)
}

type FormMode =
  | null
  | { type: 'guide'; id: string | null }
  | { type: 'link'; id: string | null }

// ---------- page ----------

export function RepairGuides() {
  const [guides, setGuides] = useState<RepairGuide[]>([])
  const [links, setLinks] = useState<RepairGuideLink[]>([])
  const deleteWarning = useDeleteWarning()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [search, setSearch] = useState('')
  const [kind, setKind] = useState<KindFilter>('')
  const [make, setMake] = useState('')
  const [model, setModel] = useState('')
  const [yearInput, setYearInput] = useState('')

  const [selectedGuideId, setSelectedGuideId] = useState<string | null>(null)
  const [formMode, setFormMode] = useState<FormMode>(null)
  const [guideForm, setGuideForm] = useState<GuideFormValues>(EMPTY_GUIDE)
  const [linkForm, setLinkForm] = useState<LinkFormValues>(EMPTY_LINK)
  const [formError, setFormError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let cancelled = false
    // Each half loads on its own: if the links table is not there yet, the shop's guides still show.
    Promise.allSettled([fetchRepairGuides(), fetchRepairGuideLinks()])
      .then(([g, l]) => {
        if (cancelled) return
        if (g.status === 'fulfilled') setGuides(g.value)
        if (l.status === 'fulfilled') setLinks(l.value)
        const failed = [g, l].filter((r): r is PromiseRejectedResult => r.status === 'rejected')
        if (failed.length > 0) setError(failed.map((r) => message(r.reason)).join(' · '))
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  async function reload() {
    const [g, l] = await Promise.allSettled([fetchRepairGuides(), fetchRepairGuideLinks()])
    if (g.status === 'fulfilled') setGuides(g.value)
    if (l.status === 'fulfilled') setLinks(l.value)
    const failed = [g, l].filter((r): r is PromiseRejectedResult => r.status === 'rejected')
    setError(failed.length > 0 ? failed.map((r) => message(r.reason)).join(' · ') : null)
  }

  // Vehicle filter choices: every make/model that appears on a guide or a link.
  const makes = useMemo(() => {
    const all = new Map<string, string>()
    for (const g of guides) if (g.vehicle_make) all.set(norm(g.vehicle_make), g.vehicle_make.trim())
    for (const l of links) all.set(norm(l.vehicle_make), l.vehicle_make.trim())
    return [...all.values()].sort((a, b) => a.localeCompare(b))
  }, [guides, links])
  const models = useMemo(() => {
    if (!make) return []
    const m = norm(make)
    const all = new Map<string, string>()
    for (const g of guides) {
      if (norm(g.vehicle_make) === m && g.vehicle_model) all.set(norm(g.vehicle_model), g.vehicle_model.trim())
    }
    for (const l of links) if (norm(l.vehicle_make) === m) all.set(norm(l.vehicle_model), l.vehicle_model.trim())
    return [...all.values()].sort((a, b) => a.localeCompare(b))
  }, [guides, links, make])

  const year = parseFilterYear(yearInput)
  const yearIncomplete = yearInput.trim() !== '' && year === null
  const q = search.trim().toLowerCase()
  const filtering = q !== '' || kind !== '' || make !== '' || year !== null

  const entries = useMemo<Entry[]>(() => {
    const out: Entry[] = []
    if (kind === '' || kind === 'guide') {
      // The shop's own guides first — same vehicle rules as before (no make = applies to all).
      for (const g of filterRepairGuides(guides, { make, model, year })) {
        if (guideMatchesSearch(g, q)) out.push({ type: 'guide', key: `g-${g.id}`, guide: g })
      }
    }
    if (kind !== 'guide') {
      for (const l of links) {
        if (kind !== '' && l.kind !== kind) continue
        if (linkMatches(l, q, norm(make), norm(model), year)) out.push({ type: 'link', key: `l-${l.id}`, link: l })
      }
    }
    return out
  }, [guides, links, kind, make, model, year, q])

  const selectedGuide = guides.find((g) => g.id === selectedGuideId) ?? null

  // ---------- actions ----------

  function openNewGuide() {
    setGuideForm({ ...EMPTY_GUIDE, make, model })
    setFormError(null)
    setSelectedGuideId(null)
    setFormMode({ type: 'guide', id: null })
  }

  function openNewLink() {
    setLinkForm({ ...EMPTY_LINK, make, model, kind: kind && kind !== 'guide' ? kind : 'video' })
    setFormError(null)
    setSelectedGuideId(null)
    setFormMode({ type: 'link', id: null })
  }

  function openEditGuide(g: RepairGuide) {
    setGuideForm(guideToForm(g))
    setFormError(null)
    setFormMode({ type: 'guide', id: g.id })
  }

  function openEditLink(l: RepairGuideLink) {
    setLinkForm(linkToForm(l))
    setFormError(null)
    setFormMode({ type: 'link', id: l.id })
  }

  function closeForm() {
    setFormMode(null)
    setFormError(null)
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault()
    if (!formMode) return
    setFormError(null)
    setSaving(true)
    try {
      if (formMode.type === 'guide') {
        const saved = formMode.id
          ? await updateRepairGuide(formMode.id, guideFormToInput(guideForm))
          : await createRepairGuide(guideFormToInput(guideForm))
        await reload()
        setFormMode(null)
        setSelectedGuideId(saved.id)
      } else {
        if (formMode.id) await updateRepairGuideLink(formMode.id, linkFormToInput(linkForm))
        else await createRepairGuideLink(linkFormToInput(linkForm))
        await reload()
        setFormMode(null)
      }
    } catch (err) {
      setFormError(message(err))
    } finally {
      setSaving(false)
    }
  }

  function handleDeleteGuide(guide: RepairGuide) {
    deleteWarning.ask({
      title: `Delete "${guide.title}"?`,
      load: simpleWarning(`The repair guide "${guide.title}" (only this guide)`),
      run: () => deleteRepairGuide(guide.id),
      onDeleted: async () => {
        setSelectedGuideId(null)
        await reload()
      },
    })
  }

  function handleDeleteLink(link: RepairGuideLink) {
    deleteWarning.ask({
      title: `Delete this link?`,
      load: simpleWarning(
        `The link "${link.title}" (${REPAIR_GUIDE_LINK_KIND_LABELS[link.kind].toLowerCase()}, ${linkAppliesTo(link)}) — only this link; the page it points to is not affected`,
      ),
      run: () => deleteRepairGuideLink(link.id),
      onDeleted: reload,
    })
  }

  if (loading) return <LoadingState message="Loading repair guides…" />

  // ---------- create / edit forms ----------
  if (formMode?.type === 'guide') {
    const setG = (key: keyof GuideFormValues) => (value: string) => setGuideForm((f) => ({ ...f, [key]: value }))
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        <h2 className="text-2xl font-bold text-white">{formMode.id ? 'Edit shop guide' : 'New shop guide'}</h2>
        <Card>
          <form onSubmit={(e) => void handleSave(e)} className="space-y-4" noValidate>
            <div className="grid gap-4 sm:grid-cols-[1fr_12rem]">
              <Field label="Title *">
                <input
                  className={inputClassName}
                  value={guideForm.title}
                  onChange={(e) => setG('title')(e.target.value)}
                  placeholder="e.g. Front brake pad replacement"
                />
              </Field>
              <Field label="Category *">
                <select
                  className={inputClassName}
                  value={guideForm.category}
                  onChange={(e) => setG('category')(e.target.value)}
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
              <VehicleFields
                make={guideForm.make}
                model={guideForm.model}
                yearFrom={guideForm.yearFrom}
                yearTo={guideForm.yearTo}
                onChange={(k, v) => setG(k)(v)}
                makes={makes}
              />
            </div>
            <Field label="Content *">
              <textarea
                className={`${inputClassName} min-h-[16rem] font-mono`}
                value={guideForm.content}
                onChange={(e) => setG('content')(e.target.value)}
                placeholder="Steps, torque values, wire colours, bulletin text — in the shop's own words."
              />
            </Field>
            <ErrorBanner message={formError} />
            <div className="flex gap-2">
              <PrimaryButton type="submit" disabled={saving}>
                {saving ? 'Saving…' : formMode.id ? 'Save changes' : 'Save guide'}
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

  if (formMode?.type === 'link') {
    const setL = (key: keyof LinkFormValues) => (value: string) => setLinkForm((f) => ({ ...f, [key]: value }))
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        <h2 className="text-2xl font-bold text-white">{formMode.id ? 'Edit link' : 'Add a link'}</h2>
        <p className="text-sm text-slate-400">
          Link to a real public page about the vehicle — an owner&rsquo;s manual, parts diagram, recall, video or
          forum. Only the link is saved; never paste text copied from the page.
        </p>
        <Card>
          <form onSubmit={(e) => void handleSave(e)} className="space-y-4" noValidate>
            <VehicleFields
              make={linkForm.make}
              model={linkForm.model}
              yearFrom={linkForm.yearFrom}
              yearTo={linkForm.yearTo}
              onChange={(k, v) => setL(k)(v)}
              makes={makes}
              required
            />
            <div className="grid gap-4 sm:grid-cols-[12rem_1fr]">
              <Field label="Kind *">
                <select className={inputClassName} value={linkForm.kind} onChange={(e) => setL('kind')(e.target.value)}>
                  {REPAIR_GUIDE_LINK_KINDS.map((k) => (
                    <option key={k} value={k}>
                      {REPAIR_GUIDE_LINK_KIND_LABELS[k]}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Title *">
                <input
                  className={inputClassName}
                  value={linkForm.title}
                  onChange={(e) => setL('title')(e.target.value)}
                  placeholder="The page's own title"
                />
              </Field>
            </div>
            <Field label="Link (URL) *">
              <input
                className={inputClassName}
                type="url"
                inputMode="url"
                value={linkForm.url}
                onChange={(e) => setL('url')(e.target.value)}
                placeholder="https://…"
              />
            </Field>
            <Field label="Source site *">
              <input
                className={inputClassName}
                value={linkForm.source}
                onChange={(e) => setL('source')(e.target.value)}
                placeholder={linkForm.url ? hostOf(linkForm.url) : 'e.g. NHTSA (nhtsa.gov)'}
              />
            </Field>
            <ErrorBanner message={formError} />
            <div className="flex gap-2">
              <PrimaryButton type="submit" disabled={saving}>
                {saving ? 'Saving…' : formMode.id ? 'Save changes' : 'Save link'}
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

  // ---------- shop guide detail ----------
  if (selectedGuide) {
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        <button
          onClick={() => setSelectedGuideId(null)}
          className="min-h-[44px] text-sm text-blue-400 hover:underline"
        >
          ← Back to the library
        </button>
        <ErrorBanner message={error} />
        {deleteWarning.dialog}
        <Card className="space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <KindBadge kind="guide" extra={REPAIR_GUIDE_CATEGORY_LABELS[selectedGuide.category]} />
              <h2 className="mt-2 break-words text-2xl font-bold text-white">{selectedGuide.title}</h2>
              <p className="mt-1 text-sm text-slate-400">Applies to: {guideAppliesTo(selectedGuide)}</p>
              <p className="text-xs text-slate-400">Source: the shop&rsquo;s own guide</p>
            </div>
            <OverflowMenu
              label={`Actions for ${selectedGuide.title}`}
              items={[
                { label: 'Edit', onSelect: () => openEditGuide(selectedGuide) },
                { label: 'Delete', danger: true, onSelect: () => handleDeleteGuide(selectedGuide) },
              ]}
            />
          </div>
          <div className="whitespace-pre-wrap break-words rounded-lg bg-slate-950/60 p-4 font-mono text-sm leading-relaxed text-slate-200">
            {selectedGuide.content}
          </div>
          <p className="text-xs text-slate-400">Last updated {new Date(selectedGuide.updated_at).toLocaleString()}</p>
        </Card>
      </div>
    )
  }

  // ---------- library ----------
  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-2xl font-bold text-white">Repair Guides</h2>
          <p className="text-sm text-slate-400">
            The shop&rsquo;s own guides, plus links to manuals, diagrams, recalls, videos and forums.
          </p>
        </div>
        <OverflowMenu
          label="Add to the library"
          buttonLabel="Add"
          items={[
            { label: 'New shop guide', onSelect: openNewGuide },
            { label: 'Add a link', onSelect: openNewLink },
          ]}
        />
      </div>

      <ErrorBanner message={error} />
      {deleteWarning.dialog}

      <Card className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_7rem]">
        <div className="sm:col-span-2 lg:col-span-1">
          <Field label="Search vehicle, job or title">
            <input
              className={inputClassName}
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="e.g. brake pads, F-150, oil change"
            />
          </Field>
        </div>
        <Field label="Kind">
          <select className={inputClassName} value={kind} onChange={(e) => setKind(e.target.value as KindFilter)}>
            <option value="">Everything</option>
            {(Object.keys(KIND_FILTER_LABELS) as Exclude<KindFilter, ''>[]).map((k) => (
              <option key={k} value={k}>
                {KIND_FILTER_LABELS[k]}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Make">
          <select
            className={inputClassName}
            value={make}
            onChange={(e) => {
              setMake(e.target.value)
              setModel('')
            }}
          >
            <option value="">Any make</option>
            {makes.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Model">
          <select
            className={`${inputClassName} disabled:opacity-50`}
            value={model}
            onChange={(e) => setModel(e.target.value)}
            disabled={!make}
          >
            <option value="">{make ? 'Any model' : 'Pick a make first'}</option>
            {models.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Year">
          <input
            className={inputClassName}
            inputMode="numeric"
            maxLength={4}
            value={yearInput}
            onChange={(e) => setYearInput(e.target.value)}
            placeholder="Any"
          />
        </Field>
        <p className="text-xs text-slate-400 sm:col-span-2 lg:col-span-5">
          {yearIncomplete
            ? 'Enter a 4-digit year (e.g. 2018) to filter by year.'
            : `${entries.length} of ${guides.length + links.length} entries`}
          {!yearIncomplete && make ? ' · shop guides with no vehicle set apply to every vehicle' : ''}
        </p>
      </Card>

      {entries.length === 0 ? (
        <EmptyState
          message={
            filtering
              ? 'Nothing in the library for this search. An empty result is honest — add a guide or a real link if you find one.'
              : 'The library is empty. Use Add to write a shop guide or save a link.'
          }
        />
      ) : (
        <ul className="space-y-2">
          {entries.map((e) =>
            e.type === 'guide' ? (
              <li key={e.key}>
                <GuideCard guide={e.guide} onOpen={() => setSelectedGuideId(e.guide.id)} />
              </li>
            ) : (
              <li key={e.key}>
                <LinkCard
                  link={e.link}
                  onEdit={() => openEditLink(e.link)}
                  onDelete={() => handleDeleteLink(e.link)}
                />
              </li>
            ),
          )}
        </ul>
      )}
    </div>
  )
}

// ---------- cards (one visible action each; links add a ⋯ menu) ----------

function GuideCard({ guide, onOpen }: { guide: RepairGuide; onOpen: () => void }) {
  return (
    <button
      onClick={onOpen}
      className="block min-h-[44px] w-full rounded-xl border border-slate-800 bg-slate-900 p-4 text-left transition hover:border-slate-600"
    >
      <div className="flex flex-wrap items-center gap-2">
        <KindBadge kind="guide" extra={REPAIR_GUIDE_CATEGORY_LABELS[guide.category]} />
        <span className="text-xs text-slate-400">{guideAppliesTo(guide)}</span>
      </div>
      <p className="mt-1.5 break-words font-semibold text-white">{guide.title}</p>
      <p className="mt-1 text-sm text-slate-400">{snippet(guide.content)}</p>
      <p className="mt-1 text-xs text-slate-400">Source: the shop&rsquo;s own guide</p>
    </button>
  )
}

function LinkCard({
  link,
  onEdit,
  onDelete,
}: {
  link: RepairGuideLink
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <div className="flex items-start gap-2 rounded-xl border border-slate-800 bg-slate-900 p-2 transition hover:border-slate-600">
      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block min-h-[44px] min-w-0 flex-1 rounded-lg p-2"
        aria-label={`${link.title} — opens ${hostOf(link.url)} in a new tab`}
      >
        <div className="flex flex-wrap items-center gap-2">
          <KindBadge kind={link.kind} />
          <span className="text-xs text-slate-400">{linkAppliesTo(link)}</span>
        </div>
        <p className="mt-1.5 break-words font-semibold text-white">
          {link.title} <span aria-hidden="true" className="text-slate-400">↗</span>
        </p>
        <p className="mt-1 break-all text-xs text-slate-400">
          Source: {link.source} · {hostOf(link.url)}
        </p>
      </a>
      <OverflowMenu
        label={`Actions for ${link.title}`}
        items={[
          { label: 'Edit', onSelect: onEdit },
          { label: 'Delete', danger: true, onSelect: onDelete },
        ]}
      />
    </div>
  )
}

function VehicleFields({
  make,
  model,
  yearFrom,
  yearTo,
  onChange,
  makes,
  required = false,
}: {
  make: string
  model: string
  yearFrom: string
  yearTo: string
  onChange: (key: 'make' | 'model' | 'yearFrom' | 'yearTo', value: string) => void
  makes: string[]
  required?: boolean
}) {
  const star = required ? ' *' : ''
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <Field label={`Make${star}`}>
        <input
          className={inputClassName}
          list="guide-makes"
          value={make}
          onChange={(e) => onChange('make', e.target.value)}
          placeholder="e.g. BMW"
        />
      </Field>
      <Field label={`Model${star}`}>
        <input
          className={inputClassName}
          value={model}
          onChange={(e) => onChange('model', e.target.value)}
          placeholder="e.g. 3 Series"
        />
      </Field>
      <Field label="Year from">
        <input
          className={inputClassName}
          inputMode="numeric"
          value={yearFrom}
          onChange={(e) => onChange('yearFrom', e.target.value)}
          placeholder="e.g. 2012"
        />
      </Field>
      <Field label="Year to">
        <input
          className={inputClassName}
          inputMode="numeric"
          value={yearTo}
          onChange={(e) => onChange('yearTo', e.target.value)}
          placeholder={required ? 'blank = present' : 'e.g. 2019'}
        />
      </Field>
      <datalist id="guide-makes">
        {makes.map((m) => (
          <option key={m} value={m} />
        ))}
      </datalist>
    </div>
  )
}
