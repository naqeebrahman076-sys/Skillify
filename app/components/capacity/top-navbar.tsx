'use client'

import { Bell, GraduationCap, Presentation, ShieldCheck, Binary } from 'lucide-react'
import type { Role } from '@/lib/data'
import { cn } from '@/lib/utils'
import { AnnouncementTicker } from './announcement-ticker'

const ROLES: { value: Role; label: string; icon: typeof GraduationCap }[] = [
  { value: 'trainee', label: 'Trainee', icon: GraduationCap },
  { value: 'trainer', label: 'Trainer', icon: Presentation },
  { value: 'admin', label: 'Admin', icon: ShieldCheck },
]

type TopNavbarProps = {
  role: Role
  onRoleChange: (role: Role) => void
}

export function TopNavbar({ role, onRoleChange }: TopNavbarProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-primary text-primary-foreground">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-4 py-3 md:flex-nowrap md:px-6">
        <a href="#" className="flex shrink-0 items-center gap-3" aria-label="Capacity Connect by De-Cypher, home">
          <span className="flex size-10 items-center justify-center rounded-lg bg-accent text-accent-foreground shadow-inner">
            <Binary className="size-5" aria-hidden="true" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="font-heading text-lg font-semibold tracking-tight">Capacity Connect</span>
            <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-primary-foreground/60">
              by De-Cypher
            </span>
          </span>
        </a>

        <div className="order-3 w-full min-w-0 md:order-none md:flex-1">
          <AnnouncementTicker />
        </div>

        <div className="ml-auto flex items-center gap-3">
          <div
            role="tablist"
            aria-label="Switch role"
            className="flex items-center rounded-lg bg-white/10 p-1"
          >
            {ROLES.map(({ value, label, icon: Icon }) => {
              const active = role === value
              return (
                <button
                  key={value}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => onRoleChange(value)}
                  className={cn(
                    'flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-accent',
                    active
                      ? 'bg-card text-primary shadow-sm'
                      : 'text-primary-foreground/75 hover:bg-white/10 hover:text-primary-foreground',
                  )}
                >
                  <Icon className="size-4" aria-hidden="true" />
                  <span className="hidden sm:inline">{label}</span>
                  <span className="sr-only sm:hidden">{label}</span>
                </button>
              )
            })}
          </div>

          <button
            type="button"
            className="relative flex size-9 items-center justify-center rounded-lg text-primary-foreground/80 hover:bg-white/10 hover:text-primary-foreground"
            aria-label="Notifications, 3 unread"
          >
            <Bell className="size-5" aria-hidden="true" />
            <span className="absolute right-2 top-2 size-2 rounded-full bg-highlight" />
          </button>
        </div>
      </div>
    </header>
  )
}
