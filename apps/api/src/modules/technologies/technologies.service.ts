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

export function findPublishedModuleByTechnologyAndSlug(
  technologySlug: string,
  moduleSlug: string,
) {
  return prisma.module
    .findFirst({
      where: {
        slug: moduleSlug,
        isPublished: true,
        technology: {
          slug: technologySlug,
          isPublished: true,
        },
      },
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        order: true,
        difficulty: true,
        isPublished: true,
        technology: {
          select: {
            id: true,
            slug: true,
            title: true,
          },
        },
        lessons: {
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
            type: true,
            difficulty: true,
            isPublished: true,
          },
        },
      },
    })
    .then((module) => {
      if (!module) {
        return null
      }

      return {
        technology: module.technology,
        module: {
          id: module.id,
          slug: module.slug,
          title: module.title,
          description: module.description,
          order: module.order,
          difficulty: module.difficulty,
          isPublished: module.isPublished,
        },
        lessons: module.lessons,
      }
    })
}
