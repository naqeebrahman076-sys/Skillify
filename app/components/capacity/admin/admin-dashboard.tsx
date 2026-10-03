'use client'

import { useCallback, useState } from 'react'
import { UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Toast } from '@/components/capacity/toast'
import { StatCards } from './stat-cards'
import { SkillGapChart } from './skill-gap-chart'
import { TrainerAllocation } from './trainer-allocation'
import { BulkOnboardingModal } from './bulk-onboarding-modal'

export function AdminDashboard() {
  const [modalOpen, setModalOpen] = useState(false)
  const [activeUsers, setActiveUsers] = useState(12847)
  const [toast, setToast] = useState<number | null>(null)
  const dismissToast = useCallback(() => setToast(null), [])
  const closeModal = useCallback(() => setModalOpen(false), [])

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Admin console</p>
          <h1 className="font-heading text-2xl font-semibold tracking-tight md:text-3xl">Governance Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">Ministry of Earth Sciences · 5 institutes · Q3 FY 2026-27</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <UserPlus className="size-4" aria-hidden="true" />
          Bulk onboard employees
        </Button>
      </header>

      <StatCards activeUsers={activeUsers} />

      <div className="grid gap-4 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <SkillGapChart />
        </div>
        <div className="lg:col-span-2">
          <TrainerAllocation />
        </div>
      </div>

      <BulkOnboardingModal
        open={modalOpen}
        onClose={closeModal}
        onComplete={(count) => {
          setModalOpen(false)
          setActiveUsers((n) => n + count)
          setToast(count)
        }}
      />
      {toast !== null && (
        <Toast
          title="Onboarding complete"
          description={`${toast} legacy employee${toast === 1 ? '' : 's'} imported and invited to Capacity Connect.`}
          onDismiss={dismissToast}
        />
      )}
    </div>
  )
}
