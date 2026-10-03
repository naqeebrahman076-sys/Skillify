'use client'

import { useEffect, useRef, useState, type DragEvent } from 'react'
import { Download, FileSpreadsheet, Loader2, UploadCloud, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const REQUIRED_COLUMNS = ['employee_id', 'name', 'email', 'institute', 'designation']
const TEMPLATE = `${REQUIRED_COLUMNS.join(',')}\nINC-3001,Asha Kumar,asha.kumar@incois.gov.in,INCOIS,Scientist B\nNIO-2044,Ravi Shetty,ravi.shetty@niot.res.in,NIOT,Technical Officer\n`

type Parsed = { fileName: string; headers: string[]; rows: string[][]; missing: string[] }

function parseCsv(text: string, fileName: string): Parsed {
  const lines = text.split(/\r?\n/).filter((l) => l.trim())
  const headers = (lines[0] ?? '').split(',').map((h) => h.trim().toLowerCase())
  const rows = lines.slice(1).map((l) => l.split(',').map((c) => c.trim()))
  return { fileName, headers, rows, missing: REQUIRED_COLUMNS.filter((c) => !headers.includes(c)) }
}

type Props = {
  open: boolean
  onClose: () => void
  onComplete: (count: number) => void
}

export function BulkOnboardingModal({ open, onClose, onComplete }: Props) {
  const [parsed, setParsed] = useState<Parsed | null>(null)
  const [error, setError] = useState('')
  const [dragging, setDragging] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && !submitting) onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, submitting, onClose])

  if (!open) return null

  async function handleFile(file: File | undefined) {
    if (!file) return
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setError('Please upload a .csv file.')
      setParsed(null)
      return
    }
    setError('')
    setParsed(parseCsv(await file.text(), file.name))
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setDragging(false)
    handleFile(e.dataTransfer.files[0])
  }

  function reset() {
    setParsed(null)
    setError('')
  }

  function close() {
    reset()
    onClose()
  }

  function submit() {
    if (!parsed || parsed.missing.length || parsed.rows.length === 0) return
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      onComplete(parsed.rows.length)
      reset()
    }, 1200)
  }

  const templateHref = `data:text/csv;charset=utf-8,${encodeURIComponent(TEMPLATE)}`
  const canSubmit = !!parsed && parsed.missing.length === 0 && parsed.rows.length > 0 && !submitting

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-primary/60 backdrop-blur-sm sm:items-center sm:p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="bulk-title"
        className="flex max-h-[90dvh] w-full max-w-xl flex-col overflow-hidden rounded-t-2xl bg-card shadow-xl sm:rounded-2xl"
      >
        <header className="flex items-start justify-between gap-4 border-b p-5">
          <div>
            <h2 id="bulk-title" className="font-heading text-lg font-semibold">Bulk Legacy Employee Onboarding</h2>
            <p className="mt-1 text-sm text-muted-foreground">Import existing employee records from a CSV export.</p>
          </div>
          <button type="button" onClick={close} disabled={submitting} className="rounded-md p-1 text-muted-foreground hover:bg-muted" aria-label="Close">
            <X className="size-5" aria-hidden="true" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-5">
          {!parsed ? (
            <div
              onDragOver={(e) => {
                e.preventDefault()
                setDragging(true)
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              className={cn(
                'flex flex-col items-center gap-3 rounded-xl border-2 border-dashed px-6 py-10 text-center transition',
                dragging ? 'border-accent bg-accent/10' : 'bg-muted/50',
              )}
            >
              <UploadCloud className="size-8 text-accent" aria-hidden="true" />
              <div>
                <p className="text-sm font-medium">Drop your CSV here</p>
                <p className="text-xs text-muted-foreground">{`Required columns: ${REQUIRED_COLUMNS.join(', ')}`}</p>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={() => inputRef.current?.click()}>
                Choose file
              </Button>
              <input
                ref={inputRef}
                type="file"
                accept=".csv,text/csv"
                className="sr-only"
                aria-label="Upload CSV file"
                onChange={(e) => {
                  handleFile(e.target.files?.[0])
                  e.target.value = ''
                }}
              />
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 rounded-lg border p-3">
                <FileSpreadsheet className="size-5 shrink-0 text-success" aria-hidden="true" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{parsed.fileName}</p>
                  <p className="text-xs text-muted-foreground">{`${parsed.rows.length} employee records detected`}</p>
                </div>
                <button type="button" onClick={reset} disabled={submitting} className="text-xs font-medium text-accent hover:underline">
                  Replace
                </button>
              </div>
              {parsed.missing.length > 0 ? (
                <p role="alert" className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                  {`Missing required columns: ${parsed.missing.join(', ')}`}
                </p>
              ) : (
                <div className="overflow-x-auto rounded-lg border">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-muted/60 text-muted-foreground">
                      <tr>
                        {parsed.headers.map((h) => (
                          <th key={h} scope="col" className="whitespace-nowrap px-3 py-2 font-medium">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {parsed.rows.slice(0, 4).map((row, i) => (
                        <tr key={i}>
                          {row.map((cell, j) => (
                            <td key={j} className="whitespace-nowrap px-3 py-2">{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {parsed.rows.length > 4 && (
                    <p className="border-t px-3 py-2 text-xs text-muted-foreground">{`+ ${parsed.rows.length - 4} more rows`}</p>
                  )}
                </div>
              )}
            </div>
          )}
          {error && <p role="alert" className="mt-3 text-sm text-destructive">{error}</p>}
        </div>

        <footer className="flex flex-col-reverse gap-2 border-t p-5 sm:flex-row sm:items-center sm:justify-between">
          <a href={templateHref} download="capacity-connect-onboarding-template.csv" className="flex items-center gap-1.5 text-sm font-medium text-accent hover:underline">
            <Download className="size-4" aria-hidden="true" />
            Download template
          </a>
          <div className="flex gap-2">
            <Button variant="outline" onClick={close} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={submit} disabled={!canSubmit}>
              {submitting && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
              {submitting ? 'Importing...' : 'Import employees'}
            </Button>
          </div>
        </footer>
      </div>
    </div>
  )
}
