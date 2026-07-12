import { ProgressStatus } from '../../generated/prisma/index.js'
import { prisma } from '../../shared/prisma.ts'

export async function getLessonProgressForUser(
  userId: string,
  lessonId: string,
) {
  const lesson = await prisma.lesson.findFirst({
    where: {
      id: lessonId,
      isPublished: true,
    },
    select: {
      id: true,
    },
  })

  if (!lesson) {
    return null
  }

  const progress = await prisma.lessonProgress.findUnique({
    where: {
      userId_lessonId: {
        userId,
        lessonId,
      },
    },
    select: {
      lessonId: true,
      status: true,
      completedAt: true,
    },
  })

  return (
    progress ?? {
      lessonId,
      status: ProgressStatus.NOT_STARTED,
      completedAt: null,
    }
  )
}

export async function completeLessonForUser(userId: string, lessonId: string) {
  const lesson = await prisma.lesson.findFirst({
    where: {
      id: lessonId,
      isPublished: true,
    },
    select: {
      id: true,
    },
  })

  if (!lesson) {
    return null
  }

  return prisma.lessonProgress.upsert({
    where: {
      userId_lessonId: {
        userId,
        lessonId,
      },
    },
    update: {
      status: ProgressStatus.COMPLETED,
      completedAt: new Date(),
    },
    create: {
      userId,
      lessonId,
      status: ProgressStatus.COMPLETED,
      completedAt: new Date(),
    },
    select: {
      lessonId: true,
      status: true,
      completedAt: true,
    },
  })
}
