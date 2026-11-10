import { useEffect, useState } from 'react'
import {
  fetchActiveRepairOrders,
  fetchDashboardStats,
  fetchOpenInspectionFindings,
  type OpenFinding,
} from '../lib/data'
import { formatDate, hours, money, vehicleLabel } from '../lib/format'
import type { DashboardStats, RepairOrder } from '../lib/types'
import {
  Card,
  EmptyState,
  ErrorBanner,
  InspectionStateBadge,
  LoadingState,
  RepairOrderStatusBadge,
  SectionTitle,
} from '../components/ui'
import type { View } from '../components/Layout'

export function Dashboard({ onNavigate }: { onNavigate: (view: View) => void }) {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [activeRos, setActiveRos] = useState<RepairOrder[]>([])
  const [findings, setFindings] = useState<OpenFinding[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const [s, ros, f] = await Promise.all([
          fetchDashboardStats(),
          fetchActiveRepairOrders(),
          fetchOpenInspectionFindings(),
        ])
        if (cancelled) return
        setStats(s)
        setActiveRos(ros)
        setFindings(f)
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : String(err))
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [])

  if (loading) return <LoadingState message="Loading dashboard…" />

  return (
    <div className="flex flex-col gap-6">
      <ErrorBanner message={error} />

      <section className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <div className="text-xs font-medium text-slate-400">Active Repair Orders</div>
          <div className="mt-1 text-xl font-bold text-white">
            {stats ? `${stats.activeRepairOrders} in shop` : '—'}
          </div>
          <div className="mt-0.5 text-[11px] text-blue-400">Assigned — not yet invoiced</div>
        </Card>
        <Card>
          <div className="text-xs font-medium text-slate-400">
            Collected — Paid Invoices
          </div>
          <div className="mt-1 text-xl font-bold text-emerald-400">
            {stats ? money(stats.collectedPaidInvoices) : '—'}
          </div>
          <div className="mt-0.5 text-[11px] text-slate-400">Total of paid invoices</div>
        </Card>
        <Card>
          <div className="text-xs font-medium text-slate-400">Billed Hours</div>
          <div className="mt-1 text-xl font-bold text-amber-400">
            {stats ? hours(stats.billedHours) : '—'}
          </div>
          <div className="mt-0.5 text-[11px] text-slate-400">Across all repair orders</div>
        </Card>
        <Card>
          <div className="text-xs font-medium text-slate-400">
            Open Inspection Findings
          </div>
          <div className="mt-1 text-xl font-bold text-rose-400">
            {stats ? `${stats.openFindings} items` : '—'}
          </div>
          <div className="mt-0.5 text-[11px] text-rose-300">
            {stats
              ? `${stats.failedFindings} failed · ${stats.attentionFindings} attention`
              : '—'}
          </div>
        </Card>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Card className="flex flex-col gap-4">
            <SectionTitle>Bay Queue — Assigned Orders</SectionTitle>
            {activeRos.length === 0 ? (
              <EmptyState message="No assigned repair orders. Create one from the Repair Orders page." />
            ) : (
              <div className="space-y-3">
                {activeRos.map((ro) => (
                  <button
                    key={ro.id}
                    onClick={() => onNavigate({ name: 'repair-order', id: ro.id })}
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 p-4 text-left transition hover:border-slate-600"
                  >
                    <div className="flex items-start justify-between">
                      <span className="rounded bg-blue-500/10 px-2 py-0.5 text-xs font-bold text-blue-400">
                        {ro.bay ?? 'No bay'}
                      </span>
                      <span className="text-xs text-slate-400">{ro.ro_number}</span>
                    </div>
                    <h3 className="mt-2 font-bold text-white">
                      {vehicleLabel(ro.vehicles)}
                    </h3>
                    <p className="text-xs text-slate-400">{ro.customers?.name}</p>
                    <div className="mt-3 flex items-center justify-between text-xs text-slate-300">
                      <span>Tech: {ro.technician ?? 'Unassigned'}</span>
                      <RepairOrderStatusBadge status={ro.status} />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </Card>
        </div>

        <div className="flex flex-col gap-6 lg:col-span-8">
          <Card>
            <SectionTitle>Open Inspection Findings</SectionTitle>
            <div className="mt-3 space-y-3">
              {findings.length === 0 ? (
                <EmptyState message="No open inspection findings. Items marked attention or failed during an inspection show up here." />
              ) : (
                findings.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-800/60 p-4"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <InspectionStateBadge state={item.state} />
                        <h4 className="font-semibold text-white">{item.itemName}</h4>
                      </div>
                      <p className="mt-1 text-xs text-slate-400">
                        {item.roNumber}
                        {item.note ? ` · ${item.note}` : ''}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          <Card>
            <SectionTitle>Recent Assigned Orders</SectionTitle>
            <div className="mt-3 overflow-x-auto">
              {activeRos.length === 0 ? (
                <EmptyState message="Nothing here yet." />
              ) : (
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="text-xs text-slate-400">
                      <th className="pb-2 pr-4 font-medium">RO</th>
                      <th className="pb-2 pr-4 font-medium">Vehicle</th>
                      <th className="pb-2 pr-4 font-medium">Customer</th>
                      <th className="pb-2 pr-4 font-medium">Status</th>
                      <th className="pb-2 font-medium">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeRos.slice(0, 5).map((ro) => (
                      <tr
                        key={ro.id}
                        onClick={() => onNavigate({ name: 'repair-order', id: ro.id })}
                        className="cursor-pointer border-t border-slate-800 text-slate-200 hover:bg-slate-800/50"
                      >
                        <td className="py-2 pr-4 font-semibold text-blue-400">{ro.ro_number}</td>
                        <td className="py-2 pr-4">{vehicleLabel(ro.vehicles)}</td>
                        <td className="py-2 pr-4">{ro.customers?.name}</td>
                        <td className="py-2 pr-4">
                          <RepairOrderStatusBadge status={ro.status} />
                        </td>
                        <td className="py-2">{formatDate(ro.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
