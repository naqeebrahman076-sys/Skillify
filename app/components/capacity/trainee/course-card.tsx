import {
  Brain,
  Check,
  Clock,
  Database,
  Landmark,
  Layers,
  ShieldCheck,
  Star,
  UserRound,
  Waves,
  type LucideIcon,
} from 'lucide-react'
import type { Course, Domain } from '@/lib/data'
import { cn } from '@/lib/utils'

const DOMAIN_META: Record<Domain, { icon: LucideIcon; tone: string }> = {
  Oceanography: { icon: Waves, tone: 'bg-sky-100 text-sky-800' },
  AI: { icon: Brain, tone: 'bg-violet-100 text-violet-800' },
  Governance: { icon: Landmark, tone: 'bg-amber-100 text-amber-900' },
  'Data Analytics': { icon: Database, tone: 'bg-teal-100 text-teal-800' },
  Cybersecurity: { icon: ShieldCheck, tone: 'bg-rose-100 text-rose-800' },
}

type CourseCardProps = {
  course: Course
  enrolled: boolean
  onToggleEnroll: () => void
  onTakeAssessment?: () => void
}

export function CourseCard({ course, enrolled, onToggleEnroll, onTakeAssessment }: CourseCardProps) {
  const { icon: Icon, tone } = DOMAIN_META[course.domain]

  return (
    <article className="flex h-full flex-col rounded-2xl border bg-card p-5 transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <span className={cn('flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium', tone)}>
          <Icon className="size-3.5" aria-hidden="true" />
          {course.domain}
        </span>
        <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
          <Star className="size-3.5 fill-highlight text-highlight" aria-hidden="true" />
          {course.rating}
          <span className="sr-only">out of 5 rating</span>
        </span>
      </div>

      <h3 className="mt-4 font-heading text-lg font-semibold leading-snug text-balance">{course.title}</h3>
      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{course.description}</p>

      <dl className="mt-4 grid grid-cols-2 gap-y-2 text-sm">
        <div className="flex items-center gap-1.5">
          <dt>
            <Clock className="size-4 text-accent" aria-hidden="true" />
            <span className="sr-only">Duration</span>
          </dt>
          <dd>{course.durationHours} hrs</dd>
        </div>
        <div className="flex items-center gap-1.5">
          <dt>
            <Layers className="size-4 text-accent" aria-hidden="true" />
            <span className="sr-only">Modules</span>
          </dt>
          <dd>{course.modules} modules</dd>
        </div>
        <div className="col-span-2 flex items-center gap-1.5">
          <dt>
            <UserRound className="size-4 text-accent" aria-hidden="true" />
            <span className="sr-only">Trainer</span>
          </dt>
          <dd className="truncate font-medium">{course.trainer}</dd>
        </div>
      </dl>

      <div className="mb-5" />
      <div className="mt-auto flex items-center gap-2 border-t pt-4">
        <span className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">{course.level}</span>
        <div className="ml-auto flex gap-2">
          {enrolled && onTakeAssessment && (
            <button
              type="button"
              onClick={onTakeAssessment}
              className="rounded-lg border px-3 py-2 text-sm font-medium hover:border-accent hover:text-accent"
            >
              Assessment
            </button>
          )}
          <button
            type="button"
            onClick={onToggleEnroll}
            aria-pressed={enrolled}
            aria-label={enrolled ? `Enrolled in ${course.title}. Click to unenroll` : `Enroll in ${course.title}`}
            className={cn(
              'flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
              enrolled
                ? 'bg-success/15 text-success hover:bg-success/25'
                : 'bg-primary text-primary-foreground hover:bg-primary/90',
            )}
          >
            {enrolled && <Check className="size-4" aria-hidden="true" />}
            {enrolled ? 'Enrolled' : 'Enroll'}
          </button>
        </div>
      </div>
    </article>
  )
}
