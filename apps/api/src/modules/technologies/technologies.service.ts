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

export function findPublishedLessonByModuleAndTechnologySlug(
  technologySlug: string,
  moduleSlug: string,
  lessonSlug: string,
) {
  return prisma.lesson
    .findFirst({
      where: {
        slug: lessonSlug,
        isPublished: true,
        module: {
          slug: moduleSlug,
          isPublished: true,
          technology: {
            slug: technologySlug,
            isPublished: true,
          },
        },
      },
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        content: true,
        order: true,
        type: true,
        difficulty: true,
        isPublished: true,
        moduleId: true,
        module: {
          select: {
            id: true,
            slug: true,
            title: true,
            technology: {
              select: {
                id: true,
                slug: true,
                title: true,
              },
            },
          },
        },
      },
    })
    .then((lesson) => {
      if (!lesson) {
        return null
      }

      return Promise.all([
        prisma.lesson.findFirst({
          where: {
            moduleId: lesson.moduleId,
            isPublished: true,
            order: {
              lt: lesson.order,
            },
          },
          orderBy: {
            order: 'desc',
          },
          select: {
            slug: true,
            title: true,
            order: true,
          },
        }),
        prisma.lesson.findFirst({
          where: {
            moduleId: lesson.moduleId,
            isPublished: true,
            order: {
              gt: lesson.order,
            },
          },
          orderBy: {
            order: 'asc',
          },
          select: {
            slug: true,
            title: true,
            order: true,
          },
        }),
      ]).then(([previousLesson, nextLesson]) => ({
        technology: lesson.module.technology,
        module: {
          id: lesson.module.id,
          slug: lesson.module.slug,
          title: lesson.module.title,
        },
        lesson: {
          id: lesson.id,
          slug: lesson.slug,
          title: lesson.title,
          description: lesson.description,
          content: lesson.content,
          order: lesson.order,
          type: lesson.type,
          difficulty: lesson.difficulty,
          isPublished: lesson.isPublished,
        },
        previousLesson,
        nextLesson,
      }))
    })
}
