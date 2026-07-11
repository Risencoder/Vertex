import { cn } from '@/shared/lib/utils'

type ProgressProps = {
  value: number
  label: string
  showValue?: boolean
  className?: string
  trackClassName?: string
  indicatorClassName?: string
}

export function clampProgressValue(value: number) {
  if (!Number.isFinite(value)) {
    return 0
  }

  return Math.min(100, Math.max(0, Math.round(value)))
}

export function Progress({
  value,
  label,
  showValue = false,
  className,
  trackClassName,
  indicatorClassName,
}: ProgressProps) {
  const safeValue = clampProgressValue(value)

  return (
    <div className={cn('grid gap-1.5', className)}>
      {showValue ? (
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="text-muted-foreground">{label}</span>
          <span className="font-medium">{safeValue}%</span>
        </div>
      ) : null}
      <div
        aria-label={label}
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={safeValue}
        className={cn(
          'h-2 overflow-hidden rounded-full bg-muted',
          trackClassName,
        )}
        role="progressbar"
      >
        <div
          className={cn(
            'h-full rounded-full bg-primary transition-all',
            indicatorClassName,
          )}
          style={{ width: `${safeValue}%` }}
        />
      </div>
      {!showValue ? (
        <p className="sr-only">
          {label}: {safeValue}% complete
        </p>
      ) : null}
    </div>
  )
}
