import { existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { loadEnvFile } from 'node:process'
import { fileURLToPath } from 'node:url'

import { PrismaPg } from '@prisma/adapter-pg'

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
  'javascript',
  'typescript',
  'react',
  'git',
  'testing',
]

const reactModules = [
  {
    slug: 'react-basics',
    title: 'React Basics',
    description: 'Understand React fundamentals and the component model.',
    order: 1,
    difficulty: 'BEGINNER',
    isPublished: true,
  },
  {
    slug: 'components-and-props',
    title: 'Components and Props',
    description: 'Create reusable components and pass data with props.',
    order: 2,
    difficulty: 'BEGINNER',
    isPublished: true,
  },
  {
    slug: 'state-and-events',
    title: 'State and Events',
    description: 'Manage local state and respond to user interactions.',
    order: 3,
    difficulty: 'BEGINNER',
    isPublished: true,
  },
  {
    slug: 'hooks',
    title: 'Hooks',
    description: 'Use React hooks to manage stateful component behavior.',
    order: 4,
    difficulty: 'INTERMEDIATE',
    isPublished: true,
  },
  {
    slug: 'routing',
    title: 'Routing',
    description: 'Build multi-page flows with client-side routing.',
    order: 5,
    difficulty: 'INTERMEDIATE',
    isPublished: true,
  },
  {
    slug: 'forms',
    title: 'Forms',
    description:
      'Create accessible forms with validation and submission states.',
    order: 6,
    difficulty: 'INTERMEDIATE',
    isPublished: true,
  },
  {
    slug: 'performance',
    title: 'Performance',
    description: 'Improve rendering behavior and user-perceived performance.',
    order: 7,
    difficulty: 'ADVANCED',
    isPublished: true,
  },
]

const reactBasicsLessons = [
  {
    slug: 'what-is-react',
    title: 'What is React?',
    description: 'Learn what React is and where it fits in modern web apps.',
    order: 1,
    type: 'ARTICLE',
    difficulty: 'BEGINNER',
    isPublished: true,
  },
  {
    slug: 'setting-up-a-react-project',
    title: 'Setting up a React project',
    description: 'Create a local React project and understand the file layout.',
    order: 2,
    type: 'EXERCISE',
    difficulty: 'BEGINNER',
    isPublished: true,
  },
  {
    slug: 'jsx-fundamentals',
    title: 'JSX fundamentals',
    description: 'Write JSX and understand how it describes UI structure.',
    order: 3,
    type: 'ARTICLE',
    difficulty: 'BEGINNER',
    isPublished: true,
  },
  {
    slug: 'components-overview',
    title: 'Components overview',
    description: 'Break UI into small, reusable React components.',
    order: 4,
    type: 'ARTICLE',
    difficulty: 'BEGINNER',
    isPublished: true,
  },
  {
    slug: 'rendering-data',
    title: 'Rendering data',
    description: 'Render values and lists from data in React components.',
    order: 5,
    type: 'EXERCISE',
    difficulty: 'BEGINNER',
    isPublished: true,
  },
  {
    slug: 'basic-practice',
    title: 'Basic practice',
    description: 'Practice the React basics by building a small UI section.',
    order: 6,
    type: 'EXERCISE',
    difficulty: 'BEGINNER',
    isPublished: true,
  },
]

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

  const reactBasicsModule = await prisma.module.findUniqueOrThrow({
    where: {
      technologyId_slug: {
        technologyId: reactTechnology.id,
        slug: 'react-basics',
      },
    },
    select: {
      id: true,
    },
  })

  for (const lesson of reactBasicsLessons) {
    await prisma.lesson.upsert({
      where: {
        moduleId_slug: {
          moduleId: reactBasicsModule.id,
          slug: lesson.slug,
        },
      },
      update: lesson,
      create: {
        ...lesson,
        moduleId: reactBasicsModule.id,
      },
    })
  }

  console.log(`Seeded ${learningPaths.length} learning paths.`)
  console.log(`Seeded ${technologies.length} technologies.`)
  console.log(
    `Linked ${frontendEngineerTechnologies.length} technologies to Frontend Engineer.`,
  )
  console.log(`Seeded ${reactModules.length} React modules.`)
  console.log(`Seeded ${reactBasicsLessons.length} React Basics lessons.`)
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
