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
  name: string
  email: string
  password: string
  confirmPassword: string
}

type FormErrors = Partial<Record<keyof FormValues, string>>

const initialValues: FormValues = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validateForm(values: FormValues) {
  const errors: FormErrors = {}
  const name = values.name.trim()
  const email = values.email.trim()

  if (!name) {
    errors.name = 'Name is required.'
  }

  if (!email) {
    errors.email = 'Email is required.'
  } else if (!emailPattern.test(email)) {
    errors.email = 'Enter a valid email address.'
  }

  if (!values.password) {
    errors.password = 'Password is required.'
  } else if (values.password.length < 8) {
    errors.password = 'Password must be at least 8 characters.'
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = 'Confirm your password.'
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = 'Passwords do not match.'
  }

  return errors
}

export function RegisterPage() {
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
    }, 1200)

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
      const { error } = await authClient.signUp.email({
        name: values.name.trim(),
        email: values.email.trim(),
        password: values.password,
      })

      if (error) {
        setFormState('error')
        setMessage(error.message || 'Registration failed. Please try again.')
        return
      }
    } catch {
      setFormState('error')
      setMessage('Unable to connect to the server. Please try again.')
      return
    }

    setFormState('success')
    setMessage('Account created. Redirecting you home...')
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create your account</CardTitle>
          <CardDescription>
            Start building your Vertex learning workspace.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form className="grid gap-4" onSubmit={handleSubmit} noValidate>
            <div className="grid gap-1.5">
              <label className="text-sm font-medium" htmlFor="name">
                Name
              </label>
              <Input
                id="name"
                name="name"
                autoComplete="name"
                value={values.name}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? 'name-error' : undefined}
                disabled={isSubmitting || formState === 'success'}
                onChange={(event) => updateValue('name', event.target.value)}
              />
              {errors.name ? (
                <p className="text-sm text-destructive" id="name-error">
                  {errors.name}
                </p>
              ) : null}
            </div>

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
                autoComplete="new-password"
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

            <div className="grid gap-1.5">
              <label className="text-sm font-medium" htmlFor="confirm-password">
                Confirm password
              </label>
              <Input
                id="confirm-password"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={values.confirmPassword}
                aria-invalid={Boolean(errors.confirmPassword)}
                aria-describedby={
                  errors.confirmPassword ? 'confirm-password-error' : undefined
                }
                disabled={isSubmitting || formState === 'success'}
                onChange={(event) =>
                  updateValue('confirmPassword', event.target.value)
                }
              />
              {errors.confirmPassword ? (
                <p
                  className="text-sm text-destructive"
                  id="confirm-password-error"
                >
                  {errors.confirmPassword}
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
              {isSubmitting ? 'Creating account...' : 'Create account'}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link className="font-medium text-foreground underline" to="/login">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </main>
  )
}
