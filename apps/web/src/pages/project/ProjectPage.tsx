import { useEffect, useState, type ReactNode } from 'react'
import { Link, useParams } from 'react-router'

import { useRootLayout } from '@/app/layouts/use-root-layout'
import {
  getProjectByTechnologyAndSlug,
  getProjectSubmission,
  ProjectsApiError,
  submitProject,
  type ProjectDetails,
  type ProjectSubmission,
} from '@/shared/api/projects'
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
import { Input } from '@/shared/ui/input'
import {
  PageErrorState,
  PageLoadingState,
  PageNotFoundState,
} from '@/shared/ui/page-state'

type ProjectState =
  | {
      status: 'loading'
      data: null
      error: string
    }
  | {
      status: 'success'
      data: ProjectDetails
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

type SubmissionState =
  | {
      status: 'idle'
      data: null
      error: string
    }
  | {
      status: 'loading'
      data: null
      error: string
    }
  | {
      status: 'success'
      data: ProjectSubmission | null
      error: string
    }
  | {
      status: 'error'
      data: null
      error: string
    }

function renderMarkdown(markdown: string) {
  const blocks: ReactNode[] = []
  const lines = markdown.split('\n')
  let paragraph: string[] = []
  let listItems: string[] = []
  let listType: 'ordered' | 'unordered' | null = null

  function flushParagraph(key: string) {
    if (paragraph.length === 0) {
      return
    }

    blocks.push(
      <p key={key} className="text-base leading-8 text-card-foreground/90">
        {paragraph.join(' ')}
      </p>,
    )
    paragraph = []
  }

  function flushList(key: string) {
    if (listItems.length === 0 || !listType) {
      return
    }

    const className =
      listType === 'ordered'
        ? 'list-decimal space-y-2 pl-5 text-base leading-8 text-card-foreground/90'
        : 'list-disc space-y-2 pl-5 text-base leading-8 text-card-foreground/90'

    const items = listItems.map((item, index) => (
      <li key={`${key}-${index}`}>{item}</li>
    ))

    blocks.push(
      listType === 'ordered' ? (
        <ol key={key} className={className}>
          {items}
        </ol>
      ) : (
        <ul key={key} className={className}>
          {items}
        </ul>
      ),
    )

    listItems = []
    listType = null
  }

  lines.forEach((line, index) => {
    const trimmedLine = line.trim()
    const unorderedListMatch = /^[-*]\s+(.+)/.exec(trimmedLine)
    const orderedListMatch = /^\d+\.\s+(.+)/.exec(trimmedLine)

    if (trimmedLine === '') {
      flushParagraph(`paragraph-${index}`)
      flushList(`list-${index}`)
      return
    }

    if (trimmedLine.startsWith('# ')) {
      flushParagraph(`paragraph-before-heading-${index}`)
      flushList(`list-before-heading-${index}`)
      blocks.push(
        <h1
          key={`heading-${index}`}
          className="font-heading text-2xl font-semibold leading-tight"
        >
          {trimmedLine.slice(2)}
        </h1>,
      )
      return
    }

    if (trimmedLine.startsWith('## ')) {
      flushParagraph(`paragraph-before-subheading-${index}`)
      flushList(`list-before-subheading-${index}`)
      blocks.push(
        <h2
          key={`subheading-${index}`}
          className="pt-3 font-heading text-xl font-semibold leading-tight"
        >
          {trimmedLine.slice(3)}
        </h2>,
      )
      return
    }

    if (unorderedListMatch) {
      flushParagraph(`paragraph-before-list-${index}`)

      if (listType && listType !== 'unordered') {
        flushList(`list-before-unordered-${index}`)
      }

      listType = 'unordered'
      listItems.push(unorderedListMatch[1])
      return
    }

    if (orderedListMatch) {
      flushParagraph(`paragraph-before-list-${index}`)

      if (listType && listType !== 'ordered') {
        flushList(`list-before-ordered-${index}`)
      }

      listType = 'ordered'
      listItems.push(orderedListMatch[1])
      return
    }

    paragraph.push(trimmedLine)
  })

  flushParagraph('paragraph-final')
  flushList('list-final')

  return blocks
}

function getSubmissionStatusLabel(submission: ProjectSubmission | null) {
  if (!submission) {
    return 'Not submitted'
  }

  if (submission.status === 'NEEDS_CHANGES') {
    return 'Needs changes'
  }

  if (submission.status === 'IN_REVIEW') {
    return 'In review'
  }

  return submission.status.charAt(0) + submission.status.slice(1).toLowerCase()
}

export function ProjectPage() {
  const { projectSlug, technologySlug } = useParams()
  const { session } = useRootLayout()
  const [projectState, setProjectState] = useState<ProjectState>({
    status: 'loading',
    data: null,
    error: '',
  })
  const [submissionState, setSubmissionState] = useState<SubmissionState>({
    status: 'idle',
    data: null,
    error: '',
  })
  const [repositoryUrl, setRepositoryUrl] = useState('')
  const [demoUrl, setDemoUrl] = useState('')
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitSuccess, setSubmitSuccess] = useState('')

  useEffect(() => {
    const abortController = new AbortController()

    async function loadProject() {
      if (!technologySlug || !projectSlug) {
        setProjectState({
          status: 'not-found',
          data: null,
          error: 'Project not found.',
        })
        return
      }

      setProjectState({
        status: 'loading',
        data: null,
        error: '',
      })
      setSubmissionState({
        status: 'idle',
        data: null,
        error: '',
      })
      setRepositoryUrl('')
      setDemoUrl('')
      setNotes('')
      setSubmitError('')
      setSubmitSuccess('')

      try {
        const project = await getProjectByTechnologyAndSlug(
          technologySlug,
          projectSlug,
          abortController.signal,
        )

        setProjectState({
          status: 'success',
          data: project,
          error: '',
        })
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return
        }

        if (error instanceof ProjectsApiError && error.status === 404) {
          setProjectState({
            status: 'not-found',
            data: null,
            error: 'Project not found.',
          })
          return
        }

        setProjectState({
          status: 'error',
          data: null,
          error: 'Unable to load project. Please try again later.',
        })
      }
    }

    void loadProject()

    return () => {
      abortController.abort()
    }
  }, [projectSlug, technologySlug])

  useEffect(() => {
    const abortController = new AbortController()

    async function loadSubmission() {
      if (projectState.status !== 'success') {
        return
      }

      if (session.isPending) {
        return
      }

      if (!session.data) {
        setSubmissionState({
          status: 'idle',
          data: null,
          error: '',
        })
        return
      }

      setSubmissionState({
        status: 'loading',
        data: null,
        error: '',
      })

      try {
        const result = await getProjectSubmission(
          projectState.data.id,
          abortController.signal,
        )

        setSubmissionState({
          status: 'success',
          data: result.submission,
          error: '',
        })
        setRepositoryUrl(result.submission?.repositoryUrl ?? '')
        setDemoUrl(result.submission?.demoUrl ?? '')
        setNotes(result.submission?.notes ?? '')
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return
        }

        if (error instanceof ProjectsApiError && error.status === 401) {
          setSubmissionState({
            status: 'idle',
            data: null,
            error: '',
          })
          return
        }

        setSubmissionState({
          status: 'error',
          data: null,
          error: 'Unable to load your project submission.',
        })
      }
    }

    void loadSubmission()

    return () => {
      abortController.abort()
    }
  }, [projectState, session.data, session.isPending])

  async function handleSubmitProject() {
    if (projectState.status !== 'success' || isSubmitting) {
      return
    }

    setIsSubmitting(true)
    setSubmitError('')
    setSubmitSuccess('')

    try {
      const result = await submitProject(projectState.data.id, {
        demoUrl,
        notes,
        repositoryUrl,
      })

      setSubmissionState({
        status: 'success',
        data: result.submission,
        error: '',
      })
      setRepositoryUrl(result.submission.repositoryUrl ?? '')
      setDemoUrl(result.submission.demoUrl ?? '')
      setNotes(result.submission.notes ?? '')
      setSubmitSuccess('Project submission saved.')
    } catch (error) {
      if (error instanceof ProjectsApiError) {
        setSubmitError(error.message)
        return
      }

      setSubmitError('Unable to submit project. Please try again later.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const submission =
    submissionState.status === 'success' ? submissionState.data : null

  return (
    <div className="grid gap-6">
      <Breadcrumbs
        items={[
          { label: 'Dashboard', to: '/' },
          {
            label: projectState.status === 'success' ? 'React' : 'Technology',
            to: technologySlug ? `/technologies/${technologySlug}` : '/',
          },
          {
            label:
              projectState.status === 'success'
                ? projectState.data.title
                : 'Project',
          },
        ]}
      />

      {projectState.status === 'loading' ? (
        <PageLoadingState message="Loading project..." />
      ) : null}

      {projectState.status === 'not-found' ? (
        <PageNotFoundState
          description="The project may be unavailable, unpublished, or outside this technology."
          message={projectState.error}
          title="Project not found"
        />
      ) : null}

      {projectState.status === 'error' ? (
        <PageErrorState message={projectState.error} />
      ) : null}

      {projectState.status === 'success' ? (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem] xl:items-start">
          <main className="grid gap-6">
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex rounded-lg border border-primary/20 bg-background px-2 py-1 text-xs font-medium text-primary">
                    Build project
                  </span>
                  <span className="inline-flex rounded-lg border border-border bg-background px-2 py-1 text-xs font-medium text-muted-foreground">
                    {formatDifficulty(projectState.data.difficulty)}
                  </span>
                </div>
                <CardTitle className="text-3xl">
                  {projectState.data.title}
                </CardTitle>
                <CardDescription>
                  {projectState.data.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
                  This capstone is where the React path turns into a reviewable
                  product artifact. Build the app, document the tradeoffs, then
                  submit your repository when it is ready to discuss.
                </p>
              </CardContent>
            </Card>

            <section aria-labelledby="project-requirements-heading">
              <Card>
                <CardHeader>
                  <CardDescription>Project brief</CardDescription>
                  <CardTitle id="project-requirements-heading">
                    Requirements and review criteria
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <article className="grid max-w-3xl gap-5">
                    {renderMarkdown(projectState.data.brief ?? '')}
                  </article>
                </CardContent>
              </Card>
            </section>
          </main>

          <aside className="grid gap-4 xl:sticky xl:top-6">
            <Card>
              <CardHeader>
                <CardDescription>Submission</CardDescription>
                <CardTitle>Submit your build</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {session.isPending ? (
                    <p className="text-sm text-muted-foreground" role="status">
                      Checking your session...
                    </p>
                  ) : null}

                  {!session.isPending && !session.data ? (
                    <div className="grid gap-3 rounded-lg border bg-muted/30 p-4">
                      <p className="text-sm text-muted-foreground">
                        Sign in to submit and revisit your capstone work.
                      </p>
                      <Button
                        nativeButton={false}
                        render={<Link to="/login" />}
                        variant="outline"
                      >
                        Login
                      </Button>
                    </div>
                  ) : null}

                  {session.data && submissionState.status === 'loading' ? (
                    <p className="text-sm text-muted-foreground" role="status">
                      Loading your submission...
                    </p>
                  ) : null}

                  {submissionState.status === 'error' ? (
                    <p className="text-sm text-destructive" role="alert">
                      {submissionState.error}
                    </p>
                  ) : null}

                  {session.data ? (
                    <>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-medium">Status</span>
                        <span className="inline-flex rounded-lg border border-border bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                          {getSubmissionStatusLabel(submission)}
                        </span>
                      </div>

                      <div className="grid gap-2">
                        <label
                          className="text-sm font-medium"
                          htmlFor="project-repository-url"
                        >
                          Repository URL
                        </label>
                        <Input
                          autoComplete="url"
                          id="project-repository-url"
                          onChange={(event) => {
                            setRepositoryUrl(event.target.value)
                            setSubmitError('')
                            setSubmitSuccess('')
                          }}
                          placeholder="https://github.com/you/react-capstone"
                          value={repositoryUrl}
                        />
                      </div>

                      <div className="grid gap-2">
                        <label
                          className="text-sm font-medium"
                          htmlFor="project-demo-url"
                        >
                          Demo URL
                        </label>
                        <Input
                          autoComplete="url"
                          id="project-demo-url"
                          onChange={(event) => {
                            setDemoUrl(event.target.value)
                            setSubmitError('')
                            setSubmitSuccess('')
                          }}
                          placeholder="https://your-demo.example.com"
                          value={demoUrl}
                        />
                        <p className="text-xs text-muted-foreground">
                          Optional, but useful if the project is deployed.
                        </p>
                      </div>

                      <div className="grid gap-2">
                        <label
                          className="text-sm font-medium"
                          htmlFor="project-notes"
                        >
                          Notes
                        </label>
                        <textarea
                          className="min-h-36 w-full resize-y rounded-lg border bg-background px-3 py-2 text-sm leading-6 outline-none transition-shadow placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
                          id="project-notes"
                          onChange={(event) => {
                            setNotes(event.target.value)
                            setSubmitError('')
                            setSubmitSuccess('')
                          }}
                          placeholder="What did you build, what tradeoffs did you make, and what would you improve next?"
                          value={notes}
                        />
                      </div>

                      {submitError ? (
                        <p className="text-sm text-destructive" role="alert">
                          {submitError}
                        </p>
                      ) : null}

                      {submitSuccess ? (
                        <p
                          className="text-sm font-medium text-primary"
                          role="status"
                        >
                          {submitSuccess}
                        </p>
                      ) : null}
                    </>
                  ) : null}
                </div>
              </CardContent>
              {session.data ? (
                <CardFooter>
                  <Button
                    disabled={
                      isSubmitting || submissionState.status === 'loading'
                    }
                    onClick={() => {
                      void handleSubmitProject()
                    }}
                    type="button"
                  >
                    {isSubmitting
                      ? 'Submitting...'
                      : submission
                        ? 'Resubmit Project'
                        : 'Submit Project'}
                  </Button>
                </CardFooter>
              ) : null}
            </Card>
          </aside>
        </div>
      ) : null}
    </div>
  )
}
