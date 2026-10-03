'use client'

import { useState } from 'react'
import { BookOpenText, ListChecks, Users, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CourseAuthoring } from './course-authoring'
import { QuizBuilder } from './quiz-builder'
import { ParticipantsTable } from './participants-table'

type Tab = 'authoring' | 'quiz' | 'participants'

const TABS: { id: Tab; label: string; icon: LucideIcon }[] = [
  { id: 'authoring', label: 'Course Authoring', icon: BookOpenText },
  { id: 'quiz', label: 'Quiz Builder', icon: ListChecks },
  { id: 'participants', label: 'Participants', icon: Users },
]

export function TrainerDashboard() {
  const [tab, setTab] = useState<Tab>('authoring')

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Trainer workspace</p>
          <h1 className="font-heading text-2xl font-semibold tracking-tight md:text-3xl">Dr. Meera Nair</h1>
          <p className="mt-1 text-sm text-muted-foreground">Senior Scientist · INCOIS · 3 active courses</p>
        </div>
        <div role="tablist" aria-label="Trainer tools" className="flex gap-1 overflow-x-auto rounded-xl border bg-card p-1">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              role="tab"
              id={`tab-${id}`}
              aria-selected={tab === id}
              aria-controls={`panel-${id}`}
              onClick={() => setTab(id)}
              className={cn(
                'flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition',
                tab === id ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              <Icon className="size-4" aria-hidden="true" />
              {label}
            </button>
          ))}
        </div>
      </header>

      <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
        {tab === 'authoring' && <CourseAuthoring />}
        {tab === 'quiz' && <QuizBuilder />}
        {tab === 'participants' && <ParticipantsTable />}
      </div>
    </div>
  )
}
