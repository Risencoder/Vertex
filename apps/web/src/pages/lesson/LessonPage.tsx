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
                  {renderMarkdown(lessonDetails.lesson.content ?? '')}
                </article>
              </div>
            </section>

            <section
              aria-labelledby="lesson-practice-heading"
              className="border-b py-8"
            >
              <Card className="bg-muted/20">
                <CardHeader>
                  <CardTitle id="lesson-practice-heading">Practice</CardTitle>
                </CardHeader>
                <CardContent>
                  {session.isPending ? (
                    <p className="text-sm text-muted-foreground" role="status">
                      Checking your session...
                    </p>
                  ) : null}

                  {!session.isPending && !session.data ? (
                    <p className="text-sm text-muted-foreground">
                      Sign in to track your progress.
                    </p>
                  ) : null}

                  {session.data && progressState.status === 'loading' ? (
                    <p className="text-sm text-muted-foreground" role="status">
                      Loading lesson progress...
                    </p>
                  ) : null}

                  {progressState.status === 'error' ? (
                    <p className="text-sm text-destructive" role="alert">
                      {progressState.error}
                    </p>
                  ) : null}

                  {progressState.status === 'success' ? (
                    <p className="text-sm text-muted-foreground" role="status">
                      {isLessonCompleted ? 'Completed' : 'Not completed yet'}
                    </p>
                  ) : null}
                </CardContent>
                <CardFooter className="flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
                  {session.data ? (
                    <Button
                      disabled={
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
