import { Award, BookCheck, Clock, Medal, Timer } from 'lucide-react'
import { TRAINEE } from '@/lib/data'
import { cn } from '@/lib/utils'

const TIER_STYLES: Record<string, string> = {
  Gold: 'bg-highlight/25 text-highlight-foreground ring-highlight/50',
  Silver: 'bg-secondary text-secondary-foreground ring-border',
  Bronze: 'bg-orange-100 text-orange-900 ring-orange-200',
}

type ProfileHeaderProps = {
  onStartAssessment: () => void
}

export function ProfileHeader({ onStartAssessment }: ProfileHeaderProps) {
  const initials = TRAINEE.name
    .split(' ')
    .map((n) => n[0])
    .join('')

  const stats = [
    { label: 'Completed courses', value: TRAINEE.completedCourses, icon: BookCheck },
    { label: 'Certificates earned', value: TRAINEE.certificates, icon: Award },
    { label: 'Learning hours', value: TRAINEE.learningHours, icon: Clock },
  ]

  return (
    <section aria-labelledby="profile-heading" className="grid gap-4 lg:grid-cols-3">
      <div className="rounded-2xl border bg-card p-5 md:p-6 lg:col-span-2">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-primary font-heading text-xl font-semibold text-primary-foreground">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm text-muted-foreground">Welcome back,</p>
            <h1 id="profile-heading" className="font-heading text-2xl font-semibold tracking-tight text-balance">
              {TRAINEE.name}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {TRAINEE.designation} · {TRAINEE.department}
              <span className="ml-2 rounded bg-muted px-1.5 py-0.5 font-mono text-xs">{TRAINEE.employeeId}</span>
            </p>
          </div>
        </div>

        <dl className="mt-6 grid grid-cols-3 gap-3">
          {stats.map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-xl bg-muted p-3 md:p-4">
              <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Icon className="size-3.5 text-accent" aria-hidden="true" />
                <span className="truncate">{label}</span>
              </dt>
              <dd className="mt-1 font-heading text-2xl font-semibold md:text-3xl">{value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-6">
          <h2 className="flex items-center gap-1.5 text-sm font-medium">
            <Medal className="size-4 text-accent" aria-hidden="true" />
            Current skill badges
          </h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {TRAINEE.badges.map((badge) => (
              <li
                key={badge.label}
                className={cn(
                  'flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ring-1',
                  TIER_STYLES[badge.tier],
                )}
              >
                <Medal className="size-3.5" aria-hidden="true" />
                {badge.label}
                <span className="opacity-70">· {badge.tier}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex flex-col justify-between gap-6 rounded-2xl bg-primary p-5 text-primary-foreground md:p-6">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-highlight px-2.5 py-1 text-xs font-semibold text-highlight-foreground">
            <Timer className="size-3.5" aria-hidden="true" />
            Due Oct 15
          </span>
          <h2 className="mt-4 font-heading text-xl font-semibold text-balance">
            Data Analytics for Decision Makers
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-primary-foreground/70">
            Module 4 timed assessment · 5 questions · 10 minutes. Score 60% or higher to unlock your certificate.
          </p>
        </div>
        <div>
          <div className="mb-2 flex justify-between text-xs text-primary-foreground/70">
            <span>Course progress</span>
            <span>72%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/15">
            <div className="h-full w-[72%] rounded-full bg-accent" />
          </div>
          <button
            type="button"
            onClick={onStartAssessment}
            className="mt-5 w-full rounded-lg bg-card px-4 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Start Timed Assessment
          </button>
        </div>
      </div>
    </section>
  )
}
