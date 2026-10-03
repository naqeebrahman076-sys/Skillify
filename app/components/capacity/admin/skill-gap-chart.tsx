'use client'

import { useMemo, useState } from 'react'
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { INSTITUTES, SKILL_GAP, SKILL_GAP_DOMAINS, type SkillGapDomain } from '@/lib/dashboard-data'
import { Panel, inputClass } from '@/components/capacity/form-field'
import { cn } from '@/lib/utils'

export function SkillGapChart() {
  const [domain, setDomain] = useState<SkillGapDomain>('All domains')

  const data = useMemo(
    () =>
      INSTITUTES.map((institute) => {
        const entries =
          domain === 'All domains' ? Object.values(SKILL_GAP[institute]) : [SKILL_GAP[institute][domain]]
        const current = Math.round(entries.reduce((s, e) => s + e.current, 0) / entries.length)
        const target = Math.round(entries.reduce((s, e) => s + e.target, 0) / entries.length)
        return { institute, current, target, gap: target - current }
      }),
    [domain],
  )

  const largest = data.reduce((a, b) => (b.gap > a.gap ? b : a))

  return (
    <Panel
      title="Skill Gap Analysis"
      description="Current workforce proficiency vs. target competency by institute."
      action={
        <select
          value={domain}
          onChange={(e) => setDomain(e.target.value as SkillGapDomain)}
          aria-label="Filter by domain"
          className={cn(inputClass, 'w-44')}
        >
          {SKILL_GAP_DOMAINS.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>
      }
    >
      <div className="h-72 w-full" role="img" aria-label={`Bar chart of skill proficiency for ${domain}. Largest gap at ${largest.institute}.`}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={4} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="var(--border)" />
            <XAxis dataKey="institute" tickLine={false} axisLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} />
            <YAxis domain={[0, 100]} tickLine={false} axisLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} unit="%" />
            <Tooltip
              cursor={{ fill: 'var(--muted)' }}
              contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }}
              formatter={(value, name) => [`${value}%`, name]}
            />
            <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="current" name="Current proficiency" fill="var(--accent)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="target" name="Target competency" fill="var(--primary)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <ul className="mt-4 grid grid-cols-5 gap-2">
        {data.map((d) => (
          <li
            key={d.institute}
            className={cn('rounded-lg p-2 text-center', d.institute === largest.institute ? 'bg-destructive/10 text-destructive' : 'bg-muted')}
          >
            <p className="text-[11px] font-medium opacity-80">{d.institute}</p>
            <p className="font-heading text-base font-semibold tabular-nums">{`-${d.gap}`}</p>
          </li>
        ))}
      </ul>
    </Panel>
  )
}
