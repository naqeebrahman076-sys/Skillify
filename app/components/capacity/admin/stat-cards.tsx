import { Award, ClipboardCheck, Hourglass, TrendingDown, TrendingUp, Users, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

type Stat = { label: string; value: string; delta: string; up: boolean; icon: LucideIcon; tone: string }

export function StatCards({ activeUsers }: { activeUsers: number }) {
  const stats: Stat[] = [
    { label: 'Total Active Users', value: activeUsers.toLocaleString('en-IN'), delta: '+8.2% this month', up: true, icon: Users, tone: 'bg-primary text-primary-foreground' },
    { label: 'Completed Certifications', value: '3,418', delta: '+214 this week', up: true, icon: Award, tone: 'bg-success/15 text-success' },
    { label: 'Average Assessment Score', value: '76.4%', delta: '-1.3 pts vs last quarter', up: false, icon: ClipboardCheck, tone: 'bg-accent/15 text-accent' },
    { label: 'Pending Approvals', value: '27', delta: '9 older than 48h', up: false, icon: Hourglass, tone: 'bg-highlight/25 text-highlight-foreground' },
  ]

  return (
    <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map(({ label, value, delta, up, icon: Icon, tone }) => (
        <div key={label} className="rounded-2xl border bg-card p-5">
          <div className="flex items-start justify-between gap-3">
            <dt className="text-sm text-muted-foreground">{label}</dt>
            <span className={cn('flex size-9 shrink-0 items-center justify-center rounded-lg', tone)}>
              <Icon className="size-4.5" aria-hidden="true" />
            </span>
          </div>
          <dd className="mt-2 font-heading text-3xl font-semibold tracking-tight tabular-nums">{value}</dd>
          <dd className={cn('mt-1 flex items-center gap-1 text-xs', up ? 'text-success' : 'text-muted-foreground')}>
            {up ? <TrendingUp className="size-3.5" aria-hidden="true" /> : <TrendingDown className="size-3.5" aria-hidden="true" />}
            {delta}
          </dd>
        </div>
      ))}
    </dl>
  )
}
