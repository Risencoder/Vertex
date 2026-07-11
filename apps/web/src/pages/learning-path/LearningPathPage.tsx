import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'

import {
  getLearningPathBySlug,
  LearningPathsApiError,
  type LearningPathDetails,
  type Technology,
} from '@/shared/api/learning-paths'
import { formatDifficulty } from '@/shared/lib/labels'
import { Button } from '@/shared/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card'
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
  learningPathSlug,
  technology,
}: {
  learningPathSlug: string
  technology: Technology
}) {
  return (
    <Card size="sm">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <CardTitle>{technology.name}</CardTitle>
          {technology.progress.isCompleted ? (
            <span className="inline-flex shrink-0 rounded-lg border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
              Completed
            </span>
          ) : null}
        </div>
        <CardDescription>{technology.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
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
        </div>
      </CardContent>
      <CardFooter className="justify-start">
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
          Explore
        </Button>
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
    <main className="min-h-screen bg-muted/30 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-4xl gap-6">
        <Button
          className="w-fit"
          nativeButton={false}
          render={<Link to="/" />}
          variant="outline"
        >
          Back to Dashboard
        </Button>

        {learningPathState.status === 'loading' ? (
          <Card>
            <CardContent>
              <p className="text-sm text-muted-foreground" role="status">
                Loading learning path...
              </p>
            </CardContent>
          </Card>
        ) : null}

        {learningPathState.status === 'not-found' ? (
          <Card>
            <CardHeader>
              <CardTitle>Learning path not found</CardTitle>
              <CardDescription>
                The learning path may be unavailable or unpublished.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground" role="alert">
                {learningPathState.error}
              </p>
            </CardContent>
          </Card>
        ) : null}

        {learningPathState.status === 'error' ? (
          <Card>
            <CardContent>
              <p className="text-sm text-destructive" role="alert">
                {learningPathState.error}
              </p>
            </CardContent>
          </Card>
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
                <CardTitle>Technologies</CardTitle>
                <CardDescription>
                  Follow the core technologies in this learning path.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {learningPathState.data.technologies.map((technology) => (
                    <TechnologyCard
                      key={technology.id}
                      learningPathSlug={learningPathState.data.slug}
                      technology={technology}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : null}
      </div>
    </main>
  )
}
