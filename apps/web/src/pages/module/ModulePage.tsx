import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'

import { useRootLayout } from '@/app/layouts/use-root-layout'
import {
  getModuleByTechnologyAndSlug,
  TechnologiesApiError,
  type ModuleDetails,
  type ModuleLesson,
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
  SectionHeader,
} from '@/shared/ui/page-state'
import { Progress } from '@/shared/ui/progress'

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
        <div className="flex items-start justify-between gap-3">
          <CardTitle>{lesson.title}</CardTitle>
          {lesson.progress.status === 'COMPLETED' ? (
            <span className="inline-flex shrink-0 rounded-lg border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
              Completed
            </span>
          ) : null}
        </div>
        <CardDescription>{lesson.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex rounded-lg border border-border bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
            {formatLessonType(lesson.type)}
          </span>
          <span className="inline-flex rounded-lg border border-border bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
            {formatDifficulty(lesson.difficulty)}
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
  const { session } = useRootLayout()
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

  const completedLessons =
    moduleState.status === 'success'
      ? moduleState.data.lessons.filter(
          (lesson) => lesson.progress.status === 'COMPLETED',
        ).length
      : 0
  const totalLessons =
    moduleState.status === 'success' ? moduleState.data.lessons.length : 0
  const completionPercentage =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

  return (
    <div className="grid gap-6">
      <Breadcrumbs
        items={[
          { label: 'Dashboard', to: '/' },
          {
            label:
              moduleState.status === 'success'
                ? moduleState.data.technology.title
                : 'Technology',
            to: technologySlug ? `/technologies/${technologySlug}` : '/',
          },
          {
            label:
              moduleState.status === 'success'
                ? moduleState.data.module.title
                : 'Module',
          },
        ]}
      />

      {moduleState.status === 'loading' ? (
        <PageLoadingState message="Loading module..." />
      ) : null}

      {moduleState.status === 'not-found' ? (
        <PageNotFoundState
          description="The module may be unavailable, unpublished, or outside this technology."
          message={moduleState.error}
          title="Module not found"
        />
      ) : null}

      {moduleState.status === 'error' ? (
        <PageErrorState message={moduleState.error} />
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
              <div className="grid gap-3">
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex rounded-lg border border-border bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                    {formatDifficulty(moduleState.data.module.difficulty)}
                  </span>
                  <span className="inline-flex rounded-lg border border-border bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                    {completedLessons} of {totalLessons} lessons completed
                  </span>
                  <span className="inline-flex rounded-lg border border-border bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                    {completionPercentage}%
                  </span>
                </div>
                <Progress
                  label={`${moduleState.data.module.title} progress`}
                  value={completionPercentage}
                />
                {!session.isPending && !session.data ? (
                  <p className="text-sm text-muted-foreground">
                    Sign in to track progress.
                  </p>
                ) : null}
              </div>
            </CardContent>
          </Card>

          <section className="grid gap-4">
            <SectionHeader
              description="Work through the published lessons in order."
              title="Lessons"
            />

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
  )
}
