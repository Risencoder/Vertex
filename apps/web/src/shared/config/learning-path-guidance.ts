import type { Technology } from '@/shared/api/learning-paths'

type TechnologyPrerequisite = {
  slug: string
  label: string
  importance: 'required' | 'recommended'
  description: string
}

export const frontendEngineerPathCopy = {
  description: 'This is the recommended path. You can jump ahead at any time.',
}

export const technologyPrerequisites: Record<string, TechnologyPrerequisite[]> =
  {
    react: [
      {
        slug: 'javascript',
        label: 'JavaScript fundamentals',
        importance: 'required',
        description:
          'Functions, arrays, objects, callbacks, modules, and async basics.',
      },
      {
        slug: 'typescript',
        label: 'TypeScript fundamentals',
        importance: 'required',
        description: 'Basic types, unions, object shapes, and function types.',
      },
      {
        slug: 'html',
        label: 'HTML semantics',
        importance: 'required',
        description:
          'Semantic structure, forms, labels, and accessibility basics.',
      },
      {
        slug: 'css',
        label: 'CSS layout basics',
        importance: 'required',
        description:
          'Box model, layout flow, Flexbox/Grid basics, and responsive thinking.',
      },
      {
        slug: 'git',
        label: 'Git workflow',
        importance: 'recommended',
        description:
          'Commits, branches, and repository workflow for real projects.',
      },
    ],
  }

export function getTechnologyPrerequisites(technologySlug: string) {
  return technologyPrerequisites[technologySlug] ?? []
}

export function getRecommendedNextTechnology(technologies: Technology[]) {
  return technologies.find(
    (technology) =>
      technology.progress.totalLessons > 0 && !technology.progress.isCompleted,
  )
}

export function getUnmetPrerequisites(
  technology: Technology,
  technologies: Technology[],
) {
  const technologiesBySlug = new Map(
    technologies.map((pathTechnology) => [pathTechnology.slug, pathTechnology]),
  )

  return getTechnologyPrerequisites(technology.slug).filter((prerequisite) => {
    const prerequisiteTechnology = technologiesBySlug.get(prerequisite.slug)

    return !prerequisiteTechnology?.progress.isCompleted
  })
}
