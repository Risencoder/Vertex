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
    content: `# What is React?

React is a JavaScript library for building user interfaces. It helps you describe what the UI should look like for a given state, and React updates the screen when that state changes.

## Component-based UI

React applications are built from components. A component is a small, reusable piece of UI that can receive data and return markup.

\`\`\`tsx
function WelcomeMessage({ name }: { name: string }) {
  return <h1>Welcome, {name}</h1>
}
\`\`\`

## Declarative rendering

Instead of manually changing the DOM step by step, you describe the final UI. React handles the updates.

For example, if a user is signed in, render a dashboard. If not, render a login link. Your component describes both states clearly.

## Where React fits

React lives in the frontend layer. It is commonly used with routing, forms, API calls, and design systems to build interactive web applications.

## Summary

React is useful because it makes UI code easier to split into components, reason about, and update as application state changes.`,
    order: 1,
    type: 'ARTICLE',
    difficulty: 'BEGINNER',
    isPublished: true,
  },
  {
    slug: 'setting-up-a-react-project',
    title: 'Setting up a React project',
    description: 'Create a local React project and understand the file layout.',
    content: `# Setting up a React project

A React project needs a development server, a build step, and a clear source folder. In modern projects, Vite is a common choice because it starts quickly and keeps configuration small.

## Create the project

The usual workflow is to scaffold the app, install dependencies, and start the development server.

\`\`\`bash
pnpm create vite my-app --template react-ts
cd my-app
pnpm install
pnpm dev
\`\`\`

## Understand the important files

The \`src/main.tsx\` file mounts React into the page. The \`src/App.tsx\` file usually contains the first component you see in the browser.

## Keep the structure simple

At the beginning, avoid creating too many folders. Add structure when the app starts to have clear responsibilities such as shared UI, pages, routes, and API helpers.

## Summary

A good setup gives you fast feedback, a predictable entry point, and a place to grow the app without adding complexity too early.`,
    order: 2,
    type: 'EXERCISE',
    difficulty: 'BEGINNER',
    isPublished: true,
  },
  {
    slug: 'jsx-fundamentals',
    title: 'JSX fundamentals',
    description: 'Write JSX and understand how it describes UI structure.',
    content: `# JSX fundamentals

JSX is a syntax that lets you describe UI inside JavaScript or TypeScript. It looks similar to HTML, but it is part of your component code.

## Expressions inside markup

Use curly braces to place JavaScript expressions inside JSX.

\`\`\`tsx
const userName = 'Ada'

function Greeting() {
  return <p>Hello, {userName}</p>
}
\`\`\`

## Attributes and class names

JSX uses \`className\` instead of \`class\`, because \`class\` is already a JavaScript keyword.

\`\`\`tsx
function Badge() {
  return <span className="badge">Beginner</span>
}
\`\`\`

## Return one parent element

A component returns one JSX tree. If you need multiple elements, wrap them in a parent element or a fragment.

## Summary

JSX is the bridge between component logic and UI structure. It stays readable when you keep expressions small and components focused.`,
    order: 3,
    type: 'ARTICLE',
    difficulty: 'BEGINNER',
    isPublished: true,
  },
  {
    slug: 'components-overview',
    title: 'Components overview',
    description: 'Break UI into small, reusable React components.',
    content: `# Components overview

Components are the core building blocks of React. A component is a function that returns UI and can be reused across the application.

## Start with a small responsibility

A good component does one clear job. For example, a card component can render a title and description without knowing where the data came from.

\`\`\`tsx
function InfoCard({ title, description }: { title: string; description: string }) {
  return (
    <section>
      <h2>{title}</h2>
      <p>{description}</p>
    </section>
  )
}
\`\`\`

## Compose components

React apps grow by composing small components into larger screens. Pages can use layout components, UI components, and feature-specific components together.

## Keep data flow visible

Pass data into components with props. This keeps the component predictable and easier to test.

## Summary

Components help you split UI into reusable pieces. Keep them focused, compose them thoughtfully, and pass data explicitly.`,
    order: 4,
    type: 'ARTICLE',
    difficulty: 'BEGINNER',
    isPublished: true,
  },
  {
    slug: 'rendering-data',
    title: 'Rendering data',
    description: 'Render values and lists from data in React components.',
    content: `# Rendering data

Most React screens are built from data. The component receives values and turns them into visible UI.

## Render simple values

Use JSX expressions to render strings, numbers, and computed values.

\`\`\`tsx
function ProfileSummary({ name }: { name: string }) {
  return <p>Welcome back, {name}</p>
}
\`\`\`

## Render lists

Use \`map\` to render arrays. Each item needs a stable \`key\` so React can track changes.

\`\`\`tsx
const lessons = ['JSX fundamentals', 'Components overview']

function LessonList() {
  return (
    <ul>
      {lessons.map((lesson) => (
        <li key={lesson}>{lesson}</li>
      ))}
    </ul>
  )
}
\`\`\`

## Handle empty data

If an array is empty, show a helpful empty state instead of a blank area.

## Summary

Rendering data means turning values, arrays, and empty states into clear UI. Stable keys and explicit states make the screen easier to reason about.`,
    order: 5,
    type: 'EXERCISE',
    difficulty: 'BEGINNER',
    isPublished: true,
  },
  {
    slug: 'basic-practice',
    title: 'Basic practice',
    description: 'Practice the React basics by building a small UI section.',
    content: `# Basic practice

Practice helps connect the ideas from the previous lessons. The goal is to build a small section using JSX, components, props, and list rendering.

## Build a lesson card

Create a component that receives a title, description, and difficulty.

\`\`\`tsx
type LessonCardProps = {
  title: string
  description: string
  difficulty: string
}

function LessonCard({ title, description, difficulty }: LessonCardProps) {
  return (
    <article>
      <h2>{title}</h2>
      <p>{description}</p>
      <span>{difficulty}</span>
    </article>
  )
}
\`\`\`

## Render a small list

Create an array of lessons and render one card for each item. Use a stable key such as a slug.

## Check the result

Make sure each card shows the correct data and the component still looks clear when descriptions are longer.

## Summary

This practice combines the basics: JSX for structure, props for data, and list rendering for repeated UI.`,
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
