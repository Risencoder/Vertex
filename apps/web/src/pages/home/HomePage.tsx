import { useState } from 'react'
import { Link } from 'react-router'

import { authClient } from '@/shared/api/auth-client'
import { Button } from '@/shared/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card'

type DashboardMetricCardProps = {
  title: string
  value: string
  description: string
}

type DashboardProps = {
  user: {
    name?: string | null
    email: string
  }
  isLoggingOut: boolean
  logoutError: string
  onLogout: () => void
}

function DashboardMetricCard({
  title,
  value,
  description,
}: DashboardMetricCardProps) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-semibold tracking-normal">{value}</p>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

function AuthenticatedDashboard({
  user,
  isLoggingOut,
  logoutError,
  onLogout,
}: DashboardProps) {
  const displayName = user.name || 'there'

  return (
    <div className="grid gap-6">
      <section className="flex flex-col gap-4 rounded-xl border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold">
            Welcome back, {displayName}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>
        </div>
        <Button disabled={isLoggingOut} onClick={onLogout} variant="outline">
          {isLoggingOut ? 'Signing out...' : 'Logout'}
        </Button>
      </section>

      {logoutError ? (
        <p className="text-sm text-destructive" role="alert">
          {logoutError}
        </p>
      ) : null}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card size="sm">
          <CardHeader>
            <CardTitle>Continue Learning</CardTitle>
            <CardDescription>
              Resume your current learning journey.
            </CardDescription>
          </CardHeader>
          <CardFooter className="justify-start">
            <Button>Continue</Button>
          </CardFooter>
        </Card>

        <DashboardMetricCard
          description="Progress tracking will appear here."
          title="Learning Progress"
          value="0%"
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
  const session = authClient.useSession()
  const [logoutError, setLogoutError] = useState('')
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  async function handleLogout() {
    if (isLoggingOut) {
      return
    }

    setIsLoggingOut(true)
    setLogoutError('')

    try {
      const { error } = await authClient.signOut()

      if (error) {
        setLogoutError(error.message || 'Unable to sign out. Please try again.')
        return
      }

      await session.refetch()
    } catch {
      setLogoutError('Unable to connect to the server. Please try again.')
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <main className="min-h-screen bg-muted/30 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center justify-center">
        {session.isPending ? (
          <Card className="w-full max-w-lg">
            <CardContent>
              <p className="text-sm text-muted-foreground" role="status">
                Loading your session...
              </p>
            </CardContent>
          </Card>
        ) : session.data ? (
          <div className="w-full">
            <AuthenticatedDashboard
              isLoggingOut={isLoggingOut}
              logoutError={logoutError}
              onLogout={() => {
                void handleLogout()
              }}
              user={session.data.user}
            />
          </div>
        ) : (
          <GuestHome />
        )}
      </div>
    </main>
  )
}
