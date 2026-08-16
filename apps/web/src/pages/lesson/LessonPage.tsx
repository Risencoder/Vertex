import { useEffect, useState, type ReactNode } from 'react'
import { Link, useParams } from 'react-router'

import { useRootLayout } from '@/app/layouts/use-root-layout'
import {
  completeLesson,
  getLessonProgress,
  LessonProgressApiError,
  type LessonProgress,
} from '@/shared/api/lesson-progress'
import {
  getLessonByModuleAndTechnologySlug,
  TechnologiesApiError,
  type LessonDetails,
} from '@/shared/api/technologies'
import { formatDifficulty, formatLessonType } from '@/shared/lib/labels'
import { Button } from '@/shared/ui/button'
import { Breadcrumbs } from '@/shared/ui/breadcrumbs'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card'
import {
  PageErrorState,
  PageLoadingState,
  PageNotFoundState,
} from '@/shared/ui/page-state'

type LessonState =
  | {
      status: 'loading'
      data: null
      error: string
    }
  | {
      status: 'success'
      data: LessonDetails
      error: string
    }
  | {
      status: 'not-found'
      data: null
      error: string
    }
  | {
      status: 'error'
      data: null
      error: string
    }

type ProgressState =
  | {
      status: 'idle'
      data: null
      error: string
    }
  | {
      status: 'loading'
      data: null
      error: string
    }
  | {
      status: 'success'
      data: LessonProgress
      error: string
    }
  | {
      status: 'error'
      data: null
      error: string
    }

const predictionOptions = [
  {
    id: 'increment-once',
    label: 'The button always shows "Clicked 1 time".',
    feedback:
      'This would be true if count were a regular variable recreated on every render. React preserves useState values between renders, so the count can keep increasing.',
  },
  {
    id: 'increment-each-click',
    label: 'The number increases by 1 after every click.',
    feedback:
      'Correct. setCount schedules a render with the next value, and React preserves that state for the component between renders.',
  },
  {
    id: 'no-change',
    label: 'The number stays at 0 because count is a const.',
    feedback:
      'A const prevents reassignment within one render, but setCount does not reassign count. It gives React a new state value to use on the next render.',
  },
] as const

type PredictionOptionId = (typeof predictionOptions)[number]['id']

const lessonFlowSteps = [
  { id: 'predict', label: 'Predict' },
  { id: 'learn', label: 'Learn' },
  { id: 'practice', label: 'Practice' },
  { id: 'reflect', label: 'Reflect' },
] as const

type LessonFlowStepId = (typeof lessonFlowSteps)[number]['id']

const notificationToggleStarterCode = `import { useState } from 'react'

export function NotificationToggle() {
  // TODO: create local state for whether notifications are enabled.

  function handleToggle() {
    // TODO: update state to the opposite value.
  }

  return (
    <section aria-labelledby="notification-heading">
      <h2 id="notification-heading">Notifications</h2>

      <p>
        {/* TODO: show whether notifications are enabled or disabled. */}
      </p>

      <button onClick={handleToggle} type="button">
        {/* TODO: show a different label for each state. */}
      </button>
    </section>
  )
}`

const defaultPracticeStarterCode = `// Use this space for your practice solution.
// Keep the code focused on this lesson's Practice Task.

export function PracticeAttempt() {
  // TODO: write your component or function here.

  return null
}`

function getPracticeStarterCode(currentLessonSlug?: string) {
  if (currentLessonSlug === 'local-state-with-usestate') {
    return notificationToggleStarterCode
  }

  return defaultPracticeStarterCode
}

function getMarkdownBeforeSection(markdown: string, sectionHeading: string) {
  const lines = markdown.split('\n')
  const sectionIndex = lines.findIndex((line) => line.trim() === sectionHeading)

  if (sectionIndex === -1) {
    return markdown
  }

  return lines.slice(0, sectionIndex).join('\n').trim()
}

function getMarkdownSection(markdown: string, sectionHeading: string) {
  const lines = markdown.split('\n')
  const sectionIndex = lines.findIndex((line) => line.trim() === sectionHeading)

  if (sectionIndex === -1) {
    return ''
  }

  const nextSectionIndex = lines.findIndex(
    (line, index) => index > sectionIndex && /^## \d+\./.test(line.trim()),
  )

  return lines
    .slice(sectionIndex, nextSectionIndex === -1 ? undefined : nextSectionIndex)
    .join('\n')
    .trim()
}

function LessonStepProgress({
  currentStep,
  hasPredictionStep,
}: {
  currentStep: LessonFlowStepId
  hasPredictionStep: boolean
}) {
  const visibleSteps = hasPredictionStep
    ? lessonFlowSteps
    : lessonFlowSteps.filter((step) => step.id !== 'predict')
  const currentStepIndex = visibleSteps.findIndex(
    (step) => step.id === currentStep,
  )

  return (
    <nav aria-label="Lesson steps" className="border-b py-6">
      <ol
        className={`grid gap-3 ${hasPredictionStep ? 'sm:grid-cols-4' : 'sm:grid-cols-3'}`}
      >
        {visibleSteps.map((step, index) => {
          const isCurrent = step.id === currentStep
          const isComplete = index < currentStepIndex

          return (
            <li key={step.id}>
              <div
                aria-current={isCurrent ? 'step' : undefined}
                className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-sm font-medium ${
                  isCurrent
                    ? 'border-primary bg-primary/5 text-primary'
                    : isComplete
                      ? 'border-border bg-muted/50 text-card-foreground'
                      : 'border-border bg-background text-muted-foreground'
                }`}
              >
                <span
                  className={`grid size-7 shrink-0 place-items-center rounded-full border text-xs ${
                    isCurrent
                      ? 'border-primary bg-primary text-primary-foreground'
                      : isComplete
                        ? 'border-card-foreground bg-card-foreground text-background'
                        : 'border-border bg-background'
                  }`}
                >
                  {index + 1}
                </span>
                <span>{step.label}</span>
              </div>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

function renderMarkdown(markdown: string) {
  const blocks: ReactNode[] = []
  const lines = markdown.split('\n')
  let paragraph: string[] = []
  let code: string[] = []
  let listItems: string[] = []
  let listType: 'ordered' | 'unordered' | null = null
  let isCodeBlock = false

  function flushParagraph(key: string) {
    if (paragraph.length === 0) {
      return
    }

    blocks.push(
      <p key={key} className="text-base leading-8 text-card-foreground/90">
        {paragraph.join(' ')}
      </p>,
    )
    paragraph = []
  }

  function flushList(key: string) {
    if (listItems.length === 0 || !listType) {
      return
    }

    const className =
      listType === 'ordered'
        ? 'list-decimal space-y-2 pl-5 text-base leading-8 text-card-foreground/90'
        : 'list-disc space-y-2 pl-5 text-base leading-8 text-card-foreground/90'

    const items = listItems.map((item, itemIndex) => (
      <li key={`${key}-${itemIndex}`}>{item}</li>
    ))

    blocks.push(
      listType === 'ordered' ? (
        <ol key={key} className={className}>
          {items}
        </ol>
      ) : (
        <ul key={key} className={className}>
          {items}
        </ul>
      ),
    )

    listItems = []
    listType = null
  }

  lines.forEach((line, index) => {
    const trimmedLine = line.trim()
    const unorderedListMatch = /^[-*]\s+(.+)/.exec(trimmedLine)
    const orderedListMatch = /^\d+\.\s+(.+)/.exec(trimmedLine)

    if (trimmedLine.startsWith('```')) {
      if (isCodeBlock) {
        blocks.push(
          <pre
            key={`code-${index}`}
            className="overflow-x-auto rounded-lg border bg-muted p-4 text-sm leading-6"
          >
            <code>{code.join('\n')}</code>
          </pre>,
        )
        code = []
        isCodeBlock = false
        return
      }

      flushParagraph(`paragraph-before-code-${index}`)
      flushList(`list-before-code-${index}`)
      isCodeBlock = true
      return
    }

    if (isCodeBlock) {
      code.push(line)
      return
    }

    if (trimmedLine === '') {
      flushParagraph(`paragraph-${index}`)
      flushList(`list-${index}`)
      return
    }

    if (trimmedLine.startsWith('# ')) {
      flushParagraph(`paragraph-before-heading-${index}`)
      flushList(`list-before-heading-${index}`)
      blocks.push(
        <h1
          key={`heading-${index}`}
          className="font-heading text-2xl font-semibold leading-tight"
        >
          {trimmedLine.slice(2)}
        </h1>,
      )
      return
    }

    if (trimmedLine.startsWith('## ')) {
      flushParagraph(`paragraph-before-subheading-${index}`)
      flushList(`list-before-subheading-${index}`)
      blocks.push(
        <h2
          key={`subheading-${index}`}
          className="pt-2 font-heading text-xl font-semibold leading-tight"
        >
          {trimmedLine.slice(3)}
        </h2>,
      )
      return
    }

    if (trimmedLine.startsWith('### ')) {
      flushParagraph(`paragraph-before-small-heading-${index}`)
      flushList(`list-before-small-heading-${index}`)
      blocks.push(
        <h3
          key={`small-heading-${index}`}
          className="pt-1 font-heading text-lg font-semibold leading-tight"
        >
          {trimmedLine.slice(4)}
        </h3>,
      )
      return
    }

    if (unorderedListMatch) {
      flushParagraph(`paragraph-before-list-${index}`)

      if (listType && listType !== 'unordered') {
        flushList(`list-before-unordered-${index}`)
      }

      listType = 'unordered'
      listItems.push(unorderedListMatch[1])
      return
    }

    if (orderedListMatch) {
      flushParagraph(`paragraph-before-list-${index}`)

      if (listType && listType !== 'ordered') {
        flushList(`list-before-ordered-${index}`)
      }

      listType = 'ordered'
      listItems.push(orderedListMatch[1])
      return
    }

    paragraph.push(trimmedLine)
  })

  flushParagraph('paragraph-final')
  flushList('list-final')

  if (code.length > 0) {
    blocks.push(
      <pre
        key="code-final"
        className="overflow-x-auto rounded-lg border bg-muted p-4 text-sm leading-6"
      >
        <code>{code.join('\n')}</code>
      </pre>,
    )
  }

  return blocks
}

function getEstimatedReadingTime(content: string) {
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length

  if (wordCount === 0) {
    return 'Short read'
  }

  return `${Math.max(3, Math.ceil(wordCount / 180))} min read`
}

export function LessonPage() {
  const { lessonSlug, moduleSlug, technologySlug } = useParams()
  const { session } = useRootLayout()
  const [lessonState, setLessonState] = useState<LessonState>({
    status: 'loading',
    data: null,
    error: '',
  })
  const [progressState, setProgressState] = useState<ProgressState>({
    status: 'idle',
    data: null,
    error: '',
  })
  const [isCompletingLesson, setIsCompletingLesson] = useState(false)
  const [predictionAnswer, setPredictionAnswer] =
    useState<PredictionOptionId | null>(null)
  const [isPredictionRevealed, setIsPredictionRevealed] = useState(false)
  const [lessonFlowStep, setLessonFlowStep] =
    useState<LessonFlowStepId>('learn')
  const [practiceAttempt, setPracticeAttempt] = useState(
    getPracticeStarterCode(),
  )
  const [isPracticeAttemptSaved, setIsPracticeAttemptSaved] = useState(false)
  const [reflectionAnswer, setReflectionAnswer] = useState('')
  const [isReflectionAccepted, setIsReflectionAccepted] = useState(false)

  useEffect(() => {
    const abortController = new AbortController()

    async function loadLesson() {
      if (!technologySlug || !moduleSlug || !lessonSlug) {
        setLessonState({
          status: 'not-found',
          data: null,
          error: 'Lesson not found.',
        })
        return
      }

      setLessonState({
        status: 'loading',
        data: null,
        error: '',
      })
      setProgressState({
        status: 'idle',
        data: null,
        error: '',
      })
      const startsWithPrediction =
        technologySlug === 'react' &&
        moduleSlug === 'state-and-events' &&
        lessonSlug === 'local-state-with-usestate'

      setPredictionAnswer(null)
      setIsPredictionRevealed(false)
      setLessonFlowStep(startsWithPrediction ? 'predict' : 'learn')
      setPracticeAttempt(getPracticeStarterCode(lessonSlug))
      setIsPracticeAttemptSaved(false)
      setReflectionAnswer('')
      setIsReflectionAccepted(false)

      try {
        const lessonDetails = await getLessonByModuleAndTechnologySlug(
          technologySlug,
          moduleSlug,
          lessonSlug,
          abortController.signal,
        )

        setLessonState({
          status: 'success',
          data: lessonDetails,
          error: '',
        })
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return
        }

        if (error instanceof TechnologiesApiError && error.status === 404) {
          setLessonState({
            status: 'not-found',
            data: null,
            error: 'Lesson not found.',
          })
          return
        }

        setLessonState({
          status: 'error',
          data: null,
          error: 'Unable to load lesson. Please try again later.',
        })
      }
    }

    void loadLesson()

    return () => {
      abortController.abort()
    }
  }, [lessonSlug, moduleSlug, technologySlug])

  useEffect(() => {
    const abortController = new AbortController()

    async function loadProgress() {
      if (lessonState.status !== 'success') {
        setProgressState({
          status: 'idle',
          data: null,
          error: '',
        })
        return
      }

      if (session.isPending) {
        return
      }

      if (!session.data) {
        setProgressState({
          status: 'idle',
          data: null,
          error: '',
        })
        return
      }

      setProgressState({
        status: 'loading',
        data: null,
        error: '',
      })

      try {
        const progress = await getLessonProgress(
          lessonState.data.lesson.id,
          abortController.signal,
        )

        setProgressState({
          status: 'success',
          data: progress,
          error: '',
        })
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return
        }

        if (error instanceof LessonProgressApiError && error.status === 401) {
          setProgressState({
            status: 'idle',
            data: null,
            error: '',
          })
          return
        }

        setProgressState({
          status: 'error',
          data: null,
          error: 'Unable to load lesson progress. Please try again later.',
        })
      }
    }

    void loadProgress()

    return () => {
      abortController.abort()
    }
  }, [lessonState, session.data, session.isPending])

  async function handleCompleteLesson(lessonId: string) {
    if (isCompletingLesson) {
      return
    }

    setIsCompletingLesson(true)
    setProgressState((currentState) => {
      if (currentState.status === 'success') {
        return {
          status: 'success',
          data: currentState.data,
          error: '',
        }
      }

      return {
        status: 'loading',
        data: null,
        error: '',
      }
    })

    try {
      const progress = await completeLesson(lessonId)

      setProgressState({
        status: 'success',
        data: progress,
        error: '',
      })
    } catch (error) {
      const message =
        error instanceof LessonProgressApiError && error.status === 401
          ? 'Sign in to track your progress.'
          : 'Unable to complete lesson. Please try again later.'

      setProgressState({
        status: 'error',
        data: null,
        error: message,
      })
    } finally {
      setIsCompletingLesson(false)
    }
  }

  const lessonDetails =
    lessonState.status === 'success' ? lessonState.data : null
  const estimatedReadingTime = lessonDetails
    ? getEstimatedReadingTime(lessonDetails.lesson.content ?? '')
    : null
  const isLessonCompleted = progressState.data?.status === 'COMPLETED'
  const usesStepLessonFlow =
    technologySlug === 'react' && moduleSlug === 'state-and-events'
  const hasPredictionStep =
    usesStepLessonFlow && lessonSlug === 'local-state-with-usestate'
  const selectedPrediction = predictionOptions.find(
    (option) => option.id === predictionAnswer,
  )
  const lessonMarkdown = lessonDetails?.lesson.content ?? ''
  const stepLessonLearnMarkdown = getMarkdownBeforeSection(
    lessonMarkdown,
    '## 7. Practice Task',
  )
  const stepLessonPracticeMarkdown = getMarkdownSection(
    lessonMarkdown,
    '## 7. Practice Task',
  )
  const stepLessonReflectionMarkdown = getMarkdownSection(
    lessonMarkdown,
    '## 9. Reflection',
  )
  const canSavePracticeAttempt = practiceAttempt.trim().length > 0
  const reflectionText = reflectionAnswer.trim()
  const reflectionCharacterCount = reflectionText.length
  const reflectionWordCount = reflectionText.split(/\s+/).filter(Boolean).length
  const canAcceptReflection =
    reflectionCharacterCount >= 40 && reflectionWordCount >= 6
  const canUseLessonFinishFlow = !usesStepLessonFlow || isReflectionAccepted

  return (
    <div className="grid gap-6">
      <Breadcrumbs
        items={[
          { label: 'Dashboard', to: '/' },
          {
            label:
              lessonState.status === 'success'
                ? lessonState.data.technology.title
                : 'Technology',
            to: technologySlug ? `/technologies/${technologySlug}` : '/',
          },
          {
            label:
              lessonState.status === 'success'
                ? lessonState.data.module.title
                : 'Module',
            to:
              technologySlug && moduleSlug
                ? `/technologies/${technologySlug}/modules/${moduleSlug}`
                : '/',
          },
          {
            label:
              lessonState.status === 'success'
                ? lessonState.data.lesson.title
                : 'Lesson',
          },
        ]}
      />
      {lessonState.status === 'loading' ? (
        <PageLoadingState message="Loading lesson..." />
      ) : null}

      {lessonState.status === 'not-found' ? (
        <PageNotFoundState
          description="The lesson may be unavailable, unpublished, or outside this module."
          message={lessonState.error}
          title="Lesson not found"
        />
      ) : null}

      {lessonState.status === 'error' ? (
        <PageErrorState message={lessonState.error} />
      ) : null}

      {lessonDetails ? (
        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_19rem] xl:items-start">
          <main className="min-w-0">
            <section className="border-b pb-8">
              <div className="grid gap-5">
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  <span>{lessonDetails.technology.title}</span>
                  <span aria-hidden="true">/</span>
                  <span>{lessonDetails.module.title}</span>
                </div>
                <div className="grid gap-3">
                  <h1 className="max-w-4xl font-heading text-4xl leading-tight font-semibold text-balance">
                    {lessonDetails.lesson.title}
                  </h1>
                  <p className="max-w-3xl text-lg leading-8 text-muted-foreground">
                    {lessonDetails.lesson.description}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex rounded-full border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
                    {estimatedReadingTime}
                  </span>
                  <span className="inline-flex rounded-full border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
                    {formatDifficulty(lessonDetails.lesson.difficulty)}
                  </span>
                  <span className="inline-flex rounded-full border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
                    {formatLessonType(lessonDetails.lesson.type)}
                  </span>
                  <span className="inline-flex rounded-full border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
                    {isLessonCompleted ? 'Completed' : 'In progress'}
                  </span>
                </div>
              </div>
            </section>

            <section
              aria-labelledby="lesson-goal-heading"
              className="border-b py-8"
            >
              <div className="grid max-w-3xl gap-3">
                <h2
                  className="font-heading text-2xl font-semibold leading-tight"
                  id="lesson-goal-heading"
                >
                  Lesson goal
                </h2>
                <p className="text-base leading-8 text-muted-foreground">
                  {lessonDetails.lesson.description}
                </p>
              </div>
            </section>

            {usesStepLessonFlow ? (
              <LessonStepProgress
                currentStep={lessonFlowStep}
                hasPredictionStep={hasPredictionStep}
              />
            ) : null}

            {hasPredictionStep && lessonFlowStep === 'predict' ? (
              <section
                aria-labelledby="prediction-heading"
                className="border-b py-8"
              >
                <Card className="max-w-3xl bg-muted/20">
                  <CardHeader>
                    <CardDescription>Before you continue</CardDescription>
                    <CardTitle id="prediction-heading">
                      What happens each time the button is clicked?
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-5">
                    <pre className="overflow-x-auto rounded-lg border bg-background p-4 text-sm leading-6">
                      <code>{`function Counter() {
  const [count, setCount] = useState(0)

  return (
    <button onClick={() => setCount(count + 1)}>
      Clicked {count} times
    </button>
  )
}`}</code>
                    </pre>

                    <fieldset className="grid gap-3">
                      <legend className="sr-only">
                        Choose what the counter displays after each click
                      </legend>
                      {predictionOptions.map((option) => (
                        <label
                          className="flex cursor-pointer items-start gap-3 rounded-lg border bg-background p-4 text-sm leading-6 transition-colors hover:bg-muted/50 has-checked:border-primary has-checked:ring-2 has-checked:ring-primary/20"
                          key={option.id}
                        >
                          <input
                            checked={predictionAnswer === option.id}
                            className="mt-1 size-4 accent-primary"
                            name="use-state-prediction"
                            onChange={() => {
                              setPredictionAnswer(option.id)
                              setIsPredictionRevealed(false)
                            }}
                            type="radio"
                            value={option.id}
                          />
                          <span>{option.label}</span>
                        </label>
                      ))}
                    </fieldset>

                    {isPredictionRevealed && selectedPrediction ? (
                      <div
                        aria-live="polite"
                        className="grid gap-2 rounded-lg border bg-background p-4"
                        role="status"
                      >
                        <p className="font-medium">
                          {selectedPrediction.id === 'increment-each-click'
                            ? 'That is right'
                            : 'Not quite'}
                        </p>
                        <p className="text-sm leading-6 text-muted-foreground">
                          {selectedPrediction.feedback}
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Choose an answer, then reveal the explanation.
                      </p>
                    )}
                  </CardContent>
                  <CardFooter>
                    {isPredictionRevealed ? (
                      <Button
                        onClick={() => setLessonFlowStep('learn')}
                        type="button"
                      >
                        Continue to Learn
                      </Button>
                    ) : (
                      <Button
                        disabled={!predictionAnswer}
                        onClick={() => setIsPredictionRevealed(true)}
                        type="button"
                      >
                        Reveal explanation
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              </section>
            ) : null}

            {!usesStepLessonFlow || lessonFlowStep === 'learn' ? (
              <section
                aria-labelledby="lesson-content-heading"
                className="border-b py-8"
              >
                <div className="grid gap-6">
                  <div className="grid max-w-3xl gap-2">
                    <h2
                      className="font-heading text-2xl font-semibold leading-tight"
                      id="lesson-content-heading"
                    >
                      Lesson content
                    </h2>
                  </div>
                  <article className="grid max-w-3xl gap-5">
                    {renderMarkdown(
                      usesStepLessonFlow
                        ? stepLessonLearnMarkdown
                        : (lessonDetails.lesson.content ?? ''),
                    )}
                  </article>
                  {usesStepLessonFlow ? (
                    <div className="max-w-3xl">
                      <Button
                        onClick={() => setLessonFlowStep('practice')}
                        type="button"
                      >
                        Continue to Practice
                      </Button>
                    </div>
                  ) : null}
                </div>
              </section>
            ) : null}

            {usesStepLessonFlow && lessonFlowStep === 'practice' ? (
              <section
                aria-labelledby="golden-practice-heading"
                className="border-b py-8"
              >
                <Card className="max-w-3xl bg-muted/20">
                  <CardHeader>
                    <CardDescription>Apply the idea</CardDescription>
                    <CardTitle id="golden-practice-heading">Practice</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6">
                      <article className="grid gap-5">
                        {renderMarkdown(stepLessonPracticeMarkdown)}
                      </article>

                      <div className="grid gap-3 rounded-lg border bg-background p-4">
                        <div className="grid gap-1">
                          <label
                            className="text-sm font-medium"
                            htmlFor="notification-toggle-attempt"
                          >
                            Your coding attempt
                          </label>
                          <p
                            className="text-sm leading-6 text-muted-foreground"
                            id="notification-toggle-attempt-help"
                          >
                            Edit the starter code below. Save your attempt when
                            you have a version you would be ready to discuss.
                          </p>
                        </div>
                        <textarea
                          aria-describedby="notification-toggle-attempt-help"
                          className="min-h-80 w-full resize-y rounded-lg border bg-muted/30 p-4 font-mono text-sm leading-6 outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-ring"
                          id="notification-toggle-attempt"
                          onChange={(event) => {
                            setPracticeAttempt(event.target.value)
                            setIsPracticeAttemptSaved(false)
                          }}
                          spellCheck={false}
                          value={practiceAttempt}
                        />
                        {isPracticeAttemptSaved ? (
                          <p
                            className="text-sm font-medium text-primary"
                            role="status"
                          >
                            Attempt saved locally. You can continue to
                            reflection.
                          </p>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            Save your attempt before continuing to reflection.
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex-col items-start gap-3 sm:flex-row sm:items-center">
                    <Button
                      disabled={!canSavePracticeAttempt}
                      onClick={() => setIsPracticeAttemptSaved(true)}
                      type="button"
                      variant="outline"
                    >
                      Save attempt
                    </Button>
                    <Button
                      disabled={!isPracticeAttemptSaved}
                      onClick={() => setLessonFlowStep('reflect')}
                      type="button"
                    >
                      Continue to Reflect
                    </Button>
                  </CardFooter>
                </Card>
              </section>
            ) : null}

            {usesStepLessonFlow && lessonFlowStep === 'reflect' ? (
              <section
                aria-labelledby="golden-reflection-heading"
                className="border-b py-8"
              >
                <div className="grid max-w-3xl gap-6">
                  <div className="grid gap-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      Look back before moving on
                    </p>
                    <h2
                      className="font-heading text-2xl font-semibold leading-tight"
                      id="golden-reflection-heading"
                    >
                      Reflect
                    </h2>
                  </div>
                  <article className="grid gap-5">
                    {renderMarkdown(stepLessonReflectionMarkdown)}
                  </article>
                  <div className="grid gap-3 rounded-lg border bg-muted/20 p-4">
                    <div className="grid gap-1">
                      <label
                        className="text-sm font-medium"
                        htmlFor="lesson-reflection-answer"
                      >
                        Your reflection
                      </label>
                      <p
                        className="text-sm leading-6 text-muted-foreground"
                        id="lesson-reflection-answer-help"
                      >
                        Write a short answer in your own words. This is for
                        retrieval practice, not grading.
                      </p>
                    </div>
                    <textarea
                      aria-describedby="lesson-reflection-answer-help"
                      className="min-h-32 w-full resize-y rounded-lg border bg-background p-4 text-sm leading-6 outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-ring"
                      id="lesson-reflection-answer"
                      onChange={(event) => {
                        setReflectionAnswer(event.target.value)
                        setIsReflectionAccepted(false)
                      }}
                      value={reflectionAnswer}
                    />
                    {isReflectionAccepted ? (
                      <p
                        className="text-sm font-medium text-primary"
                        role="status"
                      >
                        Reflection saved locally.
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Write at least 6 words and 40 characters before saving.
                        Current: {reflectionWordCount} words,{' '}
                        {reflectionCharacterCount} characters.
                      </p>
                    )}
                    <div>
                      <Button
                        disabled={!canAcceptReflection || isReflectionAccepted}
                        onClick={() => setIsReflectionAccepted(true)}
                        type="button"
                        variant="outline"
                      >
                        {isReflectionAccepted
                          ? 'Reflection saved'
                          : 'Save reflection'}
                      </Button>
                    </div>
                  </div>
                </div>
              </section>
            ) : null}

            {!usesStepLessonFlow || lessonFlowStep === 'reflect' ? (
              <section
                aria-labelledby="lesson-practice-heading"
                className="border-b py-8"
              >
                <Card className="bg-muted/20">
                  <CardHeader>
                    <CardTitle id="lesson-practice-heading">
                      {usesStepLessonFlow ? 'Lesson progress' : 'Practice'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {usesStepLessonFlow && !isReflectionAccepted ? (
                      <p className="text-sm text-muted-foreground">
                        Save your reflection before marking this lesson
                        complete.
                      </p>
                    ) : null}

                    {session.isPending ? (
                      <p
                        className="text-sm text-muted-foreground"
                        role="status"
                      >
                        Checking your session...
                      </p>
                    ) : null}

                    {!session.isPending && !session.data ? (
                      <p className="text-sm text-muted-foreground">
                        Sign in to track your progress.
                      </p>
                    ) : null}

                    {session.data && progressState.status === 'loading' ? (
                      <p
                        className="text-sm text-muted-foreground"
                        role="status"
                      >
                        Loading lesson progress...
                      </p>
                    ) : null}

                    {progressState.status === 'error' ? (
                      <p className="text-sm text-destructive" role="alert">
                        {progressState.error}
                      </p>
                    ) : null}

                    {progressState.status === 'success' ? (
                      <p
                        className="text-sm text-muted-foreground"
                        role="status"
                      >
                        {isLessonCompleted ? 'Completed' : 'Not completed yet'}
                      </p>
                    ) : null}
                  </CardContent>
                  <CardFooter className="flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
                    {session.data ? (
                      <Button
                        disabled={
                          !canUseLessonFinishFlow ||
                          isCompletingLesson ||
                          progressState.status === 'loading' ||
                          isLessonCompleted
                        }
                        onClick={() => {
                          void handleCompleteLesson(lessonDetails.lesson.id)
                        }}
                      >
                        {isLessonCompleted
                          ? 'Completed'
                          : isCompletingLesson
                            ? 'Completing...'
                            : 'Mark as completed'}
                      </Button>
                    ) : (
                      <Button disabled>Mark as completed</Button>
                    )}
                  </CardFooter>
                </Card>
              </section>
            ) : null}

            {!usesStepLessonFlow ||
            (lessonFlowStep === 'reflect' && isReflectionAccepted) ? (
              <section aria-labelledby="lesson-next-heading" className="pt-8">
                <Card className="bg-background">
                  <CardHeader>
                    <CardTitle id="lesson-next-heading">Next lesson</CardTitle>
                  </CardHeader>
                  <CardFooter className="flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center">
                    {lessonDetails.previousLesson ? (
                      <Button
                        nativeButton={false}
                        render={
                          <Link
                            to={`/technologies/${lessonDetails.technology.slug}/modules/${lessonDetails.module.slug}/lessons/${lessonDetails.previousLesson.slug}`}
                          />
                        }
                        variant="outline"
                      >
                        Previous lesson
                      </Button>
                    ) : (
                      <Button disabled variant="outline">
                        Previous lesson
                      </Button>
                    )}

                    {lessonDetails.nextLesson ? (
                      <div className="grid gap-2 sm:justify-items-end">
                        <p className="text-sm text-muted-foreground">
                          Up next: {lessonDetails.nextLesson.title}
                        </p>
                        <Button
                          nativeButton={false}
                          render={
                            <Link
                              to={`/technologies/${lessonDetails.technology.slug}/modules/${lessonDetails.module.slug}/lessons/${lessonDetails.nextLesson.slug}`}
                            />
                          }
                        >
                          Continue to next lesson
                        </Button>
                      </div>
                    ) : (
                      <div className="grid gap-2 sm:justify-items-end">
                        <p className="text-sm text-muted-foreground">
                          You reached the end of this module.
                        </p>
                        <Button disabled>Next lesson</Button>
                      </div>
                    )}
                  </CardFooter>
                </Card>
              </section>
            ) : null}
          </main>

          <aside className="grid gap-4 xl:sticky xl:top-6">
            <Card size="sm">
              <CardHeader>
                <CardDescription>Lesson overview</CardDescription>
                <CardTitle>At a glance</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="grid gap-4 text-sm">
                  <div>
                    <dt className="text-muted-foreground">Estimated time</dt>
                    <dd className="font-medium">{estimatedReadingTime}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Module</dt>
                    <dd className="font-medium">
                      {lessonDetails.module.title}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Difficulty</dt>
                    <dd className="font-medium">
                      {formatDifficulty(lessonDetails.lesson.difficulty)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Progress</dt>
                    <dd className="font-medium">
                      {session.data
                        ? isLessonCompleted
                          ? 'Completed'
                          : 'Not completed'
                        : 'Sign in to track'}
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </aside>
        </div>
      ) : null}
    </div>
  )
}
