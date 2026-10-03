'use client'

import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { COURSES, DOMAINS, type Domain } from '@/lib/data'
import { cn } from '@/lib/utils'
import { CourseCard } from './course-card'

type Filter = Domain | 'All'

type CourseCatalogProps = {
  onTakeAssessment: () => void
}

export function CourseCatalog({ onTakeAssessment }: CourseCatalogProps) {
  const [filter, setFilter] = useState<Filter>('All')
  const [query, setQuery] = useState('')
  const [enrolled, setEnrolled] = useState<Set<string>>(() => new Set(['data-1']))

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return COURSES.filter(
      (c) =>
        (filter === 'All' || c.domain === filter) &&
        (!q || c.title.toLowerCase().includes(q) || c.trainer.toLowerCase().includes(q)),
    )
  }, [filter, query])

  const toggleEnroll = (id: string) =>
    setEnrolled((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  const filters: Filter[] = ['All', ...DOMAINS]

  return (
    <section aria-labelledby="catalog-heading" className="mt-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 id="catalog-heading" className="font-heading text-2xl font-semibold tracking-tight">
            Course catalog
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {filtered.length} {filtered.length === 1 ? 'course' : 'courses'} available · {enrolled.size} enrolled
          </p>
        </div>
        <label className="relative w-full md:w-72">
          <span className="sr-only">Search courses or trainers</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search courses or trainers"
            className="h-10 w-full rounded-lg border bg-card pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
          />
        </label>
      </div>

      <div role="group" aria-label="Filter by domain" className="mt-5 flex gap-2 overflow-x-auto pb-1">
        {filters.map((f) => {
          const active = filter === f
          const count = f === 'All' ? COURSES.length : COURSES.filter((c) => c.domain === f).length
          return (
            <button
              key={f}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(f)}
              className={cn(
                'flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors',
                active
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'bg-card text-foreground hover:border-accent hover:text-accent',
              )}
            >
              {f}
              <span
                className={cn(
                  'rounded-full px-1.5 text-xs',
                  active ? 'bg-white/20' : 'bg-muted text-muted-foreground',
                )}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {filtered.length > 0 ? (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((course) => (
            <li key={course.id}>
              <CourseCard
                course={course}
                enrolled={enrolled.has(course.id)}
                onToggleEnroll={() => toggleEnroll(course.id)}
                onTakeAssessment={course.id === 'data-1' ? onTakeAssessment : undefined}
              />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-6 rounded-2xl border border-dashed bg-card p-10 text-center">
          <p className="font-medium">No courses match your search</p>
          <p className="mt-1 text-sm text-muted-foreground">Try a different domain or keyword.</p>
        </div>
      )}
    </section>
  )
}
