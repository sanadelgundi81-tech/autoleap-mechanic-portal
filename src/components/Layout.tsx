import type { ReactNode } from 'react'
import { useAuth } from '../context/AuthContext'

export type View =
  | { name: 'dashboard' }
  | { name: 'repair-orders' }
  | { name: 'repair-order'; id: string }
  | { name: 'inspection'; inspectionId: string; repairOrderId: string }
  | { name: 'customers' }

const NAV_ITEMS: { name: View['name']; label: string }[] = [
  { name: 'dashboard', label: 'Dashboard' },
  { name: 'repair-orders', label: 'Repair Orders' },
  { name: 'customers', label: 'Customers' },
]

export function Layout({
  view,
  onNavigate,
  children,
}: {
  view: View
  onNavigate: (view: View) => void
  children: ReactNode
}) {
  const { user, signOut } = useAuth()

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
      <header className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-xl font-bold text-white">
            AL
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">AutoLeap</h1>
            <p className="text-xs text-slate-400">
              Independent Mechanic Portal &amp; DVI Command Center
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3 text-xs">
          <span className="hidden rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 font-medium text-emerald-400 sm:inline">
            Connected
          </span>
          <span className="hidden text-slate-400 md:inline">{user?.email}</span>
          <button
            onClick={() => void signOut()}
            className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 font-medium text-slate-200 transition hover:bg-slate-700"
          >
            Sign out
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        <nav className="hidden w-52 shrink-0 flex-col gap-1 border-r border-slate-800 bg-slate-900/60 p-4 md:flex">
          {NAV_ITEMS.map((item) => {
            const active =
              view.name === item.name ||
              (item.name === 'repair-orders' && view.name === 'repair-order')
            return (
              <button
                key={item.name}
                onClick={() => onNavigate({ name: item.name } as View)}
                className={`rounded-lg px-3 py-2 text-left text-sm font-medium transition ${
                  active
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                {item.label}
              </button>
            )
          })}
        </nav>

        <main className="flex-1 p-6 pb-20 md:pb-6">{children}</main>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-slate-800 bg-slate-900 px-4 py-2.5 text-xs md:hidden">
        {NAV_ITEMS.map((item) => {
          const active =
            view.name === item.name ||
            (item.name === 'repair-orders' && view.name === 'repair-order')
          return (
            <button
              key={item.name}
              onClick={() => onNavigate({ name: item.name } as View)}
              className={`font-semibold ${active ? 'text-blue-400' : 'text-slate-300'}`}
            >
              {item.label}
            </button>
          )
        })}
      </nav>
    </div>
  )
}
