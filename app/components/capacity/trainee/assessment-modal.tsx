'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { AlarmClock, ArrowLeft, ArrowRight, CheckCircle2, RotateCcw, Trophy, X, XCircle } from 'lucide-react'
import { ASSESSMENT } from '@/lib/data'
import { cn } from '@/lib/utils'

type AssessmentModalProps = {
  open: boolean
  onClose: () => void
}

function formatTime(total: number) {
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function AssessmentModal({ open, onClose }: AssessmentModalProps) {
  if (!open) return null
  return <AssessmentDialog onClose={onClose} />
}

function AssessmentDialog({ onClose }: { onClose: () => void }) {
  const { questions, durationSeconds, answerKey } = ASSESSMENT
  const [timeLeft, setTimeLeft] = useState(durationSeconds)
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [submitted, setSubmitted] = useState<null | { auto: boolean }>(null)
  const dialogRef = useRef<HTMLDivElement>(null)

  const submit = useCallback((auto = false) => setSubmitted({ auto }), [])

  useEffect(() => {
    if (submitted) return
    const id = setInterval(() => setTimeLeft((t) => Math.max(0, t - 1)), 1000)
    return () => clearInterval(id)
  }, [submitted])

  useEffect(() => {
    if (timeLeft === 0 && !submitted) submit(true)
  }, [timeLeft, submitted, submit])

  useEffect(() => {
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialogRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  const question = questions[current]
  const answeredCount = Object.keys(answers).length
  const progress = (answeredCount / questions.length) * 100
  const timePct = (timeLeft / durationSeconds) * 100
  const urgent = timeLeft <= 60
  const warning = timeLeft <= 180

  const score = questions.filter((q) => answers[q.id] === answerKey[q.id]).length
  const scorePct = Math.round((score / questions.length) * 100)
  const passed = scorePct >= 60

  const restart = () => {
    setAnswers({})
    setCurrent(0)
    setTimeLeft(durationSeconds)
    setSubmitted(null)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-primary/60 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="assessment-title"
        tabIndex={-1}
        className="flex max-h-[95dvh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl bg-card shadow-2xl outline-none sm:rounded-2xl"
      >
        <div className="flex items-start justify-between gap-4 border-b p-5">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wider text-accent">{ASSESSMENT.subtitle}</p>
            <h2 id="assessment-title" className="mt-1 font-heading text-lg font-semibold text-balance">
              {ASSESSMENT.title}
            </h2>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {!submitted && (
              <div
                role="timer"
                aria-live="off"
                aria-label={`Time remaining ${formatTime(timeLeft)}`}
                className={cn(
                  'flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-mono text-lg font-semibold tabular-nums',
                  urgent
                    ? 'animate-pulse bg-destructive/10 text-destructive'
                    : warning
                      ? 'bg-highlight/25 text-highlight-foreground'
                      : 'bg-muted text-foreground',
                )}
              >
                <AlarmClock className="size-4" aria-hidden="true" />
                {formatTime(timeLeft)}
              </div>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close assessment"
              className="flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {!submitted ? (
          <>
            <div className="border-b px-5 py-4">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>
                  Question {current + 1} of {questions.length}
                </span>
                <span>
                  {answeredCount}/{questions.length} answered
                </span>
              </div>
              <div
                className="mt-2 h-2 overflow-hidden rounded-full bg-muted"
                role="progressbar"
                aria-label="Answered questions"
                aria-valuenow={answeredCount}
                aria-valuemin={0}
                aria-valuemax={questions.length}
              >
                <div className="h-full rounded-full bg-accent transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
              <div className="mt-1 h-0.5 overflow-hidden rounded-full bg-muted" aria-hidden="true">
                <div
                  className={cn('h-full transition-all duration-1000 ease-linear', urgent ? 'bg-destructive' : 'bg-highlight')}
                  style={{ width: `${timePct}%` }}
                />
              </div>
              <nav aria-label="Jump to question" className="mt-3 flex gap-1.5">
                {questions.map((q, i) => (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => setCurrent(i)}
                    aria-label={`Question ${i + 1}${answers[q.id] !== undefined ? ', answered' : ''}`}
                    aria-current={i === current ? 'step' : undefined}
                    className={cn(
                      'size-8 rounded-md text-xs font-semibold transition-colors',
                      i === current
                        ? 'bg-primary text-primary-foreground'
                        : answers[q.id] !== undefined
                          ? 'bg-accent/15 text-accent'
                          : 'bg-muted text-muted-foreground hover:bg-secondary',
                    )}
                  >
                    {i + 1}
                  </button>
                ))}
              </nav>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
            <fieldset>
              <legend className="mb-4 text-base font-medium leading-relaxed text-pretty">{question.prompt}</legend>
              <div className="flex flex-col gap-2.5">
                {question.options.map((opt, i) => {
                  const checked = answers[question.id] === i
                  return (
                    <label
                      key={opt}
                      className={cn(
                        'flex cursor-pointer items-center gap-3 rounded-xl border p-4 text-sm transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring',
                        checked ? 'border-accent bg-accent/10' : 'hover:border-accent/50 hover:bg-muted',
                      )}
                    >
                      <input
                        type="radio"
                        name={question.id}
                        value={i}
                        checked={checked}
                        onChange={() => setAnswers((a) => ({ ...a, [question.id]: i }))}
                        className="size-4 accent-[var(--accent)]"
                      />
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-semibold text-muted-foreground">
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span>{opt}</span>
                    </label>
                  )
                })}
              </div>
            </fieldset>
            </div>

            <div className="flex items-center justify-between gap-3 border-t p-5">
              <button
                type="button"
                onClick={() => setCurrent((c) => c - 1)}
                disabled={current === 0}
                className="flex items-center gap-1.5 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
              >
                <ArrowLeft className="size-4" aria-hidden="true" />
                Previous
              </button>
              {current < questions.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrent((c) => c + 1)}
                  className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  Next
                  <ArrowRight className="size-4" aria-hidden="true" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => submit(false)}
                  className="rounded-lg bg-accent px-5 py-2 text-sm font-semibold text-accent-foreground hover:bg-accent/90"
                >
                  Submit Quiz
                  {answeredCount < questions.length && (
                    <span className="ml-1 font-normal opacity-80">({questions.length - answeredCount} unanswered)</span>
                  )}
                </button>
              )}
            </div>
          </>
        ) : (
          <div className="overflow-y-auto p-6 text-center" aria-live="polite">
            <div
              className={cn(
                'mx-auto flex size-16 items-center justify-center rounded-full',
                passed ? 'bg-success/15 text-success' : 'bg-destructive/10 text-destructive',
              )}
            >
              <Trophy className="size-8" aria-hidden="true" />
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              {submitted.auto ? 'Time is up. Your answers were submitted automatically.' : 'Assessment submitted.'}
            </p>
            <p className="mt-1 font-heading text-4xl font-semibold">{scorePct}%</p>
            <p className="mt-1 font-medium">
              {score} of {questions.length} correct · {passed ? 'Passed, certificate unlocked' : 'Not passed, 60% required'}
            </p>

            <ul className="mx-auto mt-6 flex max-w-md flex-col gap-2 text-left">
              {questions.map((q, i) => {
                const correct = answers[q.id] === answerKey[q.id]
                return (
                  <li key={q.id} className="flex items-start gap-2.5 rounded-lg bg-muted p-3 text-sm">
                    {correct ? (
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" aria-label="Correct" />
                    ) : (
                      <XCircle className="mt-0.5 size-4 shrink-0 text-destructive" aria-label="Incorrect" />
                    )}
                    <span>
                      <span className="font-medium">Q{i + 1}.</span> {q.options[answerKey[q.id]]}
                    </span>
                  </li>
                )
              })}
            </ul>

            <div className="mt-6 flex justify-center gap-3">
              <button
                type="button"
                onClick={restart}
                className="flex items-center gap-1.5 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted"
              >
                <RotateCcw className="size-4" aria-hidden="true" />
                Retake
              </button>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Back to dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
