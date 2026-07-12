import { useEffect, useState } from 'react'
import { Link } from 'react-router'

import { useRootLayout } from '@/app/layouts/use-root-layout'
import { getDashboard, type DashboardSummary } from '@/shared/api/dashboard'
import {
  getLearningPaths,
  type LearningPath,
} from '@/shared/api/learning-paths'
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
import { Progress } from '@/shared/ui/progress'

type DashboardMetricCardProps = {
  title: string
  value: string
  description: string
  progressValue?: number
}

type LearningPathsState =
  | {
      status: 'loading'
      data: LearningPath[]
      error: string
    }
  | {
      status: 'success'
      data: LearningPath[]
      error: string
    }
  | {
      status: 'empty'
      data: LearningPath[]
      error: string
    }
  | {
      status: 'error'
      data: LearningPath[]
      error: string
    }

type DashboardState =
  | {
      status: 'loading'
      data: null
      error: string
    }
  | {
      status: 'success'
      data: DashboardSummary
      error: string
    }
  | {
      status: 'error'
      data: null
      error: string
    }

type DashboardProps = {
  user: {
    name?: string | null
    email: string
  }
}

function ContinueLearningCard({ dashboard }: { dashboard: DashboardSummary }) {
  const continueLearning = dashboard.continueLearning

  if (!continueLearning) {
    return (
      <Card className="border-primary/20 bg-primary/5" size="sm">
        <CardHeader>
          <CardTitle className="text-lg">Continue Learning</CardTitle>
          <CardDescription>
            Congratulations! You completed all available lessons.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-semibold tracking-normal">🎉</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-primary/20 bg-primary/5 shadow-sm md:col-span-2 xl:col-span-2">
      <CardHeader>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle className="text-xl">Continue Learning</CardTitle>
            <CardDescription>
              Resume your current learning journey.
            </CardDescription>
          </div>
          <span className="w-fit rounded-lg border border-primary/20 bg-background px-2 py-1 text-xs font-medium text-primary">
            Next lesson
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              {continueLearning.learningPathTitle} /{' '}
              {continueLearning.technologyTitle}
            </p>
            <p className="mt-1 font-heading text-2xl font-semibold leading-tight">
              {continueLearning.lessonTitle}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Module: {continueLearning.moduleTitle}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="justify-start">
        <Button
          nativeButton={false}
          render={
            <Link
              to={`/technologies/${continueLearning.technologySlug}/modules/${continueLearning.moduleSlug}/lessons/${continueLearning.lessonSlug}`}
            />
          }
          size="lg"
        >
          Continue
        </Button>
      </CardFooter>
    </Card>
  )
}

function DashboardMetricCard({
  title,
  value,
  description,
  progressValue,
}: DashboardMetricCardProps) {
  return (
    <Card className="min-h-40" size="sm">
      <CardHeader>
        <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="font-heading text-4xl font-semibold tracking-normal">
          {value}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        {typeof progressValue === 'number' ? (
          <Progress
            className="mt-4"
            label={`${title} progress`}
            value={progressValue}
          />
        ) : null}
      </CardContent>
    </Card>
  )
}

function LearningPathCard({ learningPath }: { learningPath: LearningPath }) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle>{learningPath.title}</CardTitle>
        <CardDescription>{learningPath.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <span className="inline-flex rounded-lg border border-border bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
          {formatDifficulty(learningPath.difficulty)}
        </span>
      </CardContent>
      <CardFooter className="justify-start">
        <Button
          nativeButton={false}
          render={<Link to={`/learning-paths/${learningPath.slug}`} />}
          variant="outline"
        >
          Explore
        </Button>
      </CardFooter>
    </Card>
  )
}

function LearningPathsSection() {
  const [learningPathsState, setLearningPathsState] =
    useState<LearningPathsState>({
      status: 'loading',
      data: [],
      error: '',
    })

  useEffect(() => {
    const abortController = new AbortController()

    async function loadLearningPaths() {
      try {
        const learningPaths = await getLearningPaths(abortController.signal)

        setLearningPathsState({
          status: learningPaths.length > 0 ? 'success' : 'empty',
          data: learningPaths,
          error: '',
        })
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return
        }

        setLearningPathsState({
          status: 'error',
          data: [],
          error: 'Unable to load learning paths. Please try again later.',
        })
      }
    }

    void loadLearningPaths()

    return () => {
      abortController.abort()
    }
  }, [])

  return (
    <section className="grid gap-4" id="learning-paths">
      <div>
        <h2 className="font-heading text-xl font-semibold">Learning Paths</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose a path to start building practical engineering skills.
        </p>
      </div>

      {learningPathsState.status === 'loading' ? (
        <Card>
          <CardContent>
            <p className="text-sm text-muted-foreground" role="status">
              Loading learning paths...
            </p>
          </CardContent>
        </Card>
      ) : null}

      {learningPathsState.status === 'error' ? (
        <Card>
          <CardContent>
            <p className="text-sm text-destructive" role="alert">
              {learningPathsState.error}
            </p>
          </CardContent>
        </Card>
      ) : null}

      {learningPathsState.status === 'empty' ? (
        <Card>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              No learning paths are available yet.
            </p>
          </CardContent>
        </Card>
      ) : null}

      {learningPathsState.status === 'success' ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {learningPathsState.data.map((learningPath) => (
            <LearningPathCard
              key={learningPath.id}
              learningPath={learningPath}
            />
          ))}
        </div>
      ) : null}
    </section>
  )
}

function AuthenticatedDashboard({ user }: DashboardProps) {
  const displayName = user.name || 'there'
  const [dashboardState, setDashboardState] = useState<DashboardState>({
    status: 'loading',
    data: null,
    error: '',
  })

  useEffect(() => {
    const abortController = new AbortController()

    async function loadDashboard() {
      setDashboardState({
        status: 'loading',
        data: null,
        error: '',
      })

      try {
        const dashboard = await getDashboard(abortController.signal)

        setDashboardState({
          status: 'success',
          data: dashboard,
          error: '',
        })
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return
        }

        setDashboardState({
          status: 'error',
          data: null,
          error: 'Unable to load dashboard progress. Please try again later.',
        })
      }
    }

    void loadDashboard()

    return () => {
      abortController.abort()
    }
  }, [])

  return (
    <div className="grid gap-6">
      <Breadcrumbs items={[{ label: 'Dashboard' }]} />

      <section className="rounded-xl border bg-card p-4">
        <div className="grid gap-2 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Dashboard overview
            </p>
            <h1 className="mt-1 font-heading text-3xl font-semibold tracking-normal">
              Welcome back, {displayName}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">{user.email}</p>
          </div>
          <p className="max-w-sm text-sm text-muted-foreground">
            Pick up where you left off and keep your learning momentum visible.
          </p>
        </div>
      </section>

      {dashboardState.status === 'loading' ? (
        <Card>
          <CardContent>
            <p className="text-sm text-muted-foreground" role="status">
              Loading dashboard progress...
            </p>
          </CardContent>
        </Card>
      ) : null}

      {dashboardState.status === 'error' ? (
        <Card>
          <CardContent>
            <p className="text-sm text-destructive" role="alert">
              {dashboardState.error}
            </p>
          </CardContent>
        </Card>
      ) : null}

      {dashboardState.status === 'success' ? (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <ContinueLearningCard dashboard={dashboardState.data} />

          <DashboardMetricCard
            description={`${dashboardState.data.statistics.lessonsCompleted} of ${dashboardState.data.statistics.lessonsTotal} lessons completed.`}
            progressValue={dashboardState.data.statistics.overallProgress}
            title="Learning Progress"
            value={`${dashboardState.data.statistics.overallProgress}%`}
          />
          <DashboardMetricCard
            description="Projects completed."
            title="Projects"
            value="0"
          />
          <DashboardMetricCard
            description="Achievements unlocked."
            title="Achievements"
            value="0"
          />
        </section>
      ) : null}

      <LearningPathsSection />
    </div>
  )
}

function GuestHome() {
  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Vertex</CardTitle>
        <CardDescription>
          Your engineering growth workspace starts here.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <p className="text-sm text-muted-foreground">
            You are not signed in.
          </p>
          <div className="flex flex-wrap gap-2">
            <Link
              className="inline-flex h-8 items-center justify-center rounded-lg bg-primary px-2.5 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/80 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
              to="/login"
            >
              Login
            </Link>
            <Link
              className="inline-flex h-8 items-center justify-center rounded-lg border border-border bg-background px-2.5 text-sm font-medium transition-all hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
              to="/register"
            >
              Register
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function HomePage() {
  const { session } = useRootLayout()

  if (session.data) {
    return <AuthenticatedDashboard user={session.data.user} />
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
      {session.isPending ? (
        <Card className="w-full max-w-lg">
          <CardContent>
            <p className="text-sm text-muted-foreground" role="status">
              Loading your session...
            </p>
          </CardContent>
        </Card>
      ) : (
        <GuestHome />
      )}
    </div>
  )
}
