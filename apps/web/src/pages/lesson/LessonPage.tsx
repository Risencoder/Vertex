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
  let isCodeBlock = false

  function flushParagraph(key: string) {
    if (paragraph.length === 0) {
      return
    }

    blocks.push(
      <p key={key} className="text-sm leading-7 text-card-foreground">
        {paragraph.join(' ')}
      </p>,
    )
    paragraph = []
  }

  lines.forEach((line, index) => {
    const trimmedLine = line.trim()

    if (trimmedLine.startsWith('```')) {
      if (isCodeBlock) {
        blocks.push(
          <pre
            key={`code-${index}`}
            className="overflow-x-auto rounded-lg border bg-muted p-4 text-sm"
          >
            <code>{code.join('\n')}</code>
          </pre>,
        )
        code = []
        isCodeBlock = false
        return
      }

      flushParagraph(`paragraph-before-code-${index}`)
      isCodeBlock = true
      return
    }

    if (isCodeBlock) {
      code.push(line)
      return
    }

    if (trimmedLine === '') {
      flushParagraph(`paragraph-${index}`)
      return
    }

    if (trimmedLine.startsWith('# ')) {
      flushParagraph(`paragraph-before-heading-${index}`)
      blocks.push(
        <h1
          key={`heading-${index}`}
          className="font-heading text-2xl font-semibold"
        >
          {trimmedLine.slice(2)}
        </h1>,
      )
      return
    }

    if (trimmedLine.startsWith('## ')) {
      flushParagraph(`paragraph-before-subheading-${index}`)
      blocks.push(
        <h2
          key={`subheading-${index}`}
          className="font-heading text-xl font-semibold"
        >
          {trimmedLine.slice(3)}
        </h2>,
      )
      return
    }

    paragraph.push(trimmedLine)
  })

  flushParagraph('paragraph-final')

  if (code.length > 0) {
    blocks.push(
      <pre
        key="code-final"
        className="overflow-x-auto rounded-lg border bg-muted p-4 text-sm"
      >
        <code>{code.join('\n')}</code>
      </pre>,
    )
  }

  return blocks
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
        <Card>
          <CardContent>
            <p className="text-sm text-muted-foreground" role="status">
              Loading lesson...
            </p>
          </CardContent>
        </Card>
      ) : null}

      {lessonState.status === 'not-found' ? (
        <Card>
          <CardHeader>
            <CardTitle>Lesson not found</CardTitle>
            <CardDescription>
              The lesson may be unavailable, unpublished, or outside this
              module.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground" role="alert">
              {lessonState.error}
            </p>
          </CardContent>
        </Card>
      ) : null}

      {lessonState.status === 'error' ? (
        <Card>
          <CardContent>
            <p className="text-sm text-destructive" role="alert">
              {lessonState.error}
            </p>
          </CardContent>
        </Card>
      ) : null}

      {lessonState.status === 'success' ? (
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardDescription>
                {lessonState.data.technology.title} /{' '}
                {lessonState.data.module.title}
              </CardDescription>
              <CardTitle className="text-2xl">
                {lessonState.data.lesson.title}
              </CardTitle>
              <CardDescription>
                {lessonState.data.lesson.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex rounded-lg border border-border bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                  {formatLessonType(lessonState.data.lesson.type)}
                </span>
                <span className="inline-flex rounded-lg border border-border bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                  {formatDifficulty(lessonState.data.lesson.difficulty)}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <article className="grid gap-4">
                {renderMarkdown(lessonState.data.lesson.content ?? '')}
              </article>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Lesson progress</CardTitle>
              <CardDescription>
                Track completion for this lesson.
              </CardDescription>
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
                  {progressState.data.status === 'COMPLETED'
                    ? 'Completed'
                    : 'Not completed yet'}
                </p>
              ) : null}
            </CardContent>
            <CardFooter>
              {session.data ? (
                <Button
                  disabled={
                    isCompletingLesson ||
                    progressState.status === 'loading' ||
                    progressState.data?.status === 'COMPLETED'
                  }
                  onClick={() => {
                    void handleCompleteLesson(lessonState.data.lesson.id)
                  }}
                >
                  {progressState.data?.status === 'COMPLETED'
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

          <Card>
            <CardFooter className="justify-between gap-3">
              {lessonState.data.previousLesson ? (
                <Button
                  nativeButton={false}
                  render={
                    <Link
                      to={`/technologies/${lessonState.data.technology.slug}/modules/${lessonState.data.module.slug}/lessons/${lessonState.data.previousLesson.slug}`}
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

              {lessonState.data.nextLesson ? (
                <Button
                  nativeButton={false}
                  render={
                    <Link
                      to={`/technologies/${lessonState.data.technology.slug}/modules/${lessonState.data.module.slug}/lessons/${lessonState.data.nextLesson.slug}`}
                    />
                  }
                  variant="outline"
                >
                  Next lesson
                </Button>
              ) : (
                <Button disabled variant="outline">
                  Next lesson
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      ) : null}
    </div>
  )
}
