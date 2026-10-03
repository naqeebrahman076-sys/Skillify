'use client'

import { useRef, useState, type DragEvent, type FormEvent } from 'react'
import { CheckCircle2, FileText, Link2, Plus, Trash2, UploadCloud, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DOMAINS } from '@/lib/data'
import { cn } from '@/lib/utils'
import { FormField, Panel, inputClass } from '@/components/capacity/form-field'

const ACCEPTED = '.pdf,.ppt,.pptx,.key'
const MAX_FILE_MB = 50

function formatSize(bytes: number) {
  return bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.ceil(bytes / 1024)} KB`
}

function isValidUrl(value: string) {
  try {
    const url = new URL(value)
    return url.protocol === 'https:' || url.protocol === 'http:'
  } catch {
    return false
  }
}

export function CourseAuthoring() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [files, setFiles] = useState<File[]>([])
  const [fileError, setFileError] = useState('')
  const [dragging, setDragging] = useState(false)
  const [videoLinks, setVideoLinks] = useState<string[]>([''])
  const [submitted, setSubmitted] = useState(false)
  const [savedAt, setSavedAt] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const titleError = submitted && !title.trim() ? 'Course title is required.' : ''
  const tagError = submitted && tags.length === 0 ? 'Select at least one domain tag.' : ''
  const descError = submitted && description.trim().length < 20 ? 'Add a description of at least 20 characters.' : ''

  function toggleTag(tag: string) {
    setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  function addFiles(list: FileList | null) {
    if (!list) return
    const incoming = Array.from(list)
    const valid = incoming.filter((f) => /\.(pdf|pptx?|key)$/i.test(f.name) && f.size <= MAX_FILE_MB * 1024 * 1024)
    setFileError(valid.length < incoming.length ? `Only PDF or slide files up to ${MAX_FILE_MB} MB are accepted.` : '')
    setFiles((prev) => [...prev, ...valid.filter((f) => !prev.some((p) => p.name === f.name))])
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setDragging(false)
    addFiles(e.dataTransfer.files)
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitted(true)
    const linksValid = videoLinks.every((l) => !l || isValidUrl(l))
    if (!title.trim() || tags.length === 0 || description.trim().length < 20 || !linksValid) return
    setSavedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-4 lg:grid-cols-3">
      <div className="flex flex-col gap-4 lg:col-span-2">
        <Panel title="Course details" description="Basic information learners see in the catalog.">
          <div className="flex flex-col gap-5">
            <FormField label="Course title" htmlFor="course-title" error={titleError}>
              <input
                id="course-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Tsunami Early Warning Systems"
                aria-invalid={!!titleError}
                className={inputClass}
              />
            </FormField>

            <fieldset className="flex flex-col gap-2">
              <legend className="mb-1.5 text-sm font-medium">Domain tags</legend>
              <div className="flex flex-wrap gap-2">
                {DOMAINS.map((domain) => {
                  const active = tags.includes(domain)
                  return (
                    <button
                      key={domain}
                      type="button"
                      onClick={() => toggleTag(domain)}
                      aria-pressed={active}
                      className={cn(
                        'flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition',
                        active ? 'border-primary bg-primary text-primary-foreground' : 'bg-background hover:bg-muted',
                      )}
                    >
                      {active ? <CheckCircle2 className="size-3.5" aria-hidden="true" /> : <Plus className="size-3.5" aria-hidden="true" />}
                      {domain}
                    </button>
                  )
                })}
              </div>
              {tagError && <p className="text-xs text-destructive">{tagError}</p>}
            </fieldset>

            <FormField label="Description" htmlFor="course-desc" error={descError} hint={`${description.length}/600 characters`}>
              <textarea
                id="course-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value.slice(0, 600))}
                rows={5}
                placeholder="What will participants learn, and how does it apply to their role?"
                aria-invalid={!!descError}
                className={cn(inputClass, 'resize-y')}
              />
            </FormField>
          </div>
        </Panel>

        <Panel title="Lecture materials" description="Upload slides and reading material in PDF or presentation format.">
          <div
            onDragOver={(e) => {
              e.preventDefault()
              setDragging(true)
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            className={cn(
              'flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-10 text-center transition',
              dragging ? 'border-accent bg-accent/10' : 'bg-muted/50',
            )}
          >
            <span className="flex size-12 items-center justify-center rounded-full bg-accent/15 text-accent">
              <UploadCloud className="size-6" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-medium">Drag and drop files here</p>
              <p className="text-xs text-muted-foreground">{`PDF, PPT, PPTX or KEY · up to ${MAX_FILE_MB} MB each`}</p>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={() => inputRef.current?.click()}>
              Browse files
            </Button>
            <input
              ref={inputRef}
              type="file"
              accept={ACCEPTED}
              multiple
              className="sr-only"
              aria-label="Upload lecture materials"
              onChange={(e) => {
                addFiles(e.target.files)
                e.target.value = ''
              }}
            />
          </div>
          {fileError && <p className="mt-2 text-xs text-destructive">{fileError}</p>}
          {files.length > 0 && (
            <ul className="mt-4 flex flex-col gap-2">
              {files.map((file) => (
                <li key={file.name} className="flex items-center gap-3 rounded-lg border px-3 py-2">
                  <FileText className="size-4 shrink-0 text-accent" aria-hidden="true" />
                  <span className="min-w-0 flex-1 truncate text-sm">{file.name}</span>
                  <span className="text-xs text-muted-foreground">{formatSize(file.size)}</span>
                  <button
                    type="button"
                    onClick={() => setFiles((prev) => prev.filter((f) => f !== file))}
                    className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-destructive"
                    aria-label={`Remove ${file.name}`}
                  >
                    <X className="size-4" aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Video streaming links" description="YouTube, Vimeo, or internal NIC streaming URLs.">
          <ul className="flex flex-col gap-3">
            {videoLinks.map((link, index) => {
              const invalid = submitted && !!link && !isValidUrl(link)
              return (
                <li key={index} className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Link2 className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                      <input
                        type="url"
                        value={link}
                        onChange={(e) => setVideoLinks((prev) => prev.map((l, i) => (i === index ? e.target.value : l)))}
                        placeholder="https://stream.gov.in/lecture-01"
                        aria-label={`Video link ${index + 1}`}
                        aria-invalid={invalid}
                        className={cn(inputClass, 'pl-9')}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      disabled={videoLinks.length === 1}
                      onClick={() => setVideoLinks((prev) => prev.filter((_, i) => i !== index))}
                      aria-label={`Remove video link ${index + 1}`}
                    >
                      <Trash2 className="size-4" aria-hidden="true" />
                    </Button>
                  </div>
                  {invalid && <p className="text-xs text-destructive">Enter a valid http(s) URL.</p>}
                </li>
              )
            })}
          </ul>
          <Button type="button" variant="outline" size="sm" className="mt-3" onClick={() => setVideoLinks((prev) => [...prev, ''])}>
            <Plus className="size-4" aria-hidden="true" />
            Add link
          </Button>
        </Panel>
      </div>

      <aside className="flex flex-col gap-4 lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-2xl border bg-card p-5">
          <h2 className="font-heading text-base font-semibold">Publishing checklist</h2>
          <ul className="mt-4 flex flex-col gap-2.5 text-sm">
            {[
              { label: 'Course title', done: !!title.trim() },
              { label: 'Domain tags', done: tags.length > 0 },
              { label: 'Description', done: description.trim().length >= 20 },
              { label: 'Lecture materials', done: files.length > 0 },
              { label: 'Video links', done: videoLinks.some((l) => isValidUrl(l)) },
            ].map((item) => (
              <li key={item.label} className="flex items-center gap-2">
                <CheckCircle2 className={cn('size-4', item.done ? 'text-success' : 'text-border')} aria-hidden="true" />
                <span className={item.done ? '' : 'text-muted-foreground'}>{item.label}</span>
              </li>
            ))}
          </ul>
          <Button type="submit" className="mt-5 w-full">
            Submit for approval
          </Button>
          {savedAt && (
            <p role="status" className="mt-3 flex items-center gap-1.5 text-xs text-success">
              <CheckCircle2 className="size-3.5" aria-hidden="true" />
              {`Sent to admin for review at ${savedAt}`}
            </p>
          )}
        </div>
      </aside>
    </form>
  )
}
