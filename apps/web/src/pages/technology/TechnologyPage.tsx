import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router'

import {
  getTechnologyBySlug,
  TechnologiesApiError,
  type TechnologyDetails,
  type TechnologyModule,
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

function ModuleCard({ module }: { module: TechnologyModule }) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle>{module.title}</CardTitle>
        <CardDescription>{module.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <span className="inline-flex rounded-lg border border-border bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
          {module.difficulty}
        </span>
      </CardContent>
      <CardFooter className="justify-start">
        <Button disabled variant="outline">
          Open
        </Button>
      </CardFooter>
    </Card>
  )
}

export function TechnologyPage() {
  const { slug } = useParams()
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
              {technologyState.data.category ? (
                <CardContent>
                  <span className="inline-flex rounded-lg border border-border bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                    {technologyState.data.category}
                  </span>
                </CardContent>
              ) : null}
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
                    <ModuleCard key={module.id} module={module} />
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
