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

  console.log(`Seeded ${learningPaths.length} learning paths.`)
  console.log(`Seeded ${technologies.length} technologies.`)
  console.log(
    `Linked ${frontendEngineerTechnologies.length} technologies to Frontend Engineer.`,
  )
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
