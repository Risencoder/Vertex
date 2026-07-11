import { ProgressStatus } from '../../generated/prisma/index.js'
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

export function findPublishedLearningPathBySlug(slug: string, userId?: string) {
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
          where: {
            technology: {
              isPublished: true,
            },
          },
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
                modules: {
                  where: {
                    isPublished: true,
                  },
                  select: {
                    id: true,
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
            },
          },
        },
      },
    })
    .then((learningPath) => {
      if (!learningPath) {
        return null
      }

      const technologies = learningPath.technologies.map(({ technology }) => {
        const modules = technology.modules.map((module) => {
          const totalLessons = module.lessons.length
          const completedLessons = module.lessons.filter(
            (lesson) => lesson.progress[0]?.status === ProgressStatus.COMPLETED,
          ).length

          return {
            completedLessons,
            totalLessons,
            isCompleted: totalLessons > 0 && completedLessons === totalLessons,
          }
        })
        const completedLessons = modules.reduce(
          (total, module) => total + module.completedLessons,
          0,
        )
        const totalLessons = modules.reduce(
          (total, module) => total + module.totalLessons,
          0,
        )
        const completedModules = modules.filter(
          (module) => module.isCompleted,
        ).length
        const totalModules = modules.length
        const isCompleted =
          totalModules > 0 && completedModules === totalModules

        return {
          id: technology.id,
          slug: technology.slug,
          name: technology.title,
          description: technology.description,
          progress: {
            completedLessons,
            totalLessons,
            percentage:
              totalLessons > 0
                ? Math.round((completedLessons / totalLessons) * 100)
                : 0,
            completedModules,
            totalModules,
            isCompleted,
          },
        }
      })
      const completedLessons = technologies.reduce(
        (total, technology) => total + technology.progress.completedLessons,
        0,
      )
      const totalLessons = technologies.reduce(
        (total, technology) => total + technology.progress.totalLessons,
        0,
      )
      const completedTechnologies = technologies.filter(
        (technology) => technology.progress.isCompleted,
      ).length
      const totalTechnologies = technologies.length

      return {
        id: learningPath.id,
        slug: learningPath.slug,
        title: learningPath.title,
        description: learningPath.description,
        difficulty: learningPath.difficulty,
        technologies,
        progress: {
          completedLessons,
          totalLessons,
          percentage:
            totalLessons > 0
              ? Math.round((completedLessons / totalLessons) * 100)
              : 0,
          completedTechnologies,
          totalTechnologies,
          isCompleted:
            totalTechnologies > 0 &&
            completedTechnologies === totalTechnologies,
        },
      }
    })
}
