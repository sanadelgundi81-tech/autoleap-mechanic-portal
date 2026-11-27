import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

/** What a delete will do, in plain words. Every line is built from live data. */
export interface DeleteWarningContent {
  /** Things that will be deleted. */
  deletes: ReactNode[]
  /** Things that are kept (detached / link cleared). */
  keeps?: ReactNode[]
}

export interface DeleteRequest {
  /** e.g. 'Delete customer "Jane Doe"?' */
  title: string
  /**
   * Reads the real counts / amounts right before the dialog shows them. Never
   * guessed: until this resolves the Delete button stays disabled.
   */
  load: () => Promise<DeleteWarningContent>
  /** Performs the delete. A thrown error is shown in the dialog. */
  run: () => Promise<void>
  /** Called after a successful delete (e.g. reload the list, navigate away). */
  onDeleted?: () => void | Promise<void>
}

type DialogState =
  | { phase: 'loading'; request: DeleteRequest }
  | { phase: 'ready'; request: DeleteRequest; content: DeleteWarningContent; error: string | null }
  | { phase: 'deleting'; request: DeleteRequest; content: DeleteWarningContent }
  | { phase: 'failed-load'; request: DeleteRequest; error: string }

function message(err: unknown): string {
  return err instanceof Error ? err.message : String(err)
}

/**
 * The one delete confirmation used everywhere: `ask(request)` opens an
 * itemized warning (what is DELETED, what is KEPT) ending with "This cannot be
 * undone." and Cancel / Delete. Render `dialog` once in the component.
 */
export function useDeleteWarning(): { ask: (request: DeleteRequest) => void; dialog: ReactNode } {
  const [state, setState] = useState<DialogState | null>(null)
  const token = useRef(0)

  const ask = useCallback((request: DeleteRequest) => {
    const mine = ++token.current
    setState({ phase: 'loading', request })
    request
      .load()
      .then((content) => {
        if (token.current === mine) setState({ phase: 'ready', request, content, error: null })
      })
      .catch((err) => {
        if (token.current === mine) setState({ phase: 'failed-load', request, error: message(err) })
      })
  }, [])

  const close = useCallback(() => {
    token.current++
    setState(null)
  }, [])

  async function confirm() {
    if (!state || state.phase !== 'ready') return
    const { request, content } = state
    setState({ phase: 'deleting', request, content })
    try {
      await request.run()
    } catch (err) {
      setState({ phase: 'ready', request, content, error: message(err) })
      return
    }
    setState(null)
    await request.onDeleted?.()
  }

  const dialog = state ? (
    <DeleteWarningDialog state={state} onCancel={close} onConfirm={() => void confirm()} />
  ) : null
  return { ask, dialog }
}

function DeleteWarningDialog({
  state,
  onCancel,
  onConfirm,
}: {
  state: DialogState
  onCancel: () => void
  onConfirm: () => void
}) {
  const titleId = useId()
  const cancelRef = useRef<HTMLButtonElement>(null)
  const busy = state.phase === 'deleting'
  const cancelRefFn = useRef(onCancel)
  cancelRefFn.current = onCancel

  useEffect(() => {
    cancelRef.current?.focus()
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !busy) cancelRefFn.current()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [busy])

  const content = state.phase === 'ready' || state.phase === 'deleting' ? state.content : null
  const error =
    state.phase === 'failed-load' ? state.error : state.phase === 'ready' ? state.error : null

  return createPortal(
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-slate-950/80 p-0 sm:items-center sm:p-4"
      onClick={() => !busy && onCancel()}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-2xl border border-slate-700 bg-slate-900 p-5 shadow-2xl sm:rounded-2xl"
      >
        <h2 id={titleId} className="break-words text-lg font-bold text-white">
          {state.request.title}
        </h2>

        {state.phase === 'loading' && (
          <p className="mt-3 text-sm text-slate-300" role="status">
            Checking exactly what this deletes…
          </p>
        )}

        {content && (
          <div className="mt-3 space-y-3 text-sm">
            {content.deletes.length > 0 && (
              <div>
                <p className="font-semibold text-rose-300">Will be deleted</p>
                <ul className="mt-1 list-disc space-y-1 pl-5 text-slate-200">
                  {content.deletes.map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
                </ul>
              </div>
            )}
            {content.keeps && content.keeps.length > 0 && (
              <div>
                <p className="font-semibold text-emerald-300">Will be kept</p>
                <ul className="mt-1 list-disc space-y-1 pl-5 text-slate-200">
                  {content.keeps.map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
                </ul>
              </div>
            )}
            <p className="font-semibold text-white">This cannot be undone.</p>
          </div>
        )}

        {error && (
          <p className="mt-3 rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-300" role="alert">
            {state.phase === 'failed-load' ? `Could not check what this deletes: ${error}` : error}
          </p>
        )}

        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="min-h-[44px] rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-700 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={state.phase !== 'ready'}
            className="min-h-[44px] rounded-lg bg-rose-600 px-4 py-2 text-sm font-bold text-onaccent hover:bg-rose-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}

/** "1 vehicle" / "3 vehicles" / "no vehicles". */
export function plural(n: number, one: string, many = `${one}s`): string {
  if (n === 0) return `no ${many}`
  return `${n} ${n === 1 ? one : many}`
}
