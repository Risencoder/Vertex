import { ProgressStatus } from '../../generated/prisma/index.js'
import { prisma } from '../../shared/prisma.ts'

export function findPublishedTechnologyBySlug(slug: string) {
  return findPublishedTechnologyBySlugForUser(slug)
}

export function findPublishedTechnologyBySlugForUser(
  slug: string,
  userId?: string,
) {
  return prisma.technology
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
            lessons: {
              where: {
                isPublished: true,
              },
              select: {
                id: true,
                progress: {
                  where: {
                    userId: userId ?? '',
                  },
                  select: {
                    status: true,
                  },
                  take: 1,
                },
              },
            },
          },
        },
      },
    })
    .then((technology) => {
      if (!technology) {
        return null
      }

      const modules = technology.modules.map((module) => {
        const totalLessons = module.lessons.length
        const completedLessons = module.lessons.filter(
          (lesson) => lesson.progress[0]?.status === ProgressStatus.COMPLETED,
        ).length
        const isCompleted =
          totalLessons > 0 && completedLessons === totalLessons

        return {
          id: module.id,
          slug: module.slug,
          title: module.title,
          description: module.description,
          order: module.order,
          difficulty: module.difficulty,
          isPublished: module.isPublished,
          progress: {
            completedLessons,
            totalLessons,
            percentage:
              totalLessons > 0
                ? Math.round((completedLessons / totalLessons) * 100)
                : 0,
            isCompleted,
          },
        }
      })

      const completedLessons = modules.reduce(
        (total, module) => total + module.progress.completedLessons,
        0,
      )
      const totalLessons = modules.reduce(
        (total, module) => total + module.progress.totalLessons,
        0,
      )
      const completedModules = modules.filter(
        (module) => module.progress.isCompleted,
      ).length
      const totalModules = modules.length

      return {
        id: technology.id,
        slug: technology.slug,
        title: technology.title,
        description: technology.description,
        category: technology.category,
        isPublished: technology.isPublished,
        modules,
        progress: {
          completedLessons,
          totalLessons,
          percentage:
            totalLessons > 0
              ? Math.round((completedLessons / totalLessons) * 100)
              : 0,
          completedModules,
          totalModules,
          isCompleted: totalModules > 0 && completedModules === totalModules,
        },
      }
    })
}

export function findPublishedModuleByTechnologyAndSlug(
  technologySlug: string,
  moduleSlug: string,
  userId?: string,
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
            progress: {
              where: {
                userId: userId ?? '',
              },
              select: {
                status: true,
                completedAt: true,
              },
              take: 1,
            },
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
        lessons: module.lessons.map((lesson) => {
          const [progress] = lesson.progress

          return {
            id: lesson.id,
            slug: lesson.slug,
            title: lesson.title,
            description: lesson.description,
            order: lesson.order,
            type: lesson.type,
            difficulty: lesson.difficulty,
            isPublished: lesson.isPublished,
            progress: progress ?? {
              status: ProgressStatus.NOT_STARTED,
              completedAt: null,
            },
          }
        }),
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
