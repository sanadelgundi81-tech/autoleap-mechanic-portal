import type { ReactNode } from 'react'
import type {
  InspectionResultState,
  InspectionStatus,
  RepairOrderPriority,
  RepairOrderStatus,
} from '../lib/types'
import {
  INSPECTION_RESULT_STATE_LABELS,
  REPAIR_ORDER_PRIORITY_LABELS,
  REPAIR_ORDER_STATUS_LABELS,
} from '../lib/types'

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-slate-800 bg-slate-900 p-4 ${className}`}>
      {children}
    </div>
  )
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
      {children}
    </h2>
  )
}

const RO_STATUS_STYLES: Record<RepairOrderStatus, string> = {
  estimate: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
  waiting_for_approval: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  waiting_for_parts: 'bg-violet-500/10 text-violet-400 border-violet-500/30',
  appointment_confirmed: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  invoice: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
}

export function RepairOrderStatusBadge({ status }: { status: RepairOrderStatus }) {
  return (
    <span
      className={`inline-block rounded border px-2 py-0.5 text-xs font-bold ${RO_STATUS_STYLES[status]}`}
    >
      {REPAIR_ORDER_STATUS_LABELS[status]}
    </span>
  )
}

const PRIORITY_STYLES: Record<RepairOrderPriority, string> = {
  low: 'bg-slate-500/10 text-slate-300 border-slate-500/30',
  medium: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  high: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
}

export function PriorityBadge({ priority }: { priority: RepairOrderPriority }) {
  return (
    <span
      className={`inline-block rounded border px-2 py-0.5 text-xs font-bold ${PRIORITY_STYLES[priority]}`}
    >
      {REPAIR_ORDER_PRIORITY_LABELS[priority]} priority
    </span>
  )
}

const RESULT_STATE_STYLES: Record<InspectionResultState | 'unmarked', string> = {
  good: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
  attention: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  failed: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
  unmarked: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
}

export function InspectionStateBadge({
  state,
}: {
  state: InspectionResultState | 'unmarked'
}) {
  const label = state === 'unmarked' ? 'Unmarked' : INSPECTION_RESULT_STATE_LABELS[state]
  return (
    <span
      className={`inline-block rounded border px-2 py-0.5 text-xs font-bold ${RESULT_STATE_STYLES[state]}`}
    >
      {label}
    </span>
  )
}

export function InspectionStatusBadge({ status }: { status: InspectionStatus }) {
  return (
    <span
      className={`inline-block rounded border px-2 py-0.5 text-xs font-bold ${
        status === 'complete'
          ? 'border-teal-500/30 bg-teal-500/10 text-teal-400'
          : 'border-blue-500/30 bg-blue-500/10 text-blue-400'
      }`}
    >
      {status === 'complete' ? 'Complete' : 'In progress'}
    </span>
  )
}

/** Counts row for an inspection: unmarked (grey), failed (red), attention (amber), passed (teal). */
export function InspectionCountsRow({
  counts,
}: {
  counts: { unmarked: number; failed: number; attention: number; good: number }
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 text-sm">
      <span className="flex items-center gap-1.5">
        <span className="h-3 w-3 rounded-full bg-slate-500" />
        <span className="text-slate-300">{counts.unmarked} unmarked</span>
      </span>
      <span className="flex items-center gap-1.5">
        <span className="h-3 w-3 rounded-full bg-rose-500" />
        <span className="text-slate-300">{counts.failed} failed</span>
      </span>
      <span className="flex items-center gap-1.5">
        <span className="h-3 w-3 rounded-full bg-amber-500" />
        <span className="text-slate-300">{counts.attention} attention</span>
      </span>
      <span className="flex items-center gap-1.5">
        <span className="h-3 w-3 rounded-full bg-teal-500" />
        <span className="text-slate-300">{counts.good} passed</span>
      </span>
    </div>
  )
}

export function PrimaryButton({
  children,
  onClick,
  type = 'button',
  disabled = false,
  className = '',
}: {
  children: ReactNode
  onClick?: () => void
  type?: 'button' | 'submit'
  disabled?: boolean
  className?: string
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  )
}

export function SecondaryButton({
  children,
  onClick,
  type = 'button',
  disabled = false,
  className = '',
}: {
  children: ReactNode
  onClick?: () => void
  type?: 'button' | 'submit'
  disabled?: boolean
  className?: string
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  )
}

export function Field({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs text-slate-400">{label}</span>
      {children}
    </label>
  )
}

export const inputClassName =
  'w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none'

export function ErrorBanner({ message }: { message: string | null }) {
  if (!message) return null
  return (
    <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-300">
      {message}
    </div>
  )
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-700 p-6 text-center text-sm text-slate-400">
      {message}
    </div>
  )
}

export function LoadingState({ message = 'Loading…' }: { message?: string }) {
  return <div className="p-6 text-sm text-slate-400">{message}</div>
}
