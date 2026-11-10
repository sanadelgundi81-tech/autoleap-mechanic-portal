import { useState } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import { isSupabaseConfigured } from './lib/supabase'
import { Layout, type View } from './components/Layout'
import { Login } from './pages/Login'
import { Dashboard } from './pages/Dashboard'
import { RepairOrders } from './pages/RepairOrders'
import { RepairOrderDetailPage } from './pages/RepairOrderDetail'
import { InspectionPage } from './pages/InspectionPage'
import { Customers } from './pages/Customers'
import { LoadingState } from './components/ui'

function SetupNotice() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4">
      <div className="w-full max-w-lg rounded-xl border border-amber-500/30 bg-slate-900 p-6">
        <h1 className="text-xl font-bold text-white">AutoLeap is not connected yet</h1>
        <p className="mt-2 text-sm text-slate-300">
          This app reads live data from Supabase, and the connection is not
          configured. Nothing here is demo data — the app will not show fake
          numbers instead of a real connection.
        </p>
        <div className="mt-4 rounded-lg bg-slate-800 p-4 text-sm text-slate-200">
          <p className="font-semibold text-white">To connect it:</p>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>
              Apply the migration{' '}
              <code className="text-blue-400">
                supabase/migrations/20261110010000_autoleap_foundation.sql
              </code>{' '}
              to the Supabase project (project:{' '}
              <code className="text-blue-400">autoleap-mechanic-portal</code>).
            </li>
            <li>
              Optionally run <code className="text-blue-400">supabase/seed.sql</code>{' '}
              for clearly-marked sample data.
            </li>
            <li>
              Set the environment variables{' '}
              <code className="text-blue-400">VITE_SUPABASE_URL</code> and{' '}
              <code className="text-blue-400">VITE_SUPABASE_ANON_KEY</code> in the
              deployment (Vercel project settings) or in{' '}
              <code className="text-blue-400">.env.local</code> for local dev.
            </li>
            <li>Create a shop account on the sign-in screen.</li>
          </ol>
        </div>
        <p className="mt-4 text-xs text-slate-400">
          Supabase project URL: https://nfbtbkdlroldwbfcygcx.supabase.co — the
          anon key is set as an environment variable, never in the code.
        </p>
      </div>
    </div>
  )
}

function Shell() {
  const { user, loading } = useAuth()
  const [view, setView] = useState<View>({ name: 'dashboard' })

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <LoadingState message="Checking your session…" />
      </div>
    )
  }

  if (!user) return <Login />

  return (
    <Layout view={view} onNavigate={setView}>
      {view.name === 'dashboard' && <Dashboard onNavigate={setView} />}
      {view.name === 'repair-orders' && <RepairOrders onNavigate={setView} />}
      {view.name === 'repair-order' && (
        <RepairOrderDetailPage id={view.id} onNavigate={setView} />
      )}
      {view.name === 'inspection' && (
        <InspectionPage
          inspectionId={view.inspectionId}
          repairOrderId={view.repairOrderId}
          onNavigate={setView}
        />
      )}
      {view.name === 'customers' && <Customers />}
    </Layout>
  )
}

export default function App() {
  if (!isSupabaseConfigured) return <SetupNotice />
  return (
    <AuthProvider>
      <Shell />
    </AuthProvider>
  )
}
