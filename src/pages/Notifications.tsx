import { useEffect, useState } from 'react'
import {
  deleteNotification,
  fetchNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  resolveNotificationTarget,
  type NotificationTarget,
} from '../lib/data'
import { formatDateTime } from '../lib/format'
import type { AppNotification, NotificationRelatedType } from '../lib/types'
import {
  EmptyState,
  ErrorBanner,
  LoadingState,
  PrimaryButton,
  SecondaryButton,
} from '../components/ui'
import type { View } from '../components/Layout'

const RELATED_LABELS: Record<NotificationRelatedType, string> = {
  repair_order: 'repair order',
  appointment: 'appointment',
  customer: 'customer',
  estimate: 'estimate',
  invoice: 'invoice',
}

function targetView(target: NotificationTarget): View {
  if (target.kind === 'repair_order') return { name: 'repair-order', id: target.id }
  if (target.kind === 'appointment') return { name: 'appointments', focusAppointmentId: target.id }
  return { name: 'customers', focusCustomerId: target.id }
}

export function Notifications({
  onNavigate,
  onUnreadChange,
}: {
  onNavigate: (view: View) => void
  /** Refreshes the unread badge in the navigation. */
  onUnreadChange: () => Promise<void>
}) {
  const [notifications, setNotifications] = useState<AppNotification[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<string | null>(null)

  async function load() {
    try {
      setNotifications(await fetchNotifications())
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    }
  }

  useEffect(() => {
    let cancelled = false
    async function loadOnce() {
      try {
        const list = await fetchNotifications()
        if (!cancelled) setNotifications(list)
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

  /** Runs a change, then reloads the list and the nav badge. */
  async function run(id: string, action: () => Promise<void>) {
    setError(null)
    setBusyId(id)
    try {
      await action()
      await load()
      await onUnreadChange()
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setBusyId(null)
    }
  }

  /**
   * Opens the related record and marks the notification read. If the
   * record no longer exists, says so and leaves the notification as it is.
   */
  async function handleOpen(n: AppNotification) {
    setError(null)
    setBusyId(n.id)
    try {
      const target = await resolveNotificationTarget(n)
      if (!target) {
        if (n.related_type) {
          setError(
            `The ${RELATED_LABELS[n.related_type]} this notification refers to no longer exists.`,
          )
          return
        }
        // Not linked to anything: opening it just marks it read.
        if (!n.is_read) await markNotificationRead(n.id)
        await load()
        await onUnreadChange()
        return
      }
      if (!n.is_read) await markNotificationRead(n.id)
      await onUnreadChange()
      onNavigate(targetView(target))
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setBusyId(null)
    }
  }

  function handleDelete(n: AppNotification) {
    if (!window.confirm(`Delete the notification "${n.title}"?`)) return
    void run(n.id, () => deleteNotification(n.id))
  }

  if (loading) return <LoadingState message="Loading notifications…" />

  const unread = notifications.filter((n) => !n.is_read)
  const read = notifications.filter((n) => n.is_read)

  function renderRow(n: AppNotification) {
    return (
      <div
        key={n.id}
        className={`flex items-start gap-3 rounded-xl border p-4 ${
          n.is_read ? 'border-slate-800 bg-slate-900' : 'border-blue-500/40 bg-slate-900'
        }`}
      >
        <span
          className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${
            n.is_read ? 'bg-transparent' : 'bg-blue-500'
          }`}
          aria-label={n.is_read ? undefined : 'Unread'}
        />
        <button
          onClick={() => void handleOpen(n)}
          disabled={busyId === n.id}
          className="min-w-0 flex-1 text-left disabled:opacity-60"
        >
          <p className={`font-semibold ${n.is_read ? 'text-slate-300' : 'text-white'}`}>
            {n.title}
          </p>
          {n.body && <p className="mt-0.5 text-sm text-slate-400">{n.body}</p>}
          <p className="mt-1 text-xs text-slate-500">{formatDateTime(n.created_at)}</p>
        </button>
        <div className="flex shrink-0 flex-wrap justify-end gap-2">
          {!n.is_read && (
            <SecondaryButton
              onClick={() => void run(n.id, () => markNotificationRead(n.id))}
              disabled={busyId === n.id}
            >
              Mark read
            </SecondaryButton>
          )}
          <SecondaryButton onClick={() => handleDelete(n)} disabled={busyId === n.id}>
            Delete
          </SecondaryButton>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-white">Notifications</h1>
        <PrimaryButton
          onClick={() => void run('all', markAllNotificationsRead)}
          disabled={unread.length === 0 || busyId === 'all'}
        >
          {busyId === 'all' ? 'Marking…' : 'Mark all read'}
        </PrimaryButton>
      </div>

      <ErrorBanner message={error} />

      {notifications.length === 0 ? (
        <EmptyState message="No notifications yet. Bookings, cancellations, estimate and invoice changes, and orders waiting on approval or parts show up here." />
      ) : (
        <>
          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-bold text-white">Unread ({unread.length})</h2>
            {unread.length === 0 ? (
              <EmptyState message="You're all caught up." />
            ) : (
              unread.map(renderRow)
            )}
          </section>
          {read.length > 0 && (
            <section className="flex flex-col gap-3">
              <h2 className="text-lg font-bold text-white">Read ({read.length})</h2>
              {read.map(renderRow)}
            </section>
          )}
        </>
      )}
    </div>
  )
}
