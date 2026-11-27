import { useEffect, useMemo, useState, type FormEvent } from 'react'
import {
  addTimelog,
  deleteTimelog,
  fetchRepairOrders,
  fetchTimelogs,
  stopTimelog,
  updateTimelog,
} from '../lib/data'
import { formatDuration, formatTimelogRange, fromDateTimeLocalValue, orderCustomerName, timelogMinutes } from '../lib/format'
import type { RepairOrder, Timelog } from '../lib/types'
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
import type { View } from '../components/Layout'

interface ManualEntryValues {
  repairOrderId: string
  startedAt: string
  endedAt: string
  note: string
}

const EMPTY_ENTRY: ManualEntryValues = { repairOrderId: '', startedAt: '', endedAt: '', note: '' }

/** Form-side check, same rule as the database: end required and after start. */
function entryTimeError(values: ManualEntryValues): string | null {
  if (values.startedAt === '' || values.endedAt === '') return null
  const start = fromDateTimeLocalValue(values.startedAt)
  const end = fromDateTimeLocalValue(values.endedAt)
  if (start === null) return 'The start time is not valid.'
  if (end === null) return 'The end time is not valid.'
  if (new Date(end).getTime() <= new Date(start).getTime()) {
    return 'The end time must be after the start time.'
  }
  return null
}

export function Timelogs({ onNavigate }: { onNavigate: (view: View) => void }) {
  const [timelogs, setTimelogs] = useState<Timelog[]>([])
  const deleteWarning = useDeleteWarning()
  const [orders, setOrders] = useState<RepairOrder[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<string | null>(null)

  const [showForm, setShowForm] = useState(false)
  const [entry, setEntry] = useState<ManualEntryValues>(EMPTY_ENTRY)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editNote, setEditNote] = useState('')

  async function load() {
    try {
      setTimelogs(await fetchTimelogs())
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    }
  }

  useEffect(() => {
    let cancelled = false
    async function loadOnce() {
      try {
        const [list, orderList] = await Promise.all([fetchTimelogs(), fetchRepairOrders()])
        if (cancelled) return
        setTimelogs(list)
        setOrders(orderList)
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : String(err))
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void loadOnce()
    return () => {
      cancelled = true
    }
  }, [])

  // Running first (newest first), then finished newest first.
  const { running, finished } = useMemo(() => {
    const byNewest = (a: Timelog, b: Timelog) =>
      new Date(b.started_at).getTime() - new Date(a.started_at).getTime()
    return {
      running: timelogs.filter((t) => t.ended_at === null).sort(byNewest),
      finished: timelogs.filter((t) => t.ended_at !== null).sort(byNewest),
    }
  }, [timelogs])

  /** Runs a change, then reloads the list. */
  async function run(id: string, action: () => Promise<unknown>): Promise<boolean> {
    setError(null)
    setBusyId(id)
    try {
      await action()
      await load()
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
      return false
    } finally {
      setBusyId(null)
    }
  }

  async function handleAdd(event: FormEvent) {
    event.preventDefault()
    if (entryTimeError(entry)) return
    const startedAt = fromDateTimeLocalValue(entry.startedAt)
    const endedAt = fromDateTimeLocalValue(entry.endedAt)
    if (!entry.repairOrderId || !startedAt || !endedAt) return
    const ok = await run('new', () =>
      addTimelog(entry.repairOrderId, startedAt, endedAt, entry.note),
    )
    if (ok) {
      setEntry(EMPTY_ENTRY)
      setShowForm(false)
    }
  }

  async function handleSaveNote(event: FormEvent) {
    event.preventDefault()
    if (!editingId) return
    const id = editingId
    const ok = await run(id, () => updateTimelog(id, { note: editNote }))
    if (ok) setEditingId(null)
  }

  function handleDelete(t: Timelog) {
    deleteWarning.ask({
      title: 'Delete this timelog entry?',
      load: simpleWarning(
        `Timelog ${formatTimelogRange(t.started_at, t.ended_at)}${t.repair_orders ? ` on ${t.repair_orders.ro_number}` : ''} (labour already added to a service stays on that service)`,
      ),
      run: () => deleteTimelog(t.id),
      onDeleted: load,
    })
  }

  if (loading) return <LoadingState message="Loading timelogs…" />

  const formError = entryTimeError(entry)
  const now = Date.now()

  function renderRow(t: Timelog) {
    const isRunning = t.ended_at === null
    const minutes = timelogMinutes(t.started_at, t.ended_at, now)
    return (
      <div
        key={t.id}
        className={`rounded-xl border bg-slate-900 p-4 ${
          isRunning ? 'border-emerald-500/40' : 'border-slate-800'
        }`}
      >
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              {t.repair_orders ? (
                <button
                  onClick={() => onNavigate({ name: 'repair-order', id: t.repair_order_id })}
                  className="font-semibold text-blue-400 hover:text-blue-300"
                >
                  {t.repair_orders.ro_number}
                </button>
              ) : (
                <span className="font-semibold text-slate-300">Order</span>
              )}
              <span className="text-slate-300">{t.repair_orders ? orderCustomerName(t.repair_orders) : ''}</span>
              {isRunning && (
                <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
                  Running
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-slate-200">
              {formatTimelogRange(t.started_at, t.ended_at)}
            </p>
          </div>
          <p className="text-sm font-bold text-white">
            {formatDuration(minutes)}
            {isRunning ? ' so far' : ''}
          </p>
        </div>

        {editingId === t.id ? (
          <form onSubmit={handleSaveNote} className="mt-3 flex flex-col gap-2">
            <textarea
              value={editNote}
              onChange={(e) => setEditNote(e.target.value)}
              className={inputClassName}
              rows={2}
              placeholder="Note"
            />
            <div className="flex gap-2">
              <PrimaryButton type="submit" disabled={busyId === t.id}>
                {busyId === t.id ? 'Saving…' : 'Save note'}
              </PrimaryButton>
              <SecondaryButton onClick={() => setEditingId(null)}>Cancel</SecondaryButton>
            </div>
          </form>
        ) : (
          <>
            {t.note && <p className="mt-1 whitespace-pre-wrap text-xs text-slate-400">{t.note}</p>}
            <div className="mt-3 flex flex-wrap gap-2">
              {isRunning ? (
                <PrimaryButton
                  onClick={() => void run(t.id, () => stopTimelog(t.id))}
                  disabled={busyId === t.id}
                >
                  {busyId === t.id ? 'Stopping…' : 'Stop'}
                </PrimaryButton>
              ) : (
                <OverflowMenu
                  label="Timelog actions"
                  disabled={busyId === t.id}
                  items={[
                    {
                      label: 'Edit note',
                      onSelect: () => {
                        setEditingId(t.id)
                        setEditNote(t.note ?? '')
                      },
                    },
                    { label: 'Delete', danger: true, onSelect: () => handleDelete(t) },
                  ]}
                />
              )}
            </div>
          </>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Timelogs</h1>
          <p className="text-sm text-slate-400">
            A record of time worked on each order. It does not change labour charges or totals.
          </p>
        </div>
        <PrimaryButton onClick={() => setShowForm((v) => !v)} disabled={orders.length === 0}>
          {showForm ? 'Cancel' : 'New timelog'}
        </PrimaryButton>
      </div>

      <ErrorBanner message={error} />
      {deleteWarning.dialog}

      {orders.length === 0 && (
        <EmptyState message="No orders yet. Create an order first, then log time against it." />
      )}

      {showForm && orders.length > 0 && (
        <Card>
          <form onSubmit={handleAdd} className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <p className="text-sm text-slate-400 md:col-span-2">
              Manual entry for time worked but not clocked. To time work as it happens, use
              Start on the order&apos;s page.
            </p>
            <div className="md:col-span-2">
              <Field label="Order">
                <select
                  required
                  value={entry.repairOrderId}
                  onChange={(e) => setEntry({ ...entry, repairOrderId: e.target.value })}
                  className={inputClassName}
                >
                  <option value="">Select an order…</option>
                  {orders.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.ro_number}
                      {` — ${orderCustomerName(o)}`}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
            <Field label="Started">
              <input
                type="datetime-local"
                required
                value={entry.startedAt}
                onChange={(e) => setEntry({ ...entry, startedAt: e.target.value })}
                className={inputClassName}
              />
            </Field>
            <Field label="Ended">
              <input
                type="datetime-local"
                required
                value={entry.endedAt}
                onChange={(e) => setEntry({ ...entry, endedAt: e.target.value })}
                className={inputClassName}
              />
            </Field>
            <div className="md:col-span-2">
              <Field label="Note">
                <textarea
                  value={entry.note}
                  onChange={(e) => setEntry({ ...entry, note: e.target.value })}
                  className={inputClassName}
                  rows={2}
                  placeholder="Optional"
                />
              </Field>
            </div>
            {formError && <p className="text-sm text-red-400 md:col-span-2">{formError}</p>}
            <div className="md:col-span-2">
              <PrimaryButton
                type="submit"
                disabled={
                  busyId === 'new' ||
                  formError !== null ||
                  !entry.repairOrderId ||
                  entry.startedAt === '' ||
                  entry.endedAt === ''
                }
              >
                {busyId === 'new' ? 'Saving…' : 'Add timelog'}
              </PrimaryButton>
            </div>
          </form>
        </Card>
      )}

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-bold text-white">Running ({running.length})</h2>
        {running.length === 0 ? (
          <EmptyState message="No timers running." />
        ) : (
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">{running.map(renderRow)}</div>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-bold text-white">Finished ({finished.length})</h2>
        {finished.length === 0 ? (
          <EmptyState message="No finished timelogs yet." />
        ) : (
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">{finished.map(renderRow)}</div>
        )}
      </section>
    </div>
  )
}
