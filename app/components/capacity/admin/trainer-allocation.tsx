'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown, Loader2, Search, Sparkles, Star, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DOMAIN_SKILLS, rankTrainers, type RankedTrainer } from '@/lib/dashboard-data'
import { cn } from '@/lib/utils'

function scoreTone(score: number) {
  if (score >= 85) return 'bg-success/15 text-success'
  if (score >= 70) return 'bg-accent/15 text-accent'
  return 'bg-muted text-muted-foreground'
}

export function TrainerAllocation() {
  const [selected, setSelected] = useState<string[]>(['Remote Sensing', 'Python'])
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<RankedTrainer[] | null>(null)
  const [assigned, setAssigned] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function onClick(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [open])

  const filtered = DOMAIN_SKILLS.filter((s) => s.toLowerCase().includes(query.trim().toLowerCase()))

  function toggle(skill: string) {
    setSelected((prev) => (prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]))
  }

  function findTrainers() {
    setLoading(true)
    setAssigned(null)
    setTimeout(() => {
      setResults(rankTrainers(selected))
      setLoading(false)
    }, 700)
  }

  return (
    <section className="flex flex-col rounded-2xl border bg-card p-5 md:p-6">
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-highlight/25 text-highlight-foreground">
          <Sparkles className="size-5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="font-heading text-lg font-semibold leading-snug tracking-tight">Algorithmic Competency-Based Trainer Allocation</h2>
          <p className="mt-1 text-sm text-muted-foreground">Weighted on skill proficiency (70%), rating (15%) and availability (15%).</p>
        </div>
      </div>

      <div ref={containerRef} className="relative mt-5">
        <label htmlFor="skill-search" className="text-sm font-medium">
          Required domain skills
        </label>
        <div
          className={cn(
            'mt-1.5 flex min-h-11 flex-wrap items-center gap-1.5 rounded-lg border bg-background px-2 py-1.5 transition',
            open && 'border-accent ring-2 ring-accent/30',
          )}
        >
          {selected.map((skill) => (
            <span key={skill} className="flex items-center gap-1 rounded-md bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">
              {skill}
              <button type="button" onClick={() => toggle(skill)} aria-label={`Remove ${skill}`} className="rounded opacity-70 hover:opacity-100">
                <X className="size-3" aria-hidden="true" />
              </button>
            </span>
          ))}
          <div className="flex min-w-32 flex-1 items-center gap-1.5">
            <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            <input
              id="skill-search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setOpen(true)
              }}
              onFocus={() => setOpen(true)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') setOpen(false)
                if (e.key === 'Enter' && !e.nativeEvent.isComposing && e.keyCode !== 229 && filtered[0]) {
                  e.preventDefault()
                  toggle(filtered[0])
                  setQuery('')
                }
              }}
              placeholder={selected.length ? 'Add skill...' : 'Search skills...'}
              role="combobox"
              aria-expanded={open}
              aria-controls="skill-listbox"
              aria-autocomplete="list"
              className="min-w-0 flex-1 bg-transparent py-1 text-sm outline-none placeholder:text-muted-foreground"
            />
            <button type="button" onClick={() => setOpen((o) => !o)} aria-label="Toggle skill list" className="text-muted-foreground">
              <ChevronDown className={cn('size-4 transition', open && 'rotate-180')} aria-hidden="true" />
            </button>
          </div>
        </div>
        {open && (
          <ul
            id="skill-listbox"
            role="listbox"
            aria-multiselectable="true"
            className="absolute inset-x-0 top-full z-20 mt-1 max-h-56 overflow-y-auto rounded-lg border bg-popover p-1 shadow-lg"
          >
            {filtered.length === 0 && <li className="px-3 py-2 text-sm text-muted-foreground">No skills found</li>}
            {filtered.map((skill) => {
              const active = selected.includes(skill)
              return (
                <li
                  key={skill}
                  role="option"
                  aria-selected={active}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => toggle(skill)}
                  className="flex cursor-pointer items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-muted"
                >
                  {skill}
                  {active && <Check className="size-4 text-accent" aria-hidden="true" />}
                </li>
              )
            })}
          </ul>
        )}
      </div>

      <Button onClick={findTrainers} disabled={selected.length === 0 || loading} className="mt-4 w-full">
        {loading ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Sparkles className="size-4" aria-hidden="true" />}
        {loading ? 'Computing matches...' : 'Find Optimal Trainers'}
      </Button>

      <div className="mt-5 flex-1" aria-live="polite">
        {results === null && !loading && (
          <p className="rounded-lg border border-dashed px-4 py-8 text-center text-sm text-muted-foreground">
            Select skills and run the allocation to see ranked candidates.
          </p>
        )}
        {results && results.length === 0 && !loading && (
          <p className="rounded-lg border border-dashed px-4 py-8 text-center text-sm text-muted-foreground">No trainers match the selected skills.</p>
        )}
        {results && results.length > 0 && !loading && (
          <ol className="flex flex-col gap-2">
            {results.slice(0, 5).map((t, i) => (
              <li key={t.id} className={cn('flex items-center gap-3 rounded-xl border p-3', i === 0 && 'border-success/50 bg-success/5')}>
                <span className="w-5 text-center font-mono text-sm font-semibold text-muted-foreground">{i + 1}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{t.name}</p>
                  <p className="flex items-center gap-1 truncate text-xs text-muted-foreground">
                    {`${t.institute} · ${t.title} ·`}
                    <Star className="size-3 fill-highlight text-highlight" aria-hidden="true" />
                    {t.rating}
                  </p>
                  <p className="mt-1 truncate text-xs text-muted-foreground">{`Matches: ${t.matchedSkills.join(', ')}`}</p>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <span className={cn('whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold tabular-nums', scoreTone(t.matchScore))}>
                    {`${t.matchScore}% Match`}
                  </span>
                  <button
                    type="button"
                    onClick={() => setAssigned(t.id)}
                    className="text-xs font-medium text-accent hover:underline disabled:text-success disabled:no-underline"
                    disabled={assigned === t.id}
                  >
                    {assigned === t.id ? 'Assigned' : 'Assign'}
                  </button>
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  )
}
