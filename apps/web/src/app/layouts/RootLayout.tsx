import { useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router'

import { authClient } from '@/shared/api/auth-client'
import { Button } from '@/shared/ui/button'

import type { RootLayoutContext } from './use-root-layout'

type LayoutSession = RootLayoutContext['session']

const navigationItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    to: '/',
  },
  {
    id: 'learning-paths',
    label: 'Learning Paths',
    to: '/#learning-paths',
  },
  {
    id: 'projects',
    label: 'Projects',
    comingSoon: true,
  },
  {
    id: 'achievements',
    label: 'Achievements',
    comingSoon: true,
  },
  {
    id: 'settings',
    label: 'Settings',
    comingSoon: true,
  },
]

function isNavigationItemActive({
  hash,
  itemId,
  pathname,
}: {
  hash: string
  itemId: string
  pathname: string
}) {
  if (itemId === 'dashboard') {
    return pathname === '/' && hash !== '#learning-paths'
  }

  if (itemId === 'learning-paths') {
    return (
      hash === '#learning-paths' ||
      pathname.startsWith('/learning-paths') ||
      pathname.startsWith('/technologies')
    )
  }

  return false
}

function NavigationItems({ onNavigate }: { onNavigate?: () => void }) {
  const location = useLocation()

  return (
    <ul className="grid gap-1">
      {navigationItems.map((item) => {
        const isActive = isNavigationItemActive({
          hash: location.hash,
          itemId: item.id,
          pathname: location.pathname,
        })

        return (
          <li key={item.label}>
            {item.to ? (
              <Link
                aria-current={isActive ? 'page' : undefined}
                className="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none aria-[current=page]:bg-primary/10 aria-[current=page]:text-primary"
                onClick={onNavigate}
                to={item.to}
              >
                <span>{item.label}</span>
              </Link>
            ) : (
              <span
                aria-disabled="true"
                className="flex cursor-not-allowed items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground/60"
              >
                <span>{item.label}</span>
                <span className="rounded-md border border-border px-1.5 py-0.5 text-[0.7rem]">
                  Soon
                </span>
              </span>
            )}
          </li>
        )
      })}
    </ul>
  )
}

function AuthenticatedShell({
  children,
  session,
}: {
  children: React.ReactNode
  session: LayoutSession
}) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const [logoutError, setLogoutError] = useState('')
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const user = session.data?.user
  const displayName = user?.name || user?.email || 'Account'

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
      setIsMobileNavOpen(false)
    } catch {
      setLogoutError('Unable to connect to the server. Please try again.')
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r bg-background px-3 py-4 lg:block">
        <Link
          className="mb-6 block rounded-lg px-3 py-2 font-heading text-xl font-semibold focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          to="/"
        >
          Vertex
        </Link>
        <nav aria-label="Main navigation">
          <NavigationItems />
        </nav>
      </aside>

      <div className="min-w-0 lg:pl-64">
        <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur">
          <div className="flex min-h-14 items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <Button
                aria-controls="mobile-navigation"
                aria-expanded={isMobileNavOpen}
                aria-label="Toggle navigation"
                className="lg:hidden"
                onClick={() => {
                  setIsMobileNavOpen((isOpen) => !isOpen)
                }}
                size="icon"
                variant="outline"
              >
                <span aria-hidden="true" className="grid gap-0.5">
                  <span className="block h-0.5 w-4 rounded-full bg-current" />
                  <span className="block h-0.5 w-4 rounded-full bg-current" />
                  <span className="block h-0.5 w-4 rounded-full bg-current" />
                </span>
              </Button>
              <Link
                className="rounded-lg font-heading text-lg font-semibold focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none lg:hidden"
                to="/"
              >
                Vertex
              </Link>
            </div>

            <div className="flex min-w-0 items-center gap-3">
              <span className="hidden truncate text-sm text-muted-foreground sm:block">
                {displayName}
              </span>
              <Button
                disabled={isLoggingOut}
                onClick={() => {
                  void handleLogout()
                }}
                size="sm"
                variant="outline"
              >
                {isLoggingOut ? 'Signing out...' : 'Logout'}
              </Button>
            </div>
          </div>

          {isMobileNavOpen ? (
            <nav
              aria-label="Mobile navigation"
              className="border-t bg-background px-4 py-3 lg:hidden"
              id="mobile-navigation"
            >
              <NavigationItems
                onNavigate={() => {
                  setIsMobileNavOpen(false)
                }}
              />
              <p className="mt-3 truncate text-sm text-muted-foreground">
                {displayName}
              </p>
            </nav>
          ) : null}
        </header>

        <main className="min-w-0 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto grid w-full max-w-6xl gap-6">{children}</div>
          {logoutError ? (
            <p
              className="mx-auto mt-4 max-w-6xl text-sm text-destructive"
              role="alert"
            >
              {logoutError}
            </p>
          ) : null}
        </main>
      </div>
    </div>
  )
}

export function RootLayout() {
  const session = authClient.useSession()
  const location = useLocation()
  const isAuthPage =
    location.pathname === '/login' || location.pathname === '/register'

  if (isAuthPage) {
    return <Outlet context={{ session } satisfies RootLayoutContext} />
  }

  if (session.data) {
    return (
      <AuthenticatedShell session={session}>
        <Outlet context={{ session } satisfies RootLayoutContext} />
      </AuthenticatedShell>
    )
  }

  return <Outlet context={{ session } satisfies RootLayoutContext} />
}
