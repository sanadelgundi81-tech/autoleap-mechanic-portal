import { useMemo, useState, type ChangeEvent } from 'react'
import { decodeCsvBytes, isBlankRecord, parseCsv } from '../lib/csv'
import {
  IMPORT_FIELDS,
  guessMapping,
  importRows,
  prepareRows,
  yearRange,
  type ColumnMapping,
  type ImportFieldKey,
  type ImportReport,
  type PreparedRow,
} from '../lib/csvImport'
import {
  Card,
  ErrorBanner,
  Field,
  PrimaryButton,
  SecondaryButton,
  SectionTitle,
  inputClassName,
} from '../components/ui'

type Step = 'upload' | 'map' | 'preview' | 'report'

const STEPS: { key: Step; label: string }[] = [
  { key: 'upload', label: '1. Upload' },
  { key: 'map', label: '2. Map columns' },
  { key: 'preview', label: '3. Preview' },
  { key: 'report', label: '4. Import' },
]

const PREVIEW_LIMIT = 50

function headerLabel(headers: string[], index: number): string {
  const h = headers[index]?.trim()
  return h ? h : `Column ${index + 1}`
}

function vehicleSummary(row: PreparedRow): string {
  if (!row.hasVehicle) return '—'
  const v = row.values
  return [v.year ?? '', v.make, v.model, v.trim].filter((p) => p !== '').join(' ')
}

export function Import() {
  const [step, setStep] = useState<Step>('upload')
  const [fileName, setFileName] = useState('')
  const [headers, setHeaders] = useState<string[]>([])
  const [records, setRecords] = useState<string[][]>([])
  /** Spreadsheet row number of records[0]. */
  const [firstRowNumber, setFirstRowNumber] = useState(2)
  const [mapping, setMapping] = useState<ColumnMapping | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [importing, setImporting] = useState(false)
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null)
  const [report, setReport] = useState<ImportReport | null>(null)
  const [reportFileName, setReportFileName] = useState('')

  const rows = useMemo(
    () => (mapping && step !== 'upload' ? prepareRows(records, mapping, firstRowNumber) : []),
    [records, mapping, firstRowNumber, step],
  )
  const validCount = rows.filter((r) => r.problems.length === 0).length
  const failingCount = rows.length - validCount

  async function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = '' // picking the same file again (after fixing it) fires change again
    if (!file) return
    setError(null)
    // The last report stays on screen (below) while the next file is mapped.
    try {
      const parsed = parseCsv(decodeCsvBytes(await file.arrayBuffer()))
      const headerIndex = parsed.findIndex((r) => !isBlankRecord(r))
      if (headerIndex === -1) throw new Error('That file is empty.')
      const head = parsed[headerIndex]
      const data = parsed.slice(headerIndex + 1)
      if (!data.some((r) => !isBlankRecord(r))) {
        throw new Error('That file has a header row but no data rows.')
      }
      setFirstRowNumber(headerIndex + 2)
      setFileName(file.name)
      setHeaders(head)
      setRecords(data)
      setMapping(guessMapping(head))
      setStep('map')
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    }
  }

  function setField(key: ImportFieldKey, value: string) {
    if (!mapping) return
    setMapping({ ...mapping, [key]: value === '' ? null : Number(value) })
  }

  async function handleImport() {
    setError(null)
    setImporting(true)
    setProgress({ done: 0, total: rows.length })
    try {
      const result = await importRows(rows, (done, total) => setProgress({ done, total }))
      setReport(result)
      setReportFileName(fileName)
      setStep('report')
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setImporting(false)
      setProgress(null)
    }
  }

  function startOver() {
    setStep('upload')
    setFileName('')
    setHeaders([])
    setRecords([])
    setMapping(null)
    setError(null)
    // The report stays on screen until the next import replaces it.
  }

  const { min: minYear, max: maxYear } = yearRange()
  const dataRowCount = records.filter((r) => !isBlankRecord(r)).length
  const sampleRecord = records.find((r) => !isBlankRecord(r))
  const mappedFields = mapping ? IMPORT_FIELDS.filter((f) => mapping[f.key] !== null) : []

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Import customers &amp; vehicles</h1>
        <p className="mt-1 text-sm text-slate-400">
          Bring customers and their vehicles in from a CSV file, e.g. an export from another
          shop system. Each row is one customer and, optionally, one vehicle. Customers already
          in the app (same phone, or same name when there is no phone) are matched, not
          duplicated, and their details are not changed. Running the same file again adds
          nothing new.
        </p>
      </div>

      <ol className="flex flex-wrap gap-2 text-xs font-semibold">
        {STEPS.map((s) => (
          <li
            key={s.key}
            className={`rounded-full border px-3 py-1 ${
              s.key === step
                ? 'border-blue-500 bg-blue-600 text-onaccent'
                : 'border-slate-700 bg-slate-900 text-slate-400'
            }`}
          >
            {s.label}
          </li>
        ))}
      </ol>

      <ErrorBanner message={error} />

      {step === 'upload' && (
        <Card>
          <SectionTitle>Choose a CSV file</SectionTitle>
          <p className="mt-2 text-sm text-slate-400">
            The first row must be the column headers. Any column names work — you'll match
            them to the app's fields in the next step.
          </p>
          <input
            type="file"
            accept=".csv,text/csv"
            onChange={(e) => void handleFile(e)}
            className="mt-4 block w-full text-sm text-slate-300 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-600 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-onaccent hover:file:bg-blue-500"
          />
        </Card>
      )}

      {step === 'map' && mapping && (
        <Card>
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <SectionTitle>Match columns</SectionTitle>
            <span className="text-xs text-slate-400">
              {fileName} · {dataRowCount} data row{dataRowCount === 1 ? '' : 's'} ·{' '}
              {headers.length} column{headers.length === 1 ? '' : 's'}
            </span>
          </div>
          <p className="mt-2 text-sm text-slate-400">
            Guesses are filled in from the header names — check them. A field set to "Not
            imported" is left empty. A vehicle is created only for rows with both a make and a
            model.
          </p>
          {(['customer', 'vehicle'] as const).map((group) => (
            <div key={group} className="mt-4">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                {group === 'customer' ? 'Customer' : 'Vehicle'}
              </h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {IMPORT_FIELDS.filter((f) => f.group === group).map((f) => (
                  <Field key={f.key} label={f.required ? `${f.label} (required)` : f.label}>
                    <select
                      className={inputClassName}
                      value={mapping[f.key] === null ? '' : String(mapping[f.key])}
                      onChange={(e) => setField(f.key, e.target.value)}
                    >
                      <option value="">{f.required ? 'Choose a column…' : 'Not imported'}</option>
                      {headers.map((_, i) => (
                        <option key={i} value={i}>
                          {headerLabel(headers, i)}
                          {sampleRecord?.[i]?.trim() ? ` — e.g. "${sampleRecord[i].trim().slice(0, 30)}"` : ''}
                        </option>
                      ))}
                    </select>
                  </Field>
                ))}
              </div>
            </div>
          ))}
          {mapping.name === null && (
            <p className="mt-4 text-sm text-amber-400">Choose the column for the customer name to continue.</p>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            <PrimaryButton disabled={mapping.name === null} onClick={() => setStep('preview')}>
              Preview
            </PrimaryButton>
            <SecondaryButton onClick={startOver}>Choose another file</SecondaryButton>
          </div>
        </Card>
      )}

      {step === 'preview' && mapping && (
        <Card>
          <SectionTitle>Preview</SectionTitle>
          <p className="mt-2 text-sm text-slate-400">
            <span className="font-semibold text-emerald-400">{validCount} row{validCount === 1 ? '' : 's'} ready</span>
            {failingCount > 0 && (
              <>
                {' · '}
                <span className="font-semibold text-rose-400">
                  {failingCount} row{failingCount === 1 ? '' : 's'} will fail
                </span>{' '}
                and not be imported
              </>
            )}
            . Years must be {minYear}–{maxYear}; mileage can't be negative. Whether a customer
            or vehicle is already in the app is checked during the import.
          </p>
          {rows.length > PREVIEW_LIMIT && (
            <p className="mt-1 text-xs text-slate-500">
              Showing the first {PREVIEW_LIMIT} rows. Every failing row is listed in the report
              after the import.
            </p>
          )}
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[40rem] text-left text-sm">
              <thead className="text-xs uppercase text-slate-500">
                <tr>
                  <th className="py-2 pr-3">Row</th>
                  {mappedFields
                    .filter((f) => f.group === 'customer')
                    .map((f) => (
                      <th key={f.key} className="py-2 pr-3">{f.label}</th>
                    ))}
                  <th className="py-2 pr-3">Vehicle</th>
                  {mappedFields
                    .filter((f) => ['vin', 'license_plate', 'mileage_km'].includes(f.key))
                    .map((f) => (
                      <th key={f.key} className="py-2 pr-3">{f.label}</th>
                    ))}
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {rows.slice(0, PREVIEW_LIMIT).map((row) => {
                  const bad = row.problems.length > 0
                  return (
                    <tr key={row.rowNumber} className={bad ? 'bg-rose-500/5' : ''}>
                      <td className="py-2 pr-3 text-slate-500">{row.rowNumber}</td>
                      {mappedFields
                        .filter((f) => f.group === 'customer')
                        .map((f) => (
                          <td key={f.key} className="max-w-[12rem] truncate py-2 pr-3 text-slate-200">
                            {String(row.values[f.key] ?? '')}
                          </td>
                        ))}
                      <td className="py-2 pr-3 text-slate-200">{vehicleSummary(row)}</td>
                      {mappedFields
                        .filter((f) => ['vin', 'license_plate', 'mileage_km'].includes(f.key))
                        .map((f) => (
                          <td key={f.key} className="py-2 pr-3 text-slate-200">
                            {String(row.values[f.key] ?? '')}
                          </td>
                        ))}
                      <td className="py-2 text-xs">
                        {bad ? (
                          <span className="text-rose-400">{row.problems.join('; ')}</span>
                        ) : (
                          <span className="text-emerald-400">OK</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          {progress && (
            <p className="mt-4 text-sm text-slate-300">
              Importing… {progress.done} of {progress.total} rows
            </p>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            <PrimaryButton disabled={importing || validCount === 0} onClick={() => void handleImport()}>
              {importing ? 'Importing…' : `Import ${validCount} row${validCount === 1 ? '' : 's'}`}
            </PrimaryButton>
            <SecondaryButton disabled={importing} onClick={() => setStep('map')}>
              Back to columns
            </SecondaryButton>
          </div>
        </Card>
      )}

      {report && (
        <Card>
          <SectionTitle>
            {step === 'report' ? 'Import report' : 'Last import report'}
            {reportFileName ? ` — ${reportFileName}` : ''}
          </SectionTitle>
          <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {[
              ['Customers created', report.customersCreated],
              ['Merged into existing customers', report.customersMerged],
              ['Vehicles added', report.vehiclesAdded],
              ['Vehicles already on file', report.vehiclesAlreadyThere],
              ['Rows skipped (already there)', report.rowsAlreadyThere],
              ['Rows failed', report.failed.length],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg border border-slate-800 bg-slate-800/40 p-3">
                <dt className="text-xs text-slate-400">{label}</dt>
                <dd className="mt-1 text-2xl font-bold text-white">{value}</dd>
              </div>
            ))}
          </dl>
          {report.failed.length > 0 ? (
            <div className="mt-4">
              <h3 className="text-sm font-semibold text-rose-300">Failed rows (not imported)</h3>
              <ul className="mt-2 space-y-1 text-sm text-slate-300">
                {report.failed.map((f) => (
                  <li key={f.rowNumber}>
                    <span className="text-slate-500">Row {f.rowNumber}:</span> {f.reason}
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-xs text-slate-500">
                Fix these rows in the file and import it again — rows already imported will be
                matched, not duplicated.
              </p>
            </div>
          ) : (
            <p className="mt-4 text-sm text-emerald-400">No rows failed.</p>
          )}
          {step === 'report' && (
            <div className="mt-4">
              <PrimaryButton onClick={startOver}>Import another file</PrimaryButton>
            </div>
          )}
        </Card>
      )}

    </div>
  )
}
