import { useEffect, useId, useRef, useState } from 'react'
import {
  INVALID_VIN_MESSAGE,
  NICB_VINCHECK_URL,
  autoCheckUrl,
  carfaxUrl,
  decodeVin,
  fetchRecalls,
  isValidVin,
  normalizeVin,
  vinFromScan,
  type DecodedVehicle,
  type Recall,
} from '../lib/vin'
import { inputClassName } from './ui'

const SMALL_BUTTON =
  'rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50'

/**
 * VIN input with two modes — type it, or scan the Code 39 label with the
 * phone camera — plus a free NHTSA lookup that pre-fills the form. The lookup
 * only hands values back through onDecoded; the mechanic still saves the form.
 */
export function VinField({
  value,
  onChange,
  onDecoded,
}: {
  value: string
  onChange: (vin: string) => void
  /** Gets the VIN that was looked up too, so a scan + lookup never loses the VIN. */
  onDecoded: (vehicle: DecodedVehicle, vin: string) => void
}) {
  const inputId = useId()
  const [scanning, setScanning] = useState(false)
  const [looking, setLooking] = useState(false)
  const [message, setMessage] = useState<{ tone: 'error' | 'info' | 'ok'; text: string } | null>(null)
  const vin = normalizeVin(value)

  async function lookUp(candidate: string) {
    setMessage(null)
    if (!isValidVin(candidate)) {
      setMessage({ tone: 'error', text: INVALID_VIN_MESSAGE })
      return
    }
    setLooking(true)
    const result = await decodeVin(candidate)
    setLooking(false)
    if (result.kind === 'found') {
      onDecoded(result.vehicle, candidate)
      setMessage({
        tone: 'ok',
        text: 'Filled in what NHTSA has for this VIN. Check the details, then save.',
      })
    } else if (result.kind === 'no-match') {
      setMessage({ tone: 'info', text: 'No record for this VIN — enter the details by hand' })
    } else {
      setMessage({ tone: 'error', text: result.message })
    }
  }

  function handleScanned(text: string) {
    setScanning(false)
    const scanned = vinFromScan(text)
    onChange(scanned)
    void lookUp(scanned)
  }

  return (
    <div className="flex flex-col gap-1.5 md:col-span-2">
      <label htmlFor={inputId} className="text-xs font-medium text-slate-400">
        VIN
      </label>
      <div className="flex flex-wrap gap-2">
        <input
          id={inputId}
          value={value}
          onChange={(e) => {
            onChange(e.target.value.toUpperCase())
            setMessage(null)
          }}
          className={`${inputClassName} min-w-0 flex-1 font-mono uppercase`}
          placeholder="17 characters"
          maxLength={20}
          autoCapitalize="characters"
          autoComplete="off"
          spellCheck={false}
        />
        <button type="button" className={SMALL_BUTTON} onClick={() => setScanning(true)}>
          📷 Scan
        </button>
        <button
          type="button"
          className={SMALL_BUTTON}
          onClick={() => void lookUp(vin)}
          disabled={looking || vin === ''}
        >
          {looking ? 'Looking up…' : 'Look up'}
        </button>
      </div>
      {message && (
        <p
          className={`text-xs ${
            message.tone === 'error'
              ? 'text-rose-400'
              : message.tone === 'ok'
                ? 'text-emerald-400'
                : 'text-amber-300'
          }`}
          role={message.tone === 'error' ? 'alert' : 'status'}
        >
          {message.text}
        </p>
      )}
      {isValidVin(vin) && <VinHistoryLinks vin={vin} />}
      {scanning && (
        <VinScanner
          onScanned={handleScanned}
          onCancel={(reason) => {
            setScanning(false)
            if (reason) setMessage({ tone: 'info', text: `${reason} Type the VIN instead.` })
          }}
        />
      )}
    </div>
  )
}

/**
 * Camera scanner for the VIN barcode (Code 39 door-jamb / windshield label;
 * QR and Data Matrix labels too). The library loads only when opened. Any
 * camera problem cancels back to typing — it never blocks the form.
 */
function VinScanner({
  onScanned,
  onCancel,
}: {
  onScanned: (text: string) => void
  onCancel: (reason?: string) => void
}) {
  const regionId = useId().replace(/:/g, '')
  const [status, setStatus] = useState('Starting the camera…')
  const doneRef = useRef(false)
  const callbacks = useRef({ onScanned, onCancel })
  callbacks.current = { onScanned, onCancel }

  useEffect(() => {
    let scanner: import('html5-qrcode').Html5Qrcode | null = null
    let stopped = false

    async function stopCamera() {
      if (scanner?.isScanning) {
        try {
          await scanner.stop()
        } catch {
          // Already stopped.
        }
      }
    }

    async function start() {
      if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) {
        callbacks.current.onCancel('The camera needs a secure (HTTPS) page.')
        return
      }
      try {
        const { Html5Qrcode, Html5QrcodeSupportedFormats } = await import('html5-qrcode')
        if (stopped) return
        scanner = new Html5Qrcode(regionId, {
          formatsToSupport: [
            Html5QrcodeSupportedFormats.CODE_39,
            Html5QrcodeSupportedFormats.DATA_MATRIX,
            Html5QrcodeSupportedFormats.QR_CODE,
          ],
          verbose: false,
        })
        await scanner.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: (w, h) => ({ width: Math.floor(w * 0.9), height: Math.max(80, Math.floor(h * 0.35)) }) },
          (text) => {
            if (doneRef.current) return
            const vin = vinFromScan(text)
            // Ignore partial reads; keep scanning until a full VIN comes through.
            if (vin.length !== 17) return
            doneRef.current = true
            void stopCamera().then(() => callbacks.current.onScanned(vin))
          },
          () => {
            // No barcode in this frame — keep going.
          },
        )
        if (stopped) await stopCamera()
        else setStatus('Point the camera at the VIN barcode.')
      } catch (err) {
        const denied = err instanceof Error && /permission|notallowed|denied/i.test(`${err.name} ${err.message}`)
        callbacks.current.onCancel(
          denied ? 'Camera permission was denied.' : 'The camera could not be started.',
        )
      }
    }

    void start()
    return () => {
      stopped = true
      void stopCamera()
    }
  }, [regionId])

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-3 bg-slate-950/95 p-4" role="dialog" aria-modal="true" aria-label="Scan VIN">
      <div id={regionId} className="w-full max-w-md overflow-hidden rounded-lg bg-black" />
      <p className="text-sm text-slate-300" role="status">
        {status}
      </p>
      <button type="button" className={SMALL_BUTTON} onClick={() => onCancel()}>
        Cancel — type it instead
      </button>
    </div>
  )
}

/**
 * Honest history options. There is no free full history report; NICB's free
 * check needs a captcha on their site, so the app only links to it.
 */
export function VinHistoryLinks({ vin }: { vin: string }) {
  const [copied, setCopied] = useState(false)
  async function openNicb() {
    try {
      await navigator.clipboard.writeText(vin)
      setCopied(true)
    } catch {
      setCopied(false)
    }
    window.open(NICB_VINCHECK_URL, '_blank', 'noopener,noreferrer')
  }
  const link = 'font-semibold text-blue-400 hover:text-blue-300'
  return (
    <div className="flex flex-col gap-1 text-xs text-slate-400">
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        <button type="button" onClick={() => void openNicb()} className={`${link} text-left`}>
          Check total loss / theft (free, NICB)
        </button>
        <a href={carfaxUrl(vin)} target="_blank" rel="noopener noreferrer" className={link}>
          Full history report (paid) — Carfax
        </a>
        <a href={autoCheckUrl(vin)} target="_blank" rel="noopener noreferrer" className={link}>
          Full history report (paid) — AutoCheck
        </a>
      </div>
      <p>
        {copied ? 'VIN copied — paste it on the NICB page and complete their captcha. ' : 'NICB asks you to type the VIN and complete a captcha on their site. '}
        There is no free full history report: Carfax and AutoCheck are paid (a Carfax report is
        about $44.99).
      </p>
    </div>
  )
}

/**
 * NHTSA safety recalls for this make / model / year. Hidden while loading,
 * when there are none, and if the call fails — recalls never block anything.
 */
export function VehicleRecalls({
  make,
  model,
  year,
}: {
  make: string
  model: string
  year: number | null
}) {
  const [recalls, setRecalls] = useState<Recall[] | null>(null)
  useEffect(() => {
    if (!year || !make || !model) return
    let cancelled = false
    void fetchRecalls(make, model, year).then((list) => {
      if (!cancelled) setRecalls(list)
    })
    return () => {
      cancelled = true
    }
  }, [make, model, year])

  if (!recalls || recalls.length === 0) return null
  return (
    <details className="mt-3 rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-sm">
      <summary className="cursor-pointer font-semibold text-amber-300">
        ⚠ {recalls.length} NHTSA safety recall{recalls.length === 1 ? '' : 's'} for {year} {make}{' '}
        {model}
      </summary>
      <p className="mt-1 text-xs text-slate-400">
        Listed for this make, model and year — not every recall applies to every vehicle, and
        some may already be fixed. Confirm with a dealer using the VIN.
      </p>
      <ul className="mt-2 space-y-2">
        {recalls.map((r) => (
          <li key={r.campaignNumber || r.summary} className="rounded border border-slate-700 bg-slate-900/60 p-2">
            <p className="text-xs font-semibold text-slate-200">
              {r.component || 'Recall'}
              {r.campaignNumber ? ` · ${r.campaignNumber}` : ''}
              {r.reportDate ? ` · ${r.reportDate}` : ''}
            </p>
            {r.summary && <p className="mt-1 text-xs text-slate-300">{r.summary}</p>}
            {r.remedy && <p className="mt-1 text-xs text-slate-400">Remedy: {r.remedy}</p>}
          </li>
        ))}
      </ul>
    </details>
  )
}
