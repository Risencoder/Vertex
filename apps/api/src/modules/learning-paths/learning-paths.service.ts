import { prisma } from '../../shared/prisma.ts'

export function listPublishedLearningPaths() {
  return prisma.learningPath.findMany({
    where: {
      isPublished: true,
    },
    orderBy: {
      title: 'asc',
    },
    select: {
      id: true,
      slug: true,
      title: true,
      description: true,
      difficulty: true,
      isPublished: true,
    },
  })
}
