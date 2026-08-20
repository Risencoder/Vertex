import type { Prisma } from '../../generated/prisma/index.js'

export type MentorReviewStatus =
  'NEEDS_IMPROVEMENT' | 'READY_TO_CONTINUE' | 'REVIEW_UNAVAILABLE'

export type MentorReviewNextAction =
  'CONTINUE' | 'IMPROVE_AND_RESUBMIT' | 'REVIEW_CONCEPT'

export type MentorReviewOutput = {
  summary: string
  strengths: string[]
  issues: {
    title: string
    explanation: string
    severity: 'minor' | 'important'
  }[]
  hints: string[]
  nextAction: MentorReviewNextAction
  shouldRetry: boolean
  conceptTags?: string[]
}

export type MentorReviewContext = {
  lesson: {
    title: string
    description: string | null
  }
  module: {
    title: string
  }
  technology: {
    title: string
  }
  task: {
    title: string
    prompt: string | null
    starterCode: string | null
    metadata: Prisma.JsonValue | null
    validation: Prisma.JsonValue | null
  }
  response: Prisma.JsonValue
}

export type MentorReviewResult = {
  status: MentorReviewStatus
  output: MentorReviewOutput | null
  provider: string
  model: string
  errorMessage: string | null
}

export type MentorReviewer = {
  reviewCodeAttempt(context: MentorReviewContext): Promise<MentorReviewResult>
}

const localMockProvider = 'LOCAL_MOCK'
const localMockModel = 'mentor-review-v1-contract'

function isRecord(value: Prisma.JsonValue): value is Prisma.JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function getAttempt(response: Prisma.JsonValue) {
  if (!isRecord(response)) {
    return ''
  }

  const attempt = response.attempt ?? response.code

  return typeof attempt === 'string' ? attempt : ''
}

function createReviewOutput(
  context: MentorReviewContext,
  status: Exclude<MentorReviewStatus, 'REVIEW_UNAVAILABLE'>,
): MentorReviewOutput {
  if (status === 'READY_TO_CONTINUE') {
    return {
      summary:
        'The local mock reviewer found a changed code attempt that is ready for the next learning step.',
      strengths: [
        'The attempt is not the unchanged starter code.',
        'The learner submitted code that can be reviewed later by a real mentor provider.',
      ],
      issues: [],
      hints: [
        'When AI review is enabled, this step should check the solution against the task rubric.',
      ],
      nextAction: 'CONTINUE',
      shouldRetry: false,
      conceptTags: [context.technology.title, context.module.title],
    }
  }

  return {
    summary:
      'The local mock reviewer found signs that the attempt still needs another pass.',
    strengths: ['The learner submitted an attempt for review.'],
    issues: [
      {
        title: 'Incomplete attempt markers remain',
        explanation:
          'The code still appears to contain placeholder or TODO-style markers. Replace them with your own implementation before continuing.',
        severity: 'important',
      },
    ],
    hints: [
      'Focus on the task prompt and remove placeholder comments that describe unfinished work.',
    ],
    nextAction: 'IMPROVE_AND_RESUBMIT',
    shouldRetry: true,
    conceptTags: [context.technology.title, context.module.title],
  }
}

export function isValidMentorReviewOutput(
  value: MentorReviewOutput | null,
): value is MentorReviewOutput {
  if (!value || typeof value !== 'object') {
    return false
  }

  return (
    typeof value.summary === 'string' &&
    Array.isArray(value.strengths) &&
    Array.isArray(value.issues) &&
    Array.isArray(value.hints) &&
    typeof value.nextAction === 'string' &&
    typeof value.shouldRetry === 'boolean'
  )
}

export const localMockMentorReviewer: MentorReviewer = {
  async reviewCodeAttempt(context) {
    const attempt = getAttempt(context.response)
    const hasIncompleteMarkers =
      /\bTODO\b|throw new Error|your code here/i.test(attempt)
    const status: Exclude<MentorReviewStatus, 'REVIEW_UNAVAILABLE'> =
      hasIncompleteMarkers ? 'NEEDS_IMPROVEMENT' : 'READY_TO_CONTINUE'

    return {
      status,
      output: createReviewOutput(context, status),
      provider: localMockProvider,
      model: localMockModel,
      errorMessage: null,
    }
  },
}
