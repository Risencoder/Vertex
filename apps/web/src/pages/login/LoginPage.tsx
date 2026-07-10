import { type FormEvent, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'

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
import { Input } from '@/shared/ui/input'

type FormState = 'idle' | 'submitting' | 'success' | 'error'

type FormValues = {
  email: string
  password: string
}

type FormErrors = Partial<Record<keyof FormValues, string>>

const initialValues: FormValues = {
  email: '',
  password: '',
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validateForm(values: FormValues) {
  const errors: FormErrors = {}
  const email = values.email.trim()

  if (!email) {
    errors.email = 'Email is required.'
  } else if (!emailPattern.test(email)) {
    errors.email = 'Enter a valid email address.'
  }

  if (!values.password) {
    errors.password = 'Password is required.'
  }

  return errors
}

export function LoginPage() {
  const navigate = useNavigate()
  const [values, setValues] = useState<FormValues>(initialValues)
  const [errors, setErrors] = useState<FormErrors>({})
  const [formState, setFormState] = useState<FormState>('idle')
  const [message, setMessage] = useState('')

  const isSubmitting = formState === 'submitting'

  useEffect(() => {
    if (formState !== 'success') {
      return
    }

    const timeoutId = window.setTimeout(() => {
      void navigate('/')
    }, 900)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [formState, navigate])

  function updateValue(field: keyof FormValues, value: string) {
    setValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }))

    if (errors[field]) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        [field]: undefined,
      }))
    }

    if (formState === 'error') {
      setFormState('idle')
      setMessage('')
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (isSubmitting) {
      return
    }

    const validationErrors = validateForm(values)

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      setFormState('error')
      setMessage('Please fix the highlighted fields.')
      return
    }

    setFormState('submitting')
    setMessage('')

    try {
      const { error } = await authClient.signIn.email({
        email: values.email.trim(),
        password: values.password,
      })

      if (error) {
        setFormState('error')
        setMessage(error.message || 'Login failed. Please try again.')
        return
      }
    } catch {
      setFormState('error')
      setMessage('Unable to connect to the server. Please try again.')
      return
    }

    setFormState('success')
    setMessage('Signed in. Redirecting you home...')
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>
            Continue your Vertex learning workspace.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form className="grid gap-4" onSubmit={handleSubmit} noValidate>
            <div className="grid gap-1.5">
              <label className="text-sm font-medium" htmlFor="email">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={values.email}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'email-error' : undefined}
                disabled={isSubmitting || formState === 'success'}
                onChange={(event) => updateValue('email', event.target.value)}
              />
              {errors.email ? (
                <p className="text-sm text-destructive" id="email-error">
                  {errors.email}
                </p>
              ) : null}
            </div>

            <div className="grid gap-1.5">
              <label className="text-sm font-medium" htmlFor="password">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={values.password}
                aria-invalid={Boolean(errors.password)}
                aria-describedby={
                  errors.password ? 'password-error' : undefined
                }
                disabled={isSubmitting || formState === 'success'}
                onChange={(event) =>
                  updateValue('password', event.target.value)
                }
              />
              {errors.password ? (
                <p className="text-sm text-destructive" id="password-error">
                  {errors.password}
                </p>
              ) : null}
            </div>

            {message ? (
              <p
                className={
                  formState === 'success'
                    ? 'text-sm text-emerald-700'
                    : 'text-sm text-destructive'
                }
                role={formState === 'success' ? 'status' : 'alert'}
              >
                {message}
              </p>
            ) : null}

            <Button
              className="w-full"
              type="submit"
              disabled={isSubmitting || formState === 'success'}
            >
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground">
            New to Vertex?{' '}
            <Link
              className="font-medium text-foreground underline"
              to="/register"
            >
              Create an account
            </Link>
          </p>
        </CardFooter>
      </Card>
    </main>
  )
}
