import { existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { loadEnvFile } from 'node:process'
import { fileURLToPath } from 'node:url'

import { PrismaPg } from '@prisma/adapter-pg'

import {
  loadReactProjectContent,
  loadReactModuleContent,
} from './content-loader.mjs'
import { PrismaClient } from '../src/generated/prisma/index.js'

const prismaRoot = dirname(fileURLToPath(import.meta.url))
const envPath = resolve(prismaRoot, '../.env')

if (existsSync(envPath)) {
  loadEnvFile(envPath)
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL ?? '',
  }),
})

const learningPaths = [
  {
    slug: 'ai-engineer',
    title: 'AI Engineer',
    description:
      'Build AI-powered products with practical engineering workflows.',
    difficulty: 'INTERMEDIATE',
    isPublished: true,
  },
  {
    slug: 'backend-engineer',
    title: 'Backend Engineer',
    description:
      'Design APIs, services, data models, and reliable server systems.',
    difficulty: 'BEGINNER',
    isPublished: true,
  },
  {
    slug: 'frontend-engineer',
    title: 'Frontend Engineer',
    description:
      'Create accessible, maintainable, production-ready web interfaces.',
    difficulty: 'BEGINNER',
    isPublished: true,
  },
  {
    slug: 'full-stack-engineer',
    title: 'Full Stack Engineer',
    description:
      'Connect frontend, backend, data, and deployment into complete products.',
    difficulty: 'INTERMEDIATE',
    isPublished: true,
  },
]

const technologies = [
  {
    slug: 'html',
    title: 'HTML',
    description: 'Structure semantic, accessible web documents.',
    category: 'frontend',
    isPublished: true,
  },
  {
    slug: 'css',
    title: 'CSS',
    description:
      'Style responsive interfaces with maintainable layout systems.',
    category: 'frontend',
    isPublished: true,
  },
  {
    slug: 'javascript',
    title: 'JavaScript',
    description: 'Build interactive browser behavior with modern JavaScript.',
    category: 'frontend',
    isPublished: true,
  },
  {
    slug: 'typescript',
    title: 'TypeScript',
    description: 'Add strong typing to scalable JavaScript applications.',
    category: 'frontend',
    isPublished: true,
  },
  {
    slug: 'react',
    title: 'React',
    description:
      'Create component-driven user interfaces for web applications.',
    category: 'frontend',
    isPublished: true,
  },
  {
    slug: 'git',
    title: 'Git',
    description:
      'Track changes and collaborate with version control workflows.',
    category: 'engineering',
    isPublished: true,
  },
  {
    slug: 'testing',
    title: 'Testing',
    description: 'Verify application behavior with practical automated tests.',
    category: 'engineering',
    isPublished: true,
  },
]

const frontendEngineerTechnologies = [
  'html',
  'css',
  'git',
  'javascript',
  'typescript',
  'react',
  'testing',
]

const reactBasicsContent = loadReactModuleContent('react-basics')
const componentsAndPropsContent = loadReactModuleContent('components-and-props')
const stateAndEventsContent = loadReactModuleContent('state-and-events')
const hooksContent = loadReactModuleContent('hooks')
const routingContent = loadReactModuleContent('routing')
const formsContent = loadReactModuleContent('forms')
const performanceContent = loadReactModuleContent('performance')
const reactCapstoneProject = loadReactProjectContent('react-capstone')

const reactModuleContents = [
  reactBasicsContent,
  componentsAndPropsContent,
  stateAndEventsContent,
  hooksContent,
  routingContent,
  formsContent,
  performanceContent,
]

const reactModules = reactModuleContents.map(
  (moduleContent) => moduleContent.module,
)

async function seedContentModuleLessons(moduleContent, moduleId) {
  for (const lesson of moduleContent.lessons) {
    const { tasks: _tasks, ...lessonData } = lesson

    await prisma.lesson.upsert({
      where: {
        moduleId_slug: {
          moduleId,
          slug: lessonData.slug,
        },
      },
      update: lessonData,
      create: {
        ...lessonData,
        moduleId,
      },
    })
  }

  let taskCount = 0

  for (const lesson of moduleContent.lessons) {
    const seededLesson = await prisma.lesson.findUniqueOrThrow({
      where: {
        moduleId_slug: {
          moduleId,
          slug: lesson.slug,
        },
      },
      select: {
        id: true,
      },
    })
    const { tasks } = lesson

    for (const task of tasks) {
      await prisma.lessonTask.upsert({
        where: {
          lessonId_key: {
            lessonId: seededLesson.id,
            key: task.key,
          },
        },
        update: task,
        create: {
          ...task,
          lessonId: seededLesson.id,
        },
      })
    }

    taskCount += tasks.length
  }

  return taskCount
}

async function main() {
  for (const learningPath of learningPaths) {
    await prisma.learningPath.upsert({
      where: {
        slug: learningPath.slug,
      },
      update: learningPath,
      create: learningPath,
    })
  }

  for (const technology of technologies) {
    await prisma.technology.upsert({
      where: {
        slug: technology.slug,
      },
      update: technology,
      create: technology,
    })
  }

  const frontendEngineer = await prisma.learningPath.findUniqueOrThrow({
    where: {
      slug: 'frontend-engineer',
    },
    select: {
      id: true,
    },
  })

  await prisma.learningPathTechnology.updateMany({
    where: {
      learningPathId: frontendEngineer.id,
    },
    data: {
      order: {
        increment: 1000,
      },
    },
  })

  for (const [
    index,
    technologySlug,
  ] of frontendEngineerTechnologies.entries()) {
    const technology = await prisma.technology.findUniqueOrThrow({
      where: {
        slug: technologySlug,
      },
      select: {
        id: true,
      },
    })

    await prisma.learningPathTechnology.upsert({
      where: {
        learningPathId_technologyId: {
          learningPathId: frontendEngineer.id,
          technologyId: technology.id,
        },
      },
      update: {
        order: index + 1,
        isRequired: true,
      },
      create: {
        learningPathId: frontendEngineer.id,
        technologyId: technology.id,
        order: index + 1,
        isRequired: true,
      },
    })
  }

  const reactTechnology = await prisma.technology.findUniqueOrThrow({
    where: {
      slug: 'react',
    },
    select: {
      id: true,
    },
  })

  for (const module of reactModules) {
    await prisma.module.upsert({
      where: {
        technologyId_slug: {
          technologyId: reactTechnology.id,
          slug: module.slug,
        },
      },
      update: module,
      create: {
        ...module,
        technologyId: reactTechnology.id,
      },
    })
  }

  const reactModuleTaskCounts = new Map()

  for (const moduleContent of reactModuleContents) {
    const reactModule = await prisma.module.findUniqueOrThrow({
      where: {
        technologyId_slug: {
          technologyId: reactTechnology.id,
          slug: moduleContent.module.slug,
        },
      },
      select: {
        id: true,
      },
    })

    reactModuleTaskCounts.set(
      moduleContent.module.slug,
      await seedContentModuleLessons(moduleContent, reactModule.id),
    )
  }

  const reactCapstoneLearningPathId = reactCapstoneProject.learningPathSlug
    ? (
        await prisma.learningPath.findUniqueOrThrow({
          where: {
            slug: reactCapstoneProject.learningPathSlug,
          },
          select: {
            id: true,
          },
        })
      ).id
    : null
  const reactCapstoneProjectData = {
    slug: reactCapstoneProject.slug,
    title: reactCapstoneProject.title,
    description: reactCapstoneProject.description,
    brief: reactCapstoneProject.brief,
    difficulty: reactCapstoneProject.difficulty,
    isPublished: reactCapstoneProject.isPublished,
  }
  const reactCapstone = await prisma.project.upsert({
    where: {
      technologyId_slug: {
        technologyId: reactTechnology.id,
        slug: reactCapstoneProject.slug,
      },
    },
    update: {
      ...reactCapstoneProjectData,
      learningPathId: reactCapstoneLearningPathId,
    },
    create: {
      ...reactCapstoneProjectData,
      technologyId: reactTechnology.id,
      learningPathId: reactCapstoneLearningPathId,
    },
    select: {
      id: true,
    },
  })

  console.log(`Seeded ${learningPaths.length} learning paths.`)
  console.log(`Seeded ${technologies.length} technologies.`)
  console.log(
    `Linked ${frontendEngineerTechnologies.length} technologies to Frontend Engineer.`,
  )
  console.log(`Seeded ${reactModules.length} React modules.`)
  console.log(
    `Seeded ${reactBasicsContent.lessons.length} React Basics lessons.`,
  )
  console.log(
    `Seeded ${reactModuleTaskCounts.get('react-basics')} React Basics tasks.`,
  )
  console.log(
    `Seeded ${componentsAndPropsContent.lessons.length} Components and Props lessons.`,
  )
  console.log(
    `Seeded ${reactModuleTaskCounts.get('components-and-props')} Components and Props tasks.`,
  )
  console.log(
    `Seeded ${stateAndEventsContent.lessons.length} State and Events lessons.`,
  )
  console.log(
    `Seeded ${reactModuleTaskCounts.get('state-and-events')} State and Events tasks.`,
  )
  console.log(`Seeded ${hooksContent.lessons.length} Hooks lessons.`)
  console.log(`Seeded ${reactModuleTaskCounts.get('hooks')} Hooks tasks.`)
  console.log(`Seeded ${routingContent.lessons.length} Routing lessons.`)
  console.log(`Seeded ${reactModuleTaskCounts.get('routing')} Routing tasks.`)
  console.log(`Seeded ${formsContent.lessons.length} Forms lessons.`)
  console.log(`Seeded ${reactModuleTaskCounts.get('forms')} Forms tasks.`)
  console.log(
    `Seeded ${performanceContent.lessons.length} Performance lessons.`,
  )
  console.log(
    `Seeded ${reactModuleTaskCounts.get('performance')} Performance tasks.`,
  )
  console.log(`Seeded React Capstone project: ${reactCapstone.id}.`)
}

main()
  .then(async () => {
    await prisma['$disconnect']()
  })
  .catch(async (error) => {
    console.error(error)
    await prisma['$disconnect']()
    process.exit(1)
  })
