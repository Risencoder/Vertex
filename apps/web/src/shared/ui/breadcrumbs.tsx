import { Link } from 'react-router'

import { cn } from '@/shared/lib/utils'

export type BreadcrumbItem = {
  label: string
  to?: string
}

export function Breadcrumbs({
  className,
  items,
}: {
  className?: string
  items: BreadcrumbItem[]
}) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn('text-sm text-muted-foreground', className)}
    >
      <ol className="flex min-w-0 flex-wrap items-center gap-1.5">
        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <li className="flex min-w-0 items-center gap-1.5" key={item.label}>
              {index > 0 ? <span aria-hidden="true">/</span> : null}
              {item.to && !isLast ? (
                <Link
                  className="truncate rounded-sm underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                  to={item.to}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={isLast ? 'page' : undefined}
                  className="truncate text-foreground"
                >
                  {item.label}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
