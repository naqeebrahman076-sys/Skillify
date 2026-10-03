'use client'

import { useState } from 'react'
import type { Role } from '@/lib/data'
import { TopNavbar } from '@/components/capacity/top-navbar'
import { TraineeView } from '@/components/capacity/trainee/trainee-view'
import { TrainerDashboard } from '@/components/capacity/trainer/trainer-dashboard'
import { AdminDashboard } from '@/components/capacity/admin/admin-dashboard'

export default function Page() {
  const [role, setRole] = useState<Role>('trainee')

  return (
    <div className="min-h-dvh">
      <TopNavbar role={role} onRoleChange={setRole} />
      <main className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
        {role === 'trainee' && <TraineeView />}
        {role === 'trainer' && <TrainerDashboard />}
        {role === 'admin' && <AdminDashboard />}
      </main>
    </div>
  )
}
