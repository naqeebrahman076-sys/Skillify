import { Megaphone } from 'lucide-react'

const ANNOUNCEMENTS = [
  'Upcoming Assessment: Data Analytics deadline Oct 15',
  'New course live: Responsible AI in Public Services',
  'Certificate verification portal maintenance on Oct 20, 22:00 IST',
  'Governance Week webinar series starts Nov 3',
]

export function AnnouncementTicker() {
  return (
    <div className="flex items-center overflow-hidden rounded-lg bg-white/5 ring-1 ring-white/10">
      <span className="flex shrink-0 items-center gap-1.5 bg-highlight px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-highlight-foreground">
        <Megaphone className="size-3.5" aria-hidden="true" />
        Live
      </span>
      <p className="sr-only">{ANNOUNCEMENTS.join('. ')}</p>
      <div
        className="group relative flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_24px,black_calc(100%-24px),transparent)]"
        aria-hidden="true"
      >
        <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
          {[...ANNOUNCEMENTS, ...ANNOUNCEMENTS].map((item, i) => (
            <span key={i} className="flex items-center gap-3 whitespace-nowrap px-4 py-1.5 text-sm text-primary-foreground/90">
              <span className="size-1.5 rounded-full bg-accent" />
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
