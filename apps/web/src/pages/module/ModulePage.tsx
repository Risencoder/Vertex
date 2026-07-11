import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'

import {
  getModuleByTechnologyAndSlug,
  TechnologiesApiError,
  type ModuleDetails,
  type ModuleLesson,
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

type ModuleState =
  | {
      status: 'loading'
      data: null
      error: string
    }
  | {
      status: 'success'
      data: ModuleDetails
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

function LessonCard({
  lesson,
  moduleSlug,
  technologySlug,
}: {
  lesson: ModuleLesson
  moduleSlug: string
  technologySlug: string
}) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle>{lesson.title}</CardTitle>
        <CardDescription>{lesson.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex rounded-lg border border-border bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
            {lesson.type}
          </span>
          <span className="inline-flex rounded-lg border border-border bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
            {lesson.difficulty}
          </span>
        </div>
      </CardContent>
      <CardFooter className="justify-start">
        <Button
          nativeButton={false}
          render={
            <Link
              to={`/technologies/${technologySlug}/modules/${moduleSlug}/lessons/${lesson.slug}`}
            />
          }
          variant="outline"
        >
          Open
        </Button>
      </CardFooter>
    </Card>
  )
}

export function ModulePage() {
  const { moduleSlug, technologySlug } = useParams()
  const [moduleState, setModuleState] = useState<ModuleState>({
    status: 'loading',
    data: null,
    error: '',
  })

  useEffect(() => {
    const abortController = new AbortController()

    async function loadModule() {
      if (!technologySlug || !moduleSlug) {
        setModuleState({
          status: 'not-found',
          data: null,
          error: 'Module not found.',
        })
        return
      }

      setModuleState({
        status: 'loading',
        data: null,
        error: '',
      })

      try {
        const moduleDetails = await getModuleByTechnologyAndSlug(
          technologySlug,
          moduleSlug,
          abortController.signal,
        )

        setModuleState({
          status: 'success',
          data: moduleDetails,
          error: '',
        })
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return
        }

        if (error instanceof TechnologiesApiError && error.status === 404) {
          setModuleState({
            status: 'not-found',
            data: null,
            error: 'Module not found.',
          })
          return
        }

        setModuleState({
          status: 'error',
          data: null,
          error: 'Unable to load module. Please try again later.',
        })
      }
    }

    void loadModule()

    return () => {
      abortController.abort()
    }
  }, [moduleSlug, technologySlug])

  const backTo = technologySlug ? `/technologies/${technologySlug}` : '/'

  return (
    <main className="min-h-screen bg-muted/30 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-5xl gap-6">
        <Button
          className="w-fit"
          nativeButton={false}
          render={<Link to={backTo} />}
          variant="outline"
        >
          Back to Technology
        </Button>

        {moduleState.status === 'loading' ? (
          <Card>
            <CardContent>
              <p className="text-sm text-muted-foreground" role="status">
                Loading module...
              </p>
            </CardContent>
          </Card>
        ) : null}

        {moduleState.status === 'not-found' ? (
          <Card>
            <CardHeader>
              <CardTitle>Module not found</CardTitle>
              <CardDescription>
                The module may be unavailable, unpublished, or outside this
                technology.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground" role="alert">
                {moduleState.error}
              </p>
            </CardContent>
          </Card>
        ) : null}

        {moduleState.status === 'error' ? (
          <Card>
            <CardContent>
              <p className="text-sm text-destructive" role="alert">
                {moduleState.error}
              </p>
            </CardContent>
          </Card>
        ) : null}

        {moduleState.status === 'success' ? (
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardDescription>
                  {moduleState.data.technology.title}
                </CardDescription>
                <CardTitle className="text-2xl">
                  {moduleState.data.module.title}
                </CardTitle>
                <CardDescription>
                  {moduleState.data.module.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <span className="inline-flex rounded-lg border border-border bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                  {moduleState.data.module.difficulty}
                </span>
              </CardContent>
            </Card>

            <section className="grid gap-4">
              <div>
                <h2 className="font-heading text-xl font-semibold">Lessons</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Work through the published lessons in order.
                </p>
              </div>

              {moduleState.data.lessons.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {moduleState.data.lessons.map((lesson) => (
                    <LessonCard
                      key={lesson.id}
                      lesson={lesson}
                      moduleSlug={moduleState.data.module.slug}
                      technologySlug={moduleState.data.technology.slug}
                    />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      No lessons are available yet.
                    </p>
                  </CardContent>
                </Card>
              )}
            </section>
          </div>
        ) : null}
      </div>
    </main>
  )
}
