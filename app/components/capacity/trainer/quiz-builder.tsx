'use client'

import { useState, type FormEvent } from 'react'
import { AlertTriangle, CalendarClock, CheckCircle2, Lock, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TRAINER_COURSES } from '@/lib/dashboard-data'
import { cn } from '@/lib/utils'
import { FormField, Panel, inputClass } from '@/components/capacity/form-field'

type Question = {
  id: number
  prompt: string
  options: string[]
  correct: number | null
  points: number
}

let nextId = 2

function blankQuestion(id: number): Question {
  return { id, prompt: '', options: ['', '', '', ''], correct: null, points: 5 }
}

function isQuestionComplete(q: Question) {
  return !!q.prompt.trim() && q.options.every((o) => o.trim()) && q.correct !== null && q.points > 0
}

export function QuizBuilder() {
  const [quizTitle, setQuizTitle] = useState('Module 4: Data Interpretation')
  const [course, setCourse] = useState(TRAINER_COURSES[1])
  const [deadline, setDeadline] = useState('2026-10-15T23:59')
  const [timeLimit, setTimeLimit] = useState(10)
  const [lockAfterDeadline, setLockAfterDeadline] = useState(true)
  const [questions, setQuestions] = useState<Question[]>([blankQuestion(1)])
  const [submitted, setSubmitted] = useState(false)
  const [published, setPublished] = useState(false)

  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0)
  const completeCount = questions.filter(isQuestionComplete).length
  const deadlineInPast = !!deadline && new Date(deadline).getTime() < Date.now()
  const deadlineError = submitted && (!deadline ? 'A deadline is required.' : deadlineInPast ? 'Deadline must be in the future.' : '')

  function updateQuestion(id: number, patch: Partial<Question>) {
    setPublished(false)
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, ...patch } : q)))
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitted(true)
    if (!quizTitle.trim() || !deadline || deadlineInPast || completeCount !== questions.length) return
    setPublished(true)
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-4 lg:grid-cols-3">
      <div className="flex flex-col gap-4 lg:col-span-2">
        <Panel title="Quiz settings">
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField label="Quiz title" htmlFor="quiz-title" error={submitted && !quizTitle.trim() ? 'Title is required.' : ''}>
              <input id="quiz-title" value={quizTitle} onChange={(e) => setQuizTitle(e.target.value)} className={inputClass} aria-invalid={submitted && !quizTitle.trim()} />
            </FormField>
            <FormField label="Linked course" htmlFor="quiz-course">
              <select id="quiz-course" value={course} onChange={(e) => setCourse(e.target.value)} className={inputClass}>
                {TRAINER_COURSES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </FormField>
            <FormField label="Strict deadline" htmlFor="quiz-deadline" error={deadlineError || undefined} hint="Submissions close at this exact time (IST).">
              <input
                id="quiz-deadline"
                type="datetime-local"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                aria-invalid={!!deadlineError}
                className={inputClass}
              />
            </FormField>
            <FormField label="Time limit (minutes)" htmlFor="quiz-time">
              <input
                id="quiz-time"
                type="number"
                min={1}
                max={180}
                value={timeLimit}
                onChange={(e) => setTimeLimit(Math.max(1, Number(e.target.value) || 1))}
                className={inputClass}
              />
            </FormField>
          </div>
          <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-lg bg-muted p-3">
            <input
              type="checkbox"
              checked={lockAfterDeadline}
              onChange={(e) => setLockAfterDeadline(e.target.checked)}
              className="mt-0.5 size-4 accent-[var(--primary)]"
            />
            <span className="text-sm">
              <span className="flex items-center gap-1.5 font-medium">
                <Lock className="size-3.5" aria-hidden="true" />
                Hard lock after deadline
              </span>
              <span className="text-muted-foreground">No late submissions or extensions will be accepted.</span>
            </span>
          </label>
        </Panel>

        {questions.map((q, index) => {
          const showErrors = submitted && !isQuestionComplete(q)
          return (
            <fieldset key={q.id} className={cn('rounded-2xl border bg-card p-5 md:p-6', showErrors && 'border-destructive/60')}>
              <legend className="sr-only">{`Question ${index + 1}`}</legend>
              <div className="mb-4 flex items-center justify-between gap-3">
                <span className="rounded-md bg-primary px-2 py-1 font-mono text-xs font-semibold text-primary-foreground">{`Q${index + 1}`}</span>
                <div className="flex items-center gap-2">
                  <label htmlFor={`points-${q.id}`} className="text-xs text-muted-foreground">
                    Points
                  </label>
                  <input
                    id={`points-${q.id}`}
                    type="number"
                    min={1}
                    max={100}
                    value={q.points}
                    onChange={(e) => updateQuestion(q.id, { points: Math.max(1, Number(e.target.value) || 1) })}
                    className={cn(inputClass, 'w-20 py-1.5')}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled={questions.length === 1}
                    onClick={() => setQuestions((prev) => prev.filter((x) => x.id !== q.id))}
                    aria-label={`Delete question ${index + 1}`}
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                  </Button>
                </div>
              </div>

              <textarea
                value={q.prompt}
                onChange={(e) => updateQuestion(q.id, { prompt: e.target.value })}
                placeholder="Type your question..."
                rows={2}
                aria-label={`Question ${index + 1} prompt`}
                className={cn(inputClass, 'resize-y')}
              />

              <p className="mb-2 mt-4 text-xs font-medium text-muted-foreground">Options · select the correct answer</p>
              <ul className="flex flex-col gap-2">
                {q.options.map((option, oi) => {
                  const isCorrect = q.correct === oi
                  return (
                    <li
                      key={oi}
                      className={cn('flex items-center gap-3 rounded-lg border px-3 py-1.5 transition', isCorrect && 'border-success bg-success/10')}
                    >
                      <input
                        type="radio"
                        name={`correct-${q.id}`}
                        checked={isCorrect}
                        onChange={() => updateQuestion(q.id, { correct: oi })}
                        aria-label={`Mark option ${String.fromCharCode(65 + oi)} as correct`}
                        className="size-4 accent-[var(--success)]"
                      />
                      <span className="font-mono text-xs text-muted-foreground">{String.fromCharCode(65 + oi)}</span>
                      <input
                        value={option}
                        onChange={(e) =>
                          updateQuestion(q.id, { options: q.options.map((o, i) => (i === oi ? e.target.value : o)) })
                        }
                        placeholder={`Option ${String.fromCharCode(65 + oi)}`}
                        aria-label={`Question ${index + 1} option ${String.fromCharCode(65 + oi)}`}
                        className="min-w-0 flex-1 bg-transparent py-1.5 text-sm outline-none placeholder:text-muted-foreground"
                      />
                      {isCorrect && <CheckCircle2 className="size-4 shrink-0 text-success" aria-hidden="true" />}
                    </li>
                  )
                })}
              </ul>
              {showErrors && (
                <p className="mt-3 flex items-center gap-1.5 text-xs text-destructive">
                  <AlertTriangle className="size-3.5" aria-hidden="true" />
                  Fill the question, all four options, and mark a correct answer.
                </p>
              )}
            </fieldset>
          )
        })}

        <Button
          type="button"
          variant="outline"
          className="border-dashed"
          onClick={() => {
            setPublished(false)
            setQuestions((prev) => [...prev, blankQuestion(nextId++)])
          }}
        >
          <Plus className="size-4" aria-hidden="true" />
          Add question
        </Button>
      </div>

      <aside className="flex flex-col gap-4 lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-2xl bg-primary p-5 text-primary-foreground">
          <h2 className="font-heading text-base font-semibold">Quiz summary</h2>
          <dl className="mt-4 grid grid-cols-2 gap-3">
            {[
              { label: 'Questions', value: questions.length },
              { label: 'Total points', value: totalPoints },
              { label: 'Time limit', value: `${timeLimit}m` },
              { label: 'Ready', value: `${completeCount}/${questions.length}` },
            ].map((s) => (
              <div key={s.label} className="rounded-lg bg-primary-foreground/10 p-3">
                <dt className="text-xs text-primary-foreground/70">{s.label}</dt>
                <dd className="mt-0.5 font-heading text-xl font-semibold">{s.value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 flex items-center gap-2 text-sm text-primary-foreground/80">
            <CalendarClock className="size-4 shrink-0 text-highlight" aria-hidden="true" />
            {deadline
              ? `Closes ${new Date(deadline).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}`
              : 'No deadline set'}
          </p>
          <Button type="submit" className="mt-5 w-full bg-highlight text-highlight-foreground hover:bg-highlight/90">
            Publish quiz
          </Button>
          {published && (
            <p role="status" className="mt-3 flex items-center gap-1.5 text-xs text-primary-foreground">
              <CheckCircle2 className="size-3.5 text-success" aria-hidden="true" />
              {`Published to "${course}"`}
            </p>
          )}
        </div>
      </aside>
    </form>
  )
}
