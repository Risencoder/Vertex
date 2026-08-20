import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'

import {
  getLearningPathBySlug,
  LearningPathsApiError,
  type LearningPathDetails,
  type Technology,
} from '@/shared/api/learning-paths'
import {
  frontendEngineerPathCopy,
  getRecommendedNextTechnology,
  getUnmetPrerequisites,
} from '@/shared/config/learning-path-guidance'
import { formatDifficulty } from '@/shared/lib/labels'
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
import { clampProgressValue, Progress } from '@/shared/ui/progress'

type LearningPathState =
  | {
      status: 'loading'
      data: null
      error: string
    }
  | {
      status: 'success'
      data: LearningPathDetails
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

function TechnologyCard({
  allTechnologies,
  learningPathSlug,
  isRecommendedNext,
  technology,
}: {
  allTechnologies: Technology[]
  learningPathSlug: string
  isRecommendedNext: boolean
  technology: Technology
}) {
  const unmetPrerequisites = getUnmetPrerequisites(technology, allTechnologies)

  return (
    <Card className={isRecommendedNext ? 'border-primary/30 bg-primary/5' : ''}>
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex size-8 items-center justify-center rounded-full border bg-background text-sm font-semibold">
            {technology.order}
          </span>
          {isRecommendedNext ? (
            <span className="inline-flex rounded-lg border border-primary/20 bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
              Recommended next
            </span>
          ) : null}
          <span className="inline-flex rounded-lg border border-border bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
            {technology.isRequired ? 'Core' : 'Optional'}
          </span>
          {technology.progress.isCompleted ? (
            <span className="inline-flex rounded-lg border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
              Completed
            </span>
          ) : null}
        </div>
        <div className="grid gap-2">
          <CardTitle>{technology.name}</CardTitle>
          <CardDescription>{technology.description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex rounded-lg border border-border bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
              {technology.progress.completedLessons} of{' '}
              {technology.progress.totalLessons} lessons completed
            </span>
            <span className="inline-flex rounded-lg border border-border bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
              {clampProgressValue(technology.progress.percentage)}%
            </span>
          </div>
          <Progress
            label={`${technology.name} progress`}
            value={technology.progress.percentage}
          />
          {technology.progress.totalLessons === 0 ? (
            <p className="text-sm leading-6 text-muted-foreground">
              Guided lessons for this technology are not published yet. You can
              still open it from the path.
            </p>
          ) : null}
          {unmetPrerequisites.length > 0 ? (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-900">
              <p className="font-medium">Recommended before this step</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {unmetPrerequisites.map((prerequisite) => (
                  <li key={prerequisite.slug}>
                    {prerequisite.label}{' '}
                    <span className="text-amber-800/80">
                      ({prerequisite.importance})
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 sm:flex-row sm:items-center">
        <Button
          nativeButton={false}
          render={
            <Link
              state={{ fromLearningPathSlug: learningPathSlug }}
              to={`/technologies/${technology.slug}`}
            />
          }
          variant="outline"
        >
          {unmetPrerequisites.length > 0 ? 'Start anyway' : 'Explore'}
        </Button>
        {unmetPrerequisites.length > 0 ? (
          <p className="text-sm text-muted-foreground">
            Start anyway. This is guidance, not a lock.
          </p>
        ) : null}
      </CardFooter>
    </Card>
  )
}

export function LearningPathPage() {
  const { slug } = useParams()
  const [learningPathState, setLearningPathState] = useState<LearningPathState>(
    {
      status: 'loading',
      data: null,
      error: '',
    },
  )

  useEffect(() => {
    const abortController = new AbortController()

    async function loadLearningPath() {
      if (!slug) {
        setLearningPathState({
          status: 'not-found',
          data: null,
          error: 'Learning path not found.',
        })
        return
      }

      setLearningPathState({
        status: 'loading',
        data: null,
        error: '',
      })

      try {
        const learningPath = await getLearningPathBySlug(
          slug,
          abortController.signal,
        )

        setLearningPathState({
          status: 'success',
          data: learningPath,
          error: '',
        })
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return
        }

        if (error instanceof LearningPathsApiError && error.status === 404) {
          setLearningPathState({
            status: 'not-found',
            data: null,
            error: 'Learning path not found.',
          })
          return
        }

        setLearningPathState({
          status: 'error',
          data: null,
          error: 'Unable to load learning path. Please try again later.',
        })
      }
    }

    void loadLearningPath()

    return () => {
      abortController.abort()
    }
  }, [slug])

  return (
    <div className="grid gap-6">
      <Breadcrumbs
        items={[
          { label: 'Dashboard', to: '/' },
          {
            label:
              learningPathState.status === 'success'
                ? learningPathState.data.title
                : 'Learning Path',
          },
        ]}
      />
      {learningPathState.status === 'loading' ? (
        <PageLoadingState message="Loading learning path..." />
      ) : null}

      {learningPathState.status === 'not-found' ? (
        <PageNotFoundState
          description="The learning path may be unavailable or unpublished."
          message={learningPathState.error}
          title="Learning path not found"
        />
      ) : null}

      {learningPathState.status === 'error' ? (
        <PageErrorState message={learningPathState.error} />
      ) : null}

      {learningPathState.status === 'success' ? (
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                {learningPathState.data.title}
              </CardTitle>
              <CardDescription>
                {learningPathState.data.description}
              </CardDescription>
              <p className="text-sm leading-6 text-muted-foreground">
                {frontendEngineerPathCopy.description}
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex rounded-lg border border-border bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                    {formatDifficulty(learningPathState.data.difficulty)}
                  </span>
                  <span className="inline-flex rounded-lg border border-border bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                    {learningPathState.data.progress.completedLessons} of{' '}
                    {learningPathState.data.progress.totalLessons} lessons
                    completed
                  </span>
                  <span className="inline-flex rounded-lg border border-border bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                    {learningPathState.data.progress.completedTechnologies} of{' '}
                    {learningPathState.data.progress.totalTechnologies}{' '}
                    technologies completed
                  </span>
                  <span className="inline-flex rounded-lg border border-border bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                    {clampProgressValue(
                      learningPathState.data.progress.percentage,
                    )}
                    %
                  </span>
                </div>
                <Progress
                  label={`${learningPathState.data.title} progress`}
                  value={learningPathState.data.progress.percentage}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <SectionHeader
                description="Move through the recommended sequence, or jump ahead when you already know the earlier material."
                title="Recommended Journey"
              />
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {learningPathState.data.technologies.map((technology) => {
                  const recommendedNext = getRecommendedNextTechnology(
                    learningPathState.data.technologies,
                  )

                  return (
                    <TechnologyCard
                      allTechnologies={learningPathState.data.technologies}
                      isRecommendedNext={recommendedNext?.id === technology.id}
                      key={technology.id}
                      learningPathSlug={learningPathState.data.slug}
                      technology={technology}
                    />
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  )
}
