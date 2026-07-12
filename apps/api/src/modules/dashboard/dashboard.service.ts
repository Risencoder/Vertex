import { ProgressStatus } from '../../generated/prisma/index.js'
import { prisma } from '../../shared/prisma.ts'

type PublishedLearningPath = Awaited<
  ReturnType<typeof getPublishedLearningPathTree>
>[number]

type PublishedTechnology =
  PublishedLearningPath['technologies'][number]['technology']

type PublishedModule = PublishedTechnology['modules'][number]

type PublishedLesson = PublishedModule['lessons'][number]

function isLessonCompleted(lesson: PublishedLesson) {
  return lesson.progress[0]?.status === ProgressStatus.COMPLETED
}

function isModuleCompleted(module: PublishedModule) {
  return (
    module.lessons.length > 0 &&
    module.lessons.every((lesson) => isLessonCompleted(lesson))
  )
}

function isTechnologyCompleted(technology: PublishedTechnology) {
  return (
    technology.modules.length > 0 &&
    technology.modules.every((module) => isModuleCompleted(module))
  )
}

function isLearningPathCompleted(learningPath: PublishedLearningPath) {
  return (
    learningPath.technologies.length > 0 &&
    learningPath.technologies.every(({ technology }) =>
      isTechnologyCompleted(technology),
    )
  )
}

function getPublishedLearningPathTree(userId: string) {
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
      technologies: {
        where: {
          technology: {
            isPublished: true,
          },
        },
        orderBy: {
          order: 'asc',
        },
        select: {
          order: true,
          technology: {
            select: {
              id: true,
              slug: true,
              title: true,
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
                  order: true,
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
                      order: true,
                      progress: {
                        where: {
                          userId,
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
          },
        },
      },
    },
  })
}

export async function getDashboardForUser(userId: string) {
  const learningPaths = await getPublishedLearningPathTree(userId)
  const technologies = new Map<string, PublishedTechnology>()
  const modules = new Map<string, PublishedModule>()
  const lessons = new Map<string, PublishedLesson>()

  learningPaths.forEach((learningPath) => {
    learningPath.technologies.forEach(({ technology }) => {
      technologies.set(technology.id, technology)

      technology.modules.forEach((module) => {
        modules.set(module.id, module)

        module.lessons.forEach((lesson) => {
          lessons.set(lesson.id, lesson)
        })
      })
    })
  })

  const lessonList = Array.from(lessons.values())
  const lessonsCompleted = lessonList.filter((lesson) =>
    isLessonCompleted(lesson),
  ).length
  const lessonsTotal = lessonList.length

  const continueLearning =
    learningPaths
      .flatMap((learningPath) =>
        learningPath.technologies.flatMap(({ technology }) =>
          technology.modules.flatMap((module) =>
            module.lessons.map((lesson) => ({
              learningPath,
              technology,
              module,
              lesson,
            })),
          ),
        ),
      )
      .find(({ lesson }) => !isLessonCompleted(lesson)) ?? null

  return {
    continueLearning: continueLearning
      ? {
          learningPathSlug: continueLearning.learningPath.slug,
          learningPathTitle: continueLearning.learningPath.title,
          technologySlug: continueLearning.technology.slug,
          technologyTitle: continueLearning.technology.title,
          moduleSlug: continueLearning.module.slug,
          moduleTitle: continueLearning.module.title,
          lessonSlug: continueLearning.lesson.slug,
          lessonTitle: continueLearning.lesson.title,
        }
      : null,
    statistics: {
      learningPathsCompleted: learningPaths.filter((learningPath) =>
        isLearningPathCompleted(learningPath),
      ).length,
      learningPathsTotal: learningPaths.length,
      technologiesCompleted: Array.from(technologies.values()).filter(
        (technology) => isTechnologyCompleted(technology),
      ).length,
      technologiesTotal: technologies.size,
      modulesCompleted: Array.from(modules.values()).filter((module) =>
        isModuleCompleted(module),
      ).length,
      modulesTotal: modules.size,
      lessonsCompleted,
      lessonsTotal,
      overallProgress:
        lessonsTotal > 0
          ? Math.round((lessonsCompleted / lessonsTotal) * 100)
          : 0,
    },
  }
}
