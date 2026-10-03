'use client'

import { useCallback, useState } from 'react'
import { ProfileHeader } from './profile-header'
import { CourseCatalog } from './course-catalog'
import { AssessmentModal } from './assessment-modal'

export function TraineeView() {
  const [assessmentOpen, setAssessmentOpen] = useState(false)
  const open = useCallback(() => setAssessmentOpen(true), [])
  const close = useCallback(() => setAssessmentOpen(false), [])

  return (
    <>
      <ProfileHeader onStartAssessment={open} />
      <CourseCatalog onTakeAssessment={open} />
      <AssessmentModal open={assessmentOpen} onClose={close} />
    </>
  )
}
