import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card'

export function PageLoadingState({ message }: { message: string }) {
  return (
    <Card>
      <CardContent>
        <p className="text-sm text-muted-foreground" role="status">
          {message}
        </p>
      </CardContent>
    </Card>
  )
}

export function PageErrorState({ message }: { message: string }) {
  return (
    <Card>
      <CardContent>
        <p className="text-sm text-destructive" role="alert">
          {message}
        </p>
      </CardContent>
    </Card>
  )
}

export function PageNotFoundState({
  description,
  message,
  title,
}: {
  description: string
  message: string
  title: string
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground" role="alert">
          {message}
        </p>
      </CardContent>
    </Card>
  )
}

export function SectionHeader({
  description,
  title,
}: {
  description: string
  title: string
}) {
  return (
    <div>
      <h2 className="font-heading text-xl font-semibold">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
