import type { ReactNode } from 'react'
import { useAuth } from '../context/AuthContext'
import { ThemeToggle } from './ThemeToggle'

/** Opens the Appointments page with the New appointment form prefilled from an order. */
export interface AppointmentPrefill {
  customerId: string
  vehicleId: string | null
  repairOrderId: string
  roNumber: string
}

export type View =
  | { name: 'dashboard' }
  | { name: 'repair-orders' }
  | { name: 'repair-order'; id: string }
  | { name: 'inspection'; inspectionId: string; repairOrderId: string }
  | { name: 'appointments'; prefill?: AppointmentPrefill; focusAppointmentId?: string }
  | { name: 'notifications' }
  | { name: 'timelogs' }
  | { name: 'earnings' }
  | { name: 'customers'; focusCustomerId?: string }
  | { name: 'customer'; id: string }
  | { name: 'import' }
  | { name: 'guides' }
  | { name: 'torque' }
  | { name: 'invoices' }

const NAV_ITEMS: { name: View['name']; label: string }[] = [
  { name: 'dashboard', label: 'Dashboard' },
  { name: 'repair-orders', label: 'Orders' },
  { name: 'invoices', label: 'Invoices' },
  { name: 'appointments', label: 'Appointments' },
  { name: 'notifications', label: 'Notifications' },
  { name: 'timelogs', label: 'Timelogs' },
  { name: 'earnings', label: 'Earnings' },
  { name: 'customers', label: 'Customers' },
  { name: 'import', label: 'Import' },
  { name: 'guides', label: 'Repair Guides' },
  { name: 'torque', label: 'Torque Specs' },
]

/** Unread count shown next to Notifications in the nav. */
function UnreadBadge({ count }: { count: number }) {
  if (count <= 0) return null
  return (
    <span
      className="ml-1.5 inline-flex min-w-[1.25rem] items-center justify-center rounded-full bg-blue-500 px-1.5 text-[0.7rem] font-bold leading-5 text-onaccent"
      aria-label={`${count} unread`}
    >
      {count > 99 ? '99+' : count}
    </span>
  )
}

export function Layout({
  view,
  onNavigate,
  unreadCount,
  children,
}: {
  view: View
  onNavigate: (view: View) => void
  unreadCount: number
  children: ReactNode
}) {
  const { user, signOut } = useAuth()

  return (
    <div className="flex min-h-screen flex-col overflow-x-clip bg-slate-950 text-slate-100">
      <header className="flex items-center justify-between gap-3 border-b border-slate-800 bg-slate-900 px-4 py-3 md:px-6 md:py-4">
        <div className="flex items-center space-x-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-xl font-bold text-onaccent">
            AL
          </div>
          <div className="min-w-0">
            <h1 className="text-xl font-bold tracking-tight text-white">AutoLeap</h1>
            <p className="hidden text-xs text-slate-400 sm:block">
              Independent Mechanic Portal &amp; DVI Command Center
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2 text-xs sm:gap-3">
          <span className="hidden rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 font-medium text-emerald-400 sm:inline">
            Connected
          </span>
          <span className="hidden text-slate-400 md:inline">{user?.email}</span>
          <ThemeToggle />
          <button
            onClick={() => void signOut()}
            className="min-h-[44px] rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-sm font-medium text-slate-200 transition hover:bg-slate-700"
          >
            Sign out
          </button>
        </div>
      </header>

      {/* One top nav on every screen size: sticky (not a fixed overlay), so nothing sits under it.
          The items stay on one line; on narrow phones the nav strip itself scrolls sideways
          (the page never does). */}
      <nav
        aria-label="Main"
        className="sticky top-0 z-40 flex items-center gap-1 overflow-x-auto whitespace-nowrap border-b border-slate-800 bg-slate-900/95 px-3 py-2 backdrop-blur md:px-6"
      >
        {NAV_ITEMS.map((item) => {
          const active =
            view.name === item.name ||
            (item.name === 'repair-orders' && view.name === 'repair-order') ||
            (item.name === 'customers' && view.name === 'customer')
          return (
            <button
              key={item.name}
              onClick={() => onNavigate({ name: item.name } as View)}
              aria-current={active ? 'page' : undefined}
              className={`min-h-[44px] shrink-0 rounded-lg px-3 py-2 text-sm font-medium transition ${
                active ? 'bg-blue-600 text-onaccent' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              {item.label}
              {item.name === 'notifications' && <UnreadBadge count={unreadCount} />}
            </button>
          )
        })}
      </nav>

      <main className="w-full min-w-0 flex-1 p-4 pb-6 md:p-6">{children}</main>
    </div>
  )
}
