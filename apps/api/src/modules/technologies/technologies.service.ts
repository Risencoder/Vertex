import { prisma } from '../../shared/prisma.ts'

export function findPublishedTechnologyBySlug(slug: string) {
  return prisma.technology.findFirst({
    where: {
      slug,
      isPublished: true,
    },
    select: {
      id: true,
      slug: true,
      title: true,
      description: true,
      category: true,
      isPublished: true,
      modules: {
        where: {
          isPublished: true,
        },
        orderBy: {
          order: 'asc',
        },
        select: {
          id: true,
          slug: true,
          title: true,
          description: true,
          order: true,
          difficulty: true,
          isPublished: true,
        },
      },
    },
  })
}
