import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'

export interface OverflowMenuItem {
  label: string
  onSelect: () => void
  /** Shown in red (Delete and similar). */
  danger?: boolean
  disabled?: boolean
}

/**
 * A "⋯" button that opens a small dropdown of row actions (Edit, Delete, …).
 * Closes on outside click, on Escape (focus returns to the button) and after
 * an item is chosen. Arrow keys / Home / End move between items.
 */
export function OverflowMenu({
  items,
  label = 'More actions',
  disabled = false,
}: {
  items: OverflowMenuItem[]
  /** Accessible name for the ⋯ button, e.g. "Actions for Jane Doe". */
  label?: string
  disabled?: boolean
}) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const menuId = useId()

  useEffect(() => {
    if (!open) return
    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    // Focus the first enabled item when the menu opens.
    menuRef.current?.querySelector<HTMLButtonElement>('button:not([disabled])')?.focus()
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open])

  function itemButtons(): HTMLButtonElement[] {
    return Array.from(
      menuRef.current?.querySelectorAll<HTMLButtonElement>('button:not([disabled])') ?? [],
    )
  }

  function onMenuKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const buttons = itemButtons()
    const index = buttons.indexOf(document.activeElement as HTMLButtonElement)
    let next: number | null = null
    if (event.key === 'ArrowDown') next = (index + 1) % buttons.length
    else if (event.key === 'ArrowUp') next = (index - 1 + buttons.length) % buttons.length
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = buttons.length - 1
    else if (event.key === 'Escape') {
      event.preventDefault()
      setOpen(false)
      buttonRef.current?.focus()
      return
    } else if (event.key === 'Tab') {
      setOpen(false)
      return
    }
    if (next !== null && buttons.length > 0) {
      event.preventDefault()
      buttons[next].focus()
    }
  }

  return (
    <div ref={rootRef} className="relative inline-block shrink-0">
      <button
        ref={buttonRef}
        type="button"
        onClick={(e) => {
          // Rows that are themselves clickable must not also open.
          e.stopPropagation()
          setOpen((v) => !v)
        }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown' && !open) {
            e.preventDefault()
            setOpen(true)
          }
        }}
        disabled={disabled}
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-lg leading-none text-slate-200 transition hover:bg-slate-700 disabled:opacity-50"
      >
        <span aria-hidden="true">⋯</span>
      </button>
      {open && (
        <div
          ref={menuRef}
          id={menuId}
          role="menu"
          aria-label={label}
          onKeyDown={onMenuKeyDown}
          onClick={(e) => e.stopPropagation()}
          className="absolute right-0 z-30 mt-1 min-w-[9rem] overflow-hidden rounded-lg border border-slate-700 bg-slate-900 py-1 shadow-xl"
        >
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              role="menuitem"
              disabled={item.disabled}
              onClick={() => {
                setOpen(false)
                buttonRef.current?.focus()
                item.onSelect()
              }}
              className={`block w-full px-4 py-2 text-left text-sm font-medium outline-none transition hover:bg-slate-800 focus:bg-slate-800 disabled:opacity-50 ${
                item.danger ? 'text-rose-400' : 'text-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
