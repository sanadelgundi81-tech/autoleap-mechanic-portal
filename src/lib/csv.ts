// Small CSV reader for the Import page. No dependency: the export format of
// the shop's old system is unknown, so this follows RFC 4180 and is lenient
// about the usual real-world variations.
//
// Handles: quoted fields, delimiters and newlines inside quotes, doubled
// quotes ("") inside quotes, CRLF / LF / lone CR line endings, a UTF-8 BOM,
// trailing blank lines (dropped), and comma / semicolon / tab delimiters
// (detected from the header row).

export type CsvDelimiter = ',' | ';' | '\t'

/**
 * Picks the delimiter from the first record: whichever of comma, semicolon or
 * tab appears most often outside quotes. Comma wins ties and the no-match case.
 */
export function detectDelimiter(text: string): CsvDelimiter {
  const counts: Record<CsvDelimiter, number> = { ',': 0, ';': 0, '\t': 0 }
  let inQuotes = false
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    if (ch === '"') inQuotes = !inQuotes
    else if (!inQuotes && (ch === '\n' || ch === '\r')) break
    else if (!inQuotes && (ch === ',' || ch === ';' || ch === '\t')) counts[ch]++
  }
  let best: CsvDelimiter = ','
  for (const d of [';', '\t'] as const) if (counts[d] > counts[best]) best = d
  return best
}

/**
 * Parses CSV text into records (arrays of cell strings). Cell text is
 * returned as-is (no trimming); callers trim where it matters. Blank records
 * at the end are dropped. Blank records in the middle are kept, so record
 * index + 1 stays equal to the row number a spreadsheet shows; use
 * isBlankRecord to skip them.
 */
export function parseCsv(input: string, delimiter?: CsvDelimiter): string[][] {
  const text = input.charCodeAt(0) === 0xfeff ? input.slice(1) : input
  const delim = delimiter ?? detectDelimiter(text)

  const records: string[][] = []
  let record: string[] = []
  let cell = ''
  let inQuotes = false
  let i = 0

  const endCell = () => {
    record.push(cell)
    cell = ''
  }
  const endRecord = () => {
    endCell()
    records.push(record)
    record = []
  }

  while (i < text.length) {
    const ch = text[i]
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          cell += '"'
          i += 2
          continue
        }
        inQuotes = false
        i++
        continue
      }
      cell += ch
      i++
      continue
    }
    if (ch === '"') {
      // A quote opens a quoted section anywhere in an unquoted cell
      // (lenient: `ab"c,d"` reads as `abc,d`).
      inQuotes = true
      i++
    } else if (ch === delim) {
      endCell()
      i++
    } else if (ch === '\r') {
      endRecord()
      i += text[i + 1] === '\n' ? 2 : 1
    } else if (ch === '\n') {
      endRecord()
      i++
    } else {
      cell += ch
      i++
    }
  }
  // Last record (no trailing newline). An unterminated quote keeps what was read.
  if (cell !== '' || record.length > 0) endRecord()
  while (records.length > 0 && isBlankRecord(records[records.length - 1])) records.pop()
  return records
}

/** True when every cell is empty or whitespace (a blank line, or a row of only delimiters). */
export function isBlankRecord(record: string[]): boolean {
  return record.every((c) => c.trim() === '')
}

/**
 * Decodes file bytes: UTF-8 when the bytes are valid UTF-8 (BOM stripped),
 * otherwise Windows-1252 — what Excel's plain "CSV" save uses on Windows.
 */
export function decodeCsvBytes(bytes: ArrayBuffer): string {
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes)
  } catch {
    return new TextDecoder('windows-1252').decode(bytes)
  }
}
