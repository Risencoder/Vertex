import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router'

import { authClient } from '@/shared/api/auth-client'
import {
  getTechnologyBySlug,
  TechnologiesApiError,
  type TechnologyDetails,
  type TechnologyModule,
} from '@/shared/api/technologies'
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

type TechnologyPageLocationState = {
  fromLearningPathSlug?: string
}

type TechnologyState =
  | {
      status: 'loading'
      data: null
      error: string
    }
  | {
      status: 'success'
      data: TechnologyDetails
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

function ModuleCard({
  module,
  technologySlug,
}: {
  module: TechnologyModule
  technologySlug: string
}) {
  return (
    <Card size="sm">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <CardTitle>{module.title}</CardTitle>
          {module.progress.isCompleted ? (
            <span className="inline-flex shrink-0 rounded-lg border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
              Completed
            </span>
          ) : null}
        </div>
        <CardDescription>{module.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex rounded-lg border border-border bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
              {formatDifficulty(module.difficulty)}
            </span>
            <span className="inline-flex rounded-lg border border-border bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
              {module.progress.completedLessons} of{' '}
              {module.progress.totalLessons} lessons completed
            </span>
            <span className="inline-flex rounded-lg border border-border bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
              {clampProgressValue(module.progress.percentage)}%
            </span>
          </div>
          <Progress
            label={`${module.title} progress`}
            value={module.progress.percentage}
          />
        </div>
      </CardContent>
      <CardFooter className="justify-start">
        <Button
          nativeButton={false}
          render={
            <Link
              to={`/technologies/${technologySlug}/modules/${module.slug}`}
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

export function TechnologyPage() {
  const { slug } = useParams()
  const session = authClient.useSession()
  const location = useLocation()
  const locationState = location.state as TechnologyPageLocationState | null
  const backTo = locationState?.fromLearningPathSlug
    ? `/learning-paths/${locationState.fromLearningPathSlug}`
    : '/'
  const backLabel = locationState?.fromLearningPathSlug
    ? 'Back to Learning Path'
    : 'Back to Dashboard'
  const [technologyState, setTechnologyState] = useState<TechnologyState>({
    status: 'loading',
    data: null,
    error: '',
  })

  useEffect(() => {
    const abortController = new AbortController()

    async function loadTechnology() {
      if (!slug) {
        setTechnologyState({
          status: 'not-found',
          data: null,
          error: 'Technology not found.',
        })
        return
      }

      setTechnologyState({
        status: 'loading',
        data: null,
        error: '',
      })

      try {
        const technology = await getTechnologyBySlug(
          slug,
          abortController.signal,
        )

        setTechnologyState({
          status: 'success',
          data: technology,
          error: '',
        })
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return
        }

        if (error instanceof TechnologiesApiError && error.status === 404) {
          setTechnologyState({
            status: 'not-found',
            data: null,
            error: 'Technology not found.',
          })
          return
        }

        setTechnologyState({
          status: 'error',
          data: null,
          error: 'Unable to load technology. Please try again later.',
        })
      }
    }

    void loadTechnology()

    return () => {
      abortController.abort()
    }
  }, [slug])

  return (
    <main className="min-h-screen bg-muted/30 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-5xl gap-6">
        <Button
          className="w-fit"
          nativeButton={false}
          render={<Link to={backTo} />}
          variant="outline"
        >
          {backLabel}
        </Button>

        {technologyState.status === 'loading' ? (
          <Card>
            <CardContent>
              <p className="text-sm text-muted-foreground" role="status">
                Loading technology...
              </p>
            </CardContent>
          </Card>
        ) : null}

        {technologyState.status === 'not-found' ? (
          <Card>
            <CardHeader>
              <CardTitle>Technology not found</CardTitle>
              <CardDescription>
                The technology may be unavailable or unpublished.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground" role="alert">
                {technologyState.error}
              </p>
            </CardContent>
          </Card>
        ) : null}

        {technologyState.status === 'error' ? (
          <Card>
            <CardContent>
              <p className="text-sm text-destructive" role="alert">
                {technologyState.error}
              </p>
            </CardContent>
          </Card>
        ) : null}

        {technologyState.status === 'success' ? (
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">
                  {technologyState.data.title}
                </CardTitle>
                <CardDescription>
                  {technologyState.data.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  <div className="flex flex-wrap gap-2">
                    {technologyState.data.category ? (
                      <span className="inline-flex rounded-lg border border-border bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                        {technologyState.data.category}
                      </span>
                    ) : null}
                    <span className="inline-flex rounded-lg border border-border bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                      {technologyState.data.progress.completedLessons} of{' '}
                      {technologyState.data.progress.totalLessons} lessons
                      completed
                    </span>
                    <span className="inline-flex rounded-lg border border-border bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                      {technologyState.data.progress.completedModules} of{' '}
                      {technologyState.data.progress.totalModules} modules
                      completed
                    </span>
                    <span className="inline-flex rounded-lg border border-border bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                      {clampProgressValue(
                        technologyState.data.progress.percentage,
                      )}
                      %
                    </span>
                  </div>
                  <Progress
                    label={`${technologyState.data.title} progress`}
                    value={technologyState.data.progress.percentage}
                  />
                  {!session.isPending && !session.data ? (
                    <p className="text-sm text-muted-foreground">
                      Sign in to track your progress.
                    </p>
                  ) : null}
                </div>
              </CardContent>
            </Card>

            <section className="grid gap-4">
              <div>
                <h2 className="font-heading text-xl font-semibold">Modules</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Work through the published modules for this technology.
                </p>
              </div>

              {technologyState.data.modules.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {technologyState.data.modules.map((module) => (
                    <ModuleCard
                      key={module.id}
                      module={module}
                      technologySlug={technologyState.data.slug}
                    />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      No modules are available yet.
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
