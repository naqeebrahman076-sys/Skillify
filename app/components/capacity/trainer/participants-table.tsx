'use client'

import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { PARTICIPANTS, TRAINER_COURSES, type Participant } from '@/lib/dashboard-data'
import { cn } from '@/lib/utils'
import { Panel, inputClass } from '@/components/capacity/form-field'

const STATUS_STYLES: Record<Participant['status'], string> = {
  'On track': 'bg-accent/15 text-accent',
  'At risk': 'bg-destructive/10 text-destructive',
  Completed: 'bg-success/15 text-success',
  'Not started': 'bg-muted text-muted-foreground',
}

export function ParticipantsTable() {
  const [query, setQuery] = useState('')
  const [course, setCourse] = useState('All courses')

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    return PARTICIPANTS.filter(
      (p) =>
        (course === 'All courses' || p.course === course) &&
        (!q || p.name.toLowerCase().includes(q) || p.employeeId.toLowerCase().includes(q)),
    )
  }, [query, course])

  const scored = rows.filter((r) => r.avgScore !== null)
  const avgProgress = rows.length ? Math.round(rows.reduce((s, r) => s + r.progress, 0) / rows.length) : 0
  const avgScore = scored.length ? Math.round(scored.reduce((s, r) => s + (r.avgScore ?? 0), 0) / scored.length) : 0
  const atRisk = rows.filter((r) => r.status === 'At risk').length

  return (
    <Panel title="Enrolled participants" description="Live progress across your active courses.">
      <dl className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { label: 'Participants', value: rows.length },
          { label: 'Avg. progress', value: `${avgProgress}%` },
          { label: 'Avg. score', value: `${avgScore}%` },
          { label: 'At risk', value: atRisk },
        ].map((s) => (
          <div key={s.label} className="rounded-xl bg-muted p-3">
            <dt className="text-xs text-muted-foreground">{s.label}</dt>
            <dd className="mt-0.5 font-heading text-xl font-semibold">{s.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or employee ID"
            aria-label="Search participants"
            className={cn(inputClass, 'pl-9')}
          />
        </div>
        <select value={course} onChange={(e) => setCourse(e.target.value)} aria-label="Filter by course" className={cn(inputClass, 'sm:w-72')}>
          <option>All courses</option>
          {TRAINER_COURSES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto rounded-xl border">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-muted/60 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th scope="col" className="px-4 py-3 font-medium">Participant</th>
              <th scope="col" className="px-4 py-3 font-medium">Course</th>
              <th scope="col" className="px-4 py-3 font-medium">Progress</th>
              <th scope="col" className="px-4 py-3 font-medium">Avg. score</th>
              <th scope="col" className="px-4 py-3 font-medium">Last active</th>
              <th scope="col" className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {rows.map((p) => (
              <tr key={p.id} className="transition hover:bg-muted/40">
                <td className="px-4 py-3">
                  <p className="font-medium">{p.name}</p>
                  <p className="font-mono text-xs text-muted-foreground">{`${p.employeeId} · ${p.department}`}</p>
                </td>
                <td className="max-w-56 px-4 py-3 text-muted-foreground">
                  <span className="line-clamp-2">{p.course}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-2 w-24 overflow-hidden rounded-full bg-muted"
                      role="progressbar"
                      aria-valuenow={p.progress}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`${p.name} progress`}
                    >
                      <div
                        className={cn('h-full rounded-full', p.progress === 100 ? 'bg-success' : 'bg-accent')}
                        style={{ width: `${p.progress}%` }}
                      />
                    </div>
                    <span className="w-9 text-xs tabular-nums">{`${p.progress}%`}</span>
                  </div>
                </td>
                <td className="px-4 py-3 tabular-nums">
                  {p.avgScore === null ? (
                    <span className="text-muted-foreground">{'—'}</span>
                  ) : (
                    <span className={cn('font-medium', p.avgScore < 60 && 'text-destructive')}>{`${p.avgScore}%`}</span>
                  )}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{p.lastActive}</td>
                <td className="px-4 py-3">
                  <span className={cn('whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium', STATUS_STYLES[p.status])}>{p.status}</span>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                  No participants match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Panel>
  )
}
