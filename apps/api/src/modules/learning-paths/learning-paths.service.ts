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

export function findPublishedLearningPathBySlug(slug: string) {
  return prisma.learningPath
    .findFirst({
      where: {
        slug,
        isPublished: true,
      },
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        difficulty: true,
        technologies: {
          orderBy: {
            order: 'asc',
          },
          select: {
            technology: {
              select: {
                id: true,
                slug: true,
                title: true,
                description: true,
              },
            },
          },
        },
      },
    })
    .then((learningPath) => {
      if (!learningPath) {
        return null
      }

      return {
        id: learningPath.id,
        slug: learningPath.slug,
        title: learningPath.title,
        description: learningPath.description,
        difficulty: learningPath.difficulty,
        technologies: learningPath.technologies.map(({ technology }) => ({
          id: technology.id,
          slug: technology.slug,
          name: technology.title,
          description: technology.description,
        })),
      }
    })
}
