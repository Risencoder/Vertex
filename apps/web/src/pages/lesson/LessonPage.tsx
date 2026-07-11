import { useEffect, useState, type ReactNode } from 'react'
import { Link, useParams } from 'react-router'

import {
  getLessonByModuleAndTechnologySlug,
  TechnologiesApiError,
  type LessonDetails,
} from '@/shared/api/technologies'
import { Button } from '@/shared/ui/button'
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
  const [lessonState, setLessonState] = useState<LessonState>({
    status: 'loading',
    data: null,
    error: '',
  })

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

  const backTo =
    technologySlug && moduleSlug
      ? `/technologies/${technologySlug}/modules/${moduleSlug}`
      : '/'

  return (
    <main className="min-h-screen bg-muted/30 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-4xl gap-6">
        <Button
          className="w-fit"
          nativeButton={false}
          render={<Link to={backTo} />}
          variant="outline"
        >
          Back to Module
        </Button>

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
                    {lessonState.data.lesson.type}
                  </span>
                  <span className="inline-flex rounded-lg border border-border bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                    {lessonState.data.lesson.difficulty}
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
    </main>
  )
}
