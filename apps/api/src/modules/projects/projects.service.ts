import { prisma } from '../../shared/prisma.ts'

export function findPublishedProjectByTechnologyAndSlug(
  technologySlug: string,
  projectSlug: string,
) {
  return prisma.project.findFirst({
    where: {
      slug: projectSlug,
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
      brief: true,
      difficulty: true,
    },
  })
}
