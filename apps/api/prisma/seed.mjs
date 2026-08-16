import { createHash } from 'node:crypto'
import { existsSync, readFileSync } from 'node:fs'
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

function readMarkdownLesson(fileName) {
  return readFileSync(
    resolve(
      prismaRoot,
      '../../../docs/content/react/state-and-events',
      fileName,
    ),
    'utf8',
  )
}

function extractMarkdownSection(markdown, sectionHeading) {
  const lines = markdown.split('\n')
  const sectionIndex = lines.findIndex((line) => line.trim() === sectionHeading)

  if (sectionIndex === -1) {
    return ''
  }

  const nextSectionIndex = lines.findIndex(
    (line, index) => index > sectionIndex && /^## \d+\./.test(line.trim()),
  )

  return lines
    .slice(sectionIndex, nextSectionIndex === -1 ? undefined : nextSectionIndex)
    .join('\n')
    .trim()
}

function hashStarterCode(starterCode) {
  return createHash('sha256').update(starterCode.trim()).digest('hex')
}

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

## 1. Lesson Goal

Understand React as a tool for describing user interfaces with components, not as a magic layer that replaces HTML, CSS, or JavaScript.

By the end, you should be able to explain what React does, where it fits in a frontend app, and why component-based UI matters.

## 2. Why It Matters

Real products change constantly. A dashboard may show a signed-in user, an empty state, a loading message, or a list of lessons.

Without structure, UI code becomes a pile of manual DOM updates. React gives you a way to describe the screen as small pieces and let the rendering layer update the browser when data changes.

## 3. Core Concept

React is a JavaScript library for building user interfaces. Its main idea is simple: write components that describe what should appear on screen.

A component is usually a function that returns JSX.

\`\`\`tsx
function WelcomeCard() {
  return (
    <section>
      <h1>Welcome back</h1>
      <p>Continue your learning path.</p>
    </section>
  )
}
\`\`\`

React does not remove HTML or CSS. It gives you a component model for organizing them with JavaScript.

## 4. Mental Model

Think of a React component as a recipe for part of the UI.

The component receives information, decides what the UI should look like, and returns a description of that UI. React compares that description with what is already on the screen and updates the browser.

You focus on the desired result. React handles the rendering mechanics.

## 5. Guided Walkthrough

A small product screen may start like this:

\`\`\`tsx
function LearningStatus() {
  const lessonCount = 3

  return (
    <section>
      <h2>React Basics</h2>
      <p>{lessonCount} lessons available</p>
    </section>
  )
}
\`\`\`

Notice what React adds:

1. The UI has a name: \`LearningStatus\`.
2. Markup and small display logic live together.
3. The component can later receive data from another part of the app.

This is the foundation for larger screens.

## 6. Common Mistakes

### Mistake 1: Thinking React is a full application by itself

React handles UI. A production app also needs routing, data fetching, styling, accessibility, testing, and deployment.

### Mistake 2: Treating components as random snippets

A component should represent a meaningful piece of UI. If the name does not explain its purpose, the component may not be clear yet.

### Mistake 3: Forgetting that React is still JavaScript

React components are JavaScript or TypeScript functions. Variables, arrays, functions, and conditions still matter.

## 7. Practice Task

Build a small \`LearningStatus\` component.

Requirements:

1. Render a section with a heading.
2. Show the name of a learning path.
3. Show how many lessons are available.
4. Show a short message that explains what the learner should do next.
5. Keep the component focused on displaying UI only.

The goal is to practice thinking in components, not to add state or fetch data.

## 8. Self-Check

Before moving on, check that:

- You can explain what React does in one or two sentences.
- Your component has a clear name.
- The component returns one understandable UI section.
- You did not add unrelated behavior.
- You can identify where HTML-like structure, JavaScript values, and React components meet.

## 9. Reflection

In your own words, explain this:

Why is React useful for building interfaces that change over time?

Your answer should mention components or describing UI from data.

## 10. Next Step

Next, you will look at the project setup that lets React code run locally and grow into a real application.`,
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

## 1. Lesson Goal

Understand the basic files and workflow of a modern React project so you know where code starts, where components live, and how the app runs.

## 2. Why It Matters

Junior developers often lose time because the project feels like a black box. They can edit a component, but they do not know how that code reaches the browser.

A clear setup mental model makes debugging easier. When something fails, you can ask better questions: did the dev server start, did TypeScript compile, did React mount, or did the component render incorrectly?

## 3. Core Concept

A React project usually has three important parts:

1. A package file that defines scripts and dependencies.
2. A source folder where application code lives.
3. A build tool that runs the development server and creates production files.

With Vite, a common setup flow looks like this:

\`\`\`bash
pnpm create vite my-app --template react-ts
cd my-app
pnpm install
pnpm dev
\`\`\`

## 4. Mental Model

Think of the project as a small workshop.

The package scripts are the switches. The build tool is the machinery. The \`src\` folder is your workbench. React components are the pieces you assemble into the UI.

When you run the dev script, the workshop turns on and shows your app in the browser.

## 5. Guided Walkthrough

The entry file usually mounts React:

\`\`\`tsx
import { createRoot } from 'react-dom/client'
import { App } from './App'

createRoot(document.getElementById('root')!).render(<App />)
\`\`\`

The \`App\` component is often the first visible component:

\`\`\`tsx
export function App() {
  return <h1>Hello React</h1>
}
\`\`\`

This means the browser loads HTML, React finds the root element, and your component tree starts from \`App\`.

## 6. Common Mistakes

### Mistake 1: Editing generated files without understanding them

Generated starter files are not sacred. They are a starting point. Learn which files are entry points and which are examples.

### Mistake 2: Creating too many folders too early

Structure should help you find code. A beginner project does not need every folder a large production app might use.

### Mistake 3: Ignoring scripts

Scripts such as \`dev\`, \`build\`, and \`lint\` are part of the engineering workflow. Learn what each one checks.

## 7. Practice Task

Build a small \`ProjectMap\` component that explains a React project structure.

Requirements:

1. Show three items: package scripts, source folder, and app entry point.
2. Give each item a short practical description.
3. Use clear headings and paragraphs.
4. Keep the component static.
5. Do not add routing, state, or data fetching.

The goal is to explain the project structure as UI.

## 8. Self-Check

Before moving on, check that:

- You can explain what \`src/main.tsx\` does.
- You can explain what \`App.tsx\` usually represents.
- You know which script starts local development.
- Your practice component describes structure without adding unrelated behavior.
- Your naming would make sense to another developer.

## 9. Reflection

In your own words, explain this:

Why is understanding the project entry point useful before building features?

Your answer should mention debugging, navigation through the codebase, or confidence changing files.

## 10. Next Step

Next, you will learn JSX, the syntax React components use to describe UI structure.`,
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

## 1. Lesson Goal

Understand JSX as a syntax for describing UI inside component code, including expressions, attributes, and valid return structure.

## 2. Why It Matters

JSX is where React starts to feel different. You are not writing a separate template file. You are describing UI close to the values and decisions that shape it.

If you understand JSX well, component code becomes easier to read and debug.

## 3. Core Concept

JSX looks similar to HTML, but it is JavaScript syntax. A component can return JSX, and JSX can contain JavaScript expressions inside curly braces.

\`\`\`tsx
const userName = 'Ada'

function Greeting() {
  return <p>Hello, {userName}</p>
}
\`\`\`

The expression \`{userName}\` is evaluated and placed into the UI.

## 4. Mental Model

Think of JSX as a UI description with small windows into JavaScript.

Plain text describes fixed UI. Curly braces let values enter the UI. Component tags let you compose bigger screens from smaller pieces.

## 5. Guided Walkthrough

Attributes in JSX often look like HTML, but some names are different.

Use \`className\`, not \`class\`:

\`\`\`tsx
function Badge() {
  return <span className="badge">Beginner</span>
}
\`\`\`

Return one JSX tree:

\`\`\`tsx
function Header() {
  return (
    <>
      <h1>Vertex</h1>
      <p>Build real engineering skill.</p>
    </>
  )
}
\`\`\`

A fragment groups elements without adding an extra DOM element.

## 6. Common Mistakes

### Mistake 1: Using \`class\` instead of \`className\`

JSX uses JavaScript-friendly attribute names. Use \`className\` for CSS classes.

### Mistake 2: Putting statements inside JSX expressions

Curly braces accept expressions, not statements. Use a variable before the return when logic gets larger.

### Mistake 3: Returning sibling elements without a wrapper

Return one tree. Use a semantic element or a fragment.

## 7. Practice Task

Build a \`ProfileBadge\` component.

Requirements:

1. Create constants for a user name, role, and completed lesson count.
2. Render the values inside JSX using curly braces.
3. Add a CSS class using \`className\`.
4. Return one valid JSX tree.
5. Keep expressions small and readable.

The goal is to practice JSX syntax, not styling complexity.

## 8. Self-Check

Before moving on, check that:

- You used curly braces for JavaScript values.
- You used \`className\`.
- Your component returns one JSX tree.
- You avoided complex logic inside JSX.
- You can explain how JSX differs from plain HTML.

## 9. Reflection

In your own words, explain this:

Why does JSX allow JavaScript expressions inside markup-like UI?

Your answer should mention connecting data or values to rendered UI.

## 10. Next Step

Next, you will use JSX inside focused components so UI can be split into reusable pieces.`,
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

## 1. Lesson Goal

Learn how to think about components as named, focused pieces of UI with clear responsibilities.

## 2. Why It Matters

Real screens become complicated quickly. A dashboard can contain navigation, metrics, lists, forms, and empty states.

Components let you split that complexity into smaller pieces that can be named, reviewed, tested, and reused.

## 3. Core Concept

A React component is a function that returns UI. The strongest components have a clear purpose.

\`\`\`tsx
function EmptyState() {
  return (
    <section>
      <h2>No lessons yet</h2>
      <p>New content will appear here soon.</p>
    </section>
  )
}
\`\`\`

The name \`EmptyState\` tells another developer what this UI is for.

## 4. Mental Model

Think of components as paragraphs in a well-written document.

One huge paragraph is hard to read. Too many tiny fragments are also hard to follow. Good components split the UI at meaningful boundaries.

## 5. Guided Walkthrough

Start with the screen:

\`\`\`tsx
function DashboardPreview() {
  return (
    <main>
      <WelcomePanel />
      <ProgressSummary />
      <LessonList />
    </main>
  )
}
\`\`\`

Each child component has a responsibility:

- \`WelcomePanel\` greets the learner.
- \`ProgressSummary\` shows progress.
- \`LessonList\` renders available lessons.

This is composition: building a larger UI from smaller components.

## 6. Common Mistakes

### Mistake 1: Putting the whole page in one component

Large components hide intent. Split when a section has a clear name and responsibility.

### Mistake 2: Splitting too early

Do not create a component just to wrap one line. Split for clarity, reuse, or ownership.

### Mistake 3: Using vague names

Names like \`Box\`, \`Thing\`, or \`Content\` often fail to explain the component's role.

## 7. Practice Task

Build a small \`DashboardPreview\` using three components.

Requirements:

1. Create \`WelcomePanel\`, \`ProgressSummary\`, and \`NextLessonCard\`.
2. Compose them inside \`DashboardPreview\`.
3. Give each component one clear responsibility.
4. Keep all content static for now.
5. Use semantic HTML where it fits.

The goal is to practice component boundaries.

## 8. Self-Check

Before moving on, check that:

- Each component has a clear name.
- No component is doing too many jobs.
- The parent component reads like a summary of the screen.
- You did not add props before they were needed.
- You can explain why you split the UI this way.

## 9. Reflection

In your own words, explain this:

How do components make a growing UI easier to understand?

Your answer should mention names, responsibilities, or composition.

## 10. Next Step

Next, you will render real values and lists from data inside components.`,
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

## 1. Lesson Goal

Learn how to render values, arrays, and empty states in React components.

## 2. Why It Matters

Most product UI is data shaped into a screen. Learning paths, lessons, users, notifications, and project reviews all start as data.

If you can render data clearly, you can build useful screens before adding advanced behavior.

## 3. Core Concept

Render simple values with JSX expressions:

\`\`\`tsx
function ProfileSummary({ name }: { name: string }) {
  return <p>Welcome back, {name}</p>
}
\`\`\`

Render arrays with \`map\`:

\`\`\`tsx
const lessons = [
  { slug: 'jsx-fundamentals', title: 'JSX fundamentals' },
  { slug: 'components-overview', title: 'Components overview' },
]
\`\`\`

Each rendered item needs a stable \`key\`.

## 4. Mental Model

Think of rendering data as translating a data shape into a UI shape.

A string becomes text. An object becomes a card. An array becomes a list. An empty array becomes an empty state.

## 5. Guided Walkthrough

\`\`\`tsx
function LessonList() {
  return (
    <ul>
      {lessons.map((lesson) => (
        <li key={lesson.slug}>{lesson.title}</li>
      ))}
    </ul>
  )
}
\`\`\`

If there are no lessons, show a useful message:

\`\`\`tsx
function LessonList() {
  if (lessons.length === 0) {
    return <p>No lessons available yet.</p>
  }

  return (
    <ul>
      {lessons.map((lesson) => (
        <li key={lesson.slug}>{lesson.title}</li>
      ))}
    </ul>
  )
}
\`\`\`

## 6. Common Mistakes

### Mistake 1: Using the array index as the default key

Indexes can cause confusing UI bugs when items are inserted, removed, or reordered. Prefer stable IDs or slugs.

### Mistake 2: Forgetting the empty state

A blank screen makes users wonder if the app is broken. Empty states explain what happened.

### Mistake 3: Doing too much inside \`map\`

If each item becomes complex, extract an item component.

## 7. Practice Task

Build a \`LessonOverviewList\` component.

Requirements:

1. Create an array of lesson objects with \`slug\`, \`title\`, and \`difficulty\`.
2. Render one list item for each lesson.
3. Use a stable key.
4. Show the lesson title and difficulty.
5. Add an empty state branch.

The goal is to practice turning arrays into UI.

## 8. Self-Check

Before moving on, check that:

- Your data has stable identifiers.
- Your list uses a stable key.
- Your empty state is visible when the array is empty.
- Your JSX inside \`map\` stays readable.
- You can explain why keys help React track list items.

## 9. Reflection

In your own words, explain this:

Why is a stable key important when rendering a list?

Your answer should mention helping React track items across renders.

## 10. Next Step

Next, you will combine the React basics into one small UI section.`,
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

## 1. Lesson Goal

Combine React basics by building a small static learning path preview from components, JSX, and rendered data.

## 2. Why It Matters

Individual concepts matter, but real engineering work combines them. Even a simple product section needs component boundaries, readable JSX, data rendering, and empty state thinking.

This lesson turns the module into a small build.

## 3. Core Concept

A basic React UI usually combines:

1. Components for structure.
2. JSX for markup.
3. Data values for content.
4. Lists for repeated UI.
5. Empty states for missing data.

## 4. Mental Model

Think from the screen backward.

First identify the sections a user sees. Then identify repeated pieces. Then decide what data each piece needs. Finally, render the data with JSX.

## 5. Guided Walkthrough

Start with a reusable card:

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

Then render a list of lesson data:

\`\`\`tsx
const lessons = [
  {
    slug: 'what-is-react',
    title: 'What is React?',
    description: 'Understand the role of React.',
    difficulty: 'Beginner',
  },
]
\`\`\`

The final screen should read like a real product section, even if the data is local.

## 6. Common Mistakes

### Mistake 1: Building everything in one component

The point is to practice composition. Split repeated lesson UI into a card component.

### Mistake 2: Hardcoding repeated markup

If three cards have the same shape, use data and \`map\`.

### Mistake 3: Skipping empty states

Even static practice should include the habit of handling no data.

## 7. Practice Task

Build a \`LearningPathPreview\` component.

Requirements:

1. Create a \`LessonCard\` component.
2. Create local lesson data with at least three lessons.
3. Render the lessons with \`map\`.
4. Use a stable key.
5. Show title, description, and difficulty for each lesson.
6. Include an empty state branch.
7. Keep the UI static; do not add state yet.

The goal is to combine the module fundamentals into one coherent UI.

## 8. Self-Check

Before marking this module complete, check that:

- You used at least two components.
- Repeated cards come from data.
- Each list item has a stable key.
- The empty state is handled.
- Component names explain their responsibility.
- You can explain how JSX, components, and data rendering work together.

## 9. Reflection

In three to five sentences, explain your component design:

- Which parts became separate components?
- What data did you render?
- Where did you use a stable key?
- What would change if the lesson data came from an API later?

This reflection prepares you to discuss basic React UI work in review.

## 10. Next Step

Next, you will move into Components and Props, where these static components become reusable through explicit inputs.`,
    order: 6,
    type: 'EXERCISE',
    difficulty: 'BEGINNER',
    isPublished: true,
  },
]

const reactBasicsStarterCodeBySlug = {
  'what-is-react': `export function LearningStatus() {
  const pathName = 'React Basics'
  const lessonCount = 6

  return (
    <section aria-labelledby="learning-status-heading">
      <h2 id="learning-status-heading">{/* TODO: show the path name. */}</h2>
      <p>{/* TODO: show how many lessons are available. */}</p>
      <p>{/* TODO: tell the learner what to do next. */}</p>
    </section>
  )
}`,
  'setting-up-a-react-project': `export function ProjectMap() {
  const projectParts = [
    // TODO: add package scripts, source folder, and app entry point.
  ]

  return (
    <section aria-labelledby="project-map-heading">
      <h2 id="project-map-heading">Project map</h2>

      {/* TODO: render each project part with a short description. */}
    </section>
  )
}`,
  'jsx-fundamentals': `export function ProfileBadge() {
  const userName = 'Ada'
  const role = 'Frontend learner'
  const completedLessons = 3

  return (
    <section>
      {/* TODO: use JSX expressions to render the values above. */}
      {/* TODO: add a className to one element. */}
    </section>
  )
}`,
  'components-overview': `function WelcomePanel() {
  return null
}

function ProgressSummary() {
  return null
}

function NextLessonCard() {
  return null
}

export function DashboardPreview() {
  return (
    <main>
      {/* TODO: compose the three focused components here. */}
    </main>
  )
}`,
  'rendering-data': `type Lesson = {
  slug: string
  title: string
  difficulty: string
}

const lessons: Lesson[] = [
  // TODO: add at least three lesson objects.
]

export function LessonOverviewList() {
  // TODO: handle the empty state.

  return (
    <ul>
      {/* TODO: render lessons with map and a stable key. */}
    </ul>
  )
}`,
  'basic-practice': `type Lesson = {
  slug: string
  title: string
  description: string
  difficulty: string
}

function LessonCard() {
  // TODO: decide what data this card needs.
  return null
}

export function LearningPathPreview() {
  const lessons: Lesson[] = [
    // TODO: add at least three lessons.
  ]

  // TODO: handle the empty state.

  return (
    <section aria-labelledby="learning-path-preview-heading">
      <h2 id="learning-path-preview-heading">React Basics</h2>
      {/* TODO: render lesson cards from data. */}
    </section>
  )
}`,
}

const reactBasicsPredictionTasksBySlug = {
  'what-is-react': {
    title: 'Prediction',
    description: 'Predict what React is responsible for.',
    prompt: 'Which statement best describes React in a frontend application?',
    starterCode: null,
    options: [
      {
        id: 'complete-platform',
        label:
          'React is a complete platform that handles UI, database, authentication, and deployment.',
      },
      {
        id: 'ui-library',
        label: 'React is a UI library for building interfaces from components.',
      },
      {
        id: 'css-replacement',
        label: 'React replaces HTML and CSS with JavaScript.',
      },
    ],
    feedback: {
      correctOptionId: 'ui-library',
      responses: {
        'complete-platform':
          'Not quite. React focuses on UI. A full product still needs routing, data, auth, styling, testing, and deployment decisions.',
        'ui-library':
          'Correct. React helps you build user interfaces by composing components and rendering UI from data.',
        'css-replacement':
          'Not quite. React still uses markup concepts and styling. It organizes UI with components rather than replacing HTML and CSS entirely.',
      },
    },
    validation: {
      correctOptionId: 'ui-library',
    },
    metadata: {
      reason:
        'Clarifies the most common beginner misconception about React scope.',
    },
    type: 'PREDICTION',
    isRequired: true,
  },
  'jsx-fundamentals': {
    title: 'Prediction',
    description: 'Predict how JSX connects JavaScript values to UI.',
    prompt: 'What appears in the paragraph when this component renders?',
    starterCode: `const userName = 'Ada'

function Greeting() {
  return <p>Hello, {userName}</p>
}`,
    options: [
      {
        id: 'literal-expression',
        label: 'Hello, {userName}',
      },
      {
        id: 'evaluated-expression',
        label: 'Hello, Ada',
      },
      {
        id: 'syntax-error',
        label: 'Nothing. Curly braces are not allowed in JSX.',
      },
    ],
    feedback: {
      correctOptionId: 'evaluated-expression',
      responses: {
        'literal-expression':
          'Not quite. Curly braces open a JavaScript expression, so React uses the value of the variable.',
        'evaluated-expression':
          'Correct. JSX evaluates the expression inside curly braces and renders the variable value.',
        'syntax-error':
          'Not quite. Curly braces are the normal way to place JavaScript expressions inside JSX.',
      },
    },
    validation: {
      correctOptionId: 'evaluated-expression',
    },
    metadata: {
      reason:
        'Prediction helps learners distinguish JSX text from JavaScript expressions.',
    },
    type: 'PREDICTION',
    isRequired: true,
  },
}

const componentsAndPropsLessons = [
  {
    slug: 'understanding-react-components',
    title: 'Understanding React components',
    description: 'Understand what components are and why React apps use them.',
    content: `# Understanding React components

Components are reusable pieces of UI. In React, most screens are built by combining small components into larger sections and pages.

## Components describe UI

A component is usually a function that returns JSX. The function name starts with an uppercase letter so React can treat it as a component.

\`\`\`tsx
function WelcomePanel() {
  return (
    <section>
      <h1>Welcome back</h1>
      <p>Continue your learning path.</p>
    </section>
  )
}
\`\`\`

## Think in responsibilities

A good component has a clear purpose. For example, a navigation item, a lesson card, or a profile summary can each be a component.

## Common beginner mistakes

Do not put every part of the page into one huge component. Also avoid splitting so early that each component only wraps one line without adding clarity.

## Summary

Components help you organize UI into named, reusable pieces. Start with clear responsibilities and split components when it makes the screen easier to understand.`,
    order: 1,
    type: 'ARTICLE',
    difficulty: 'BEGINNER',
    isPublished: true,
  },
  {
    slug: 'creating-functional-components',
    title: 'Creating functional components',
    description: 'Create simple React function components with clear output.',
    content: `# Creating functional components

Functional components are the standard way to write React UI. They are regular TypeScript functions that return JSX.

## Start with a named function

Use an uppercase function name and return one JSX tree.

\`\`\`tsx
function PageTitle() {
  return <h1>Frontend Engineer</h1>
}
\`\`\`

## Return structured markup

When a component needs more than one element, wrap the result in a parent element or a fragment.

\`\`\`tsx
function EmptyState() {
  return (
    <div>
      <h2>No lessons yet</h2>
      <p>New content will appear here soon.</p>
    </div>
  )
}
\`\`\`

## Keep logic small

It is fine to calculate a label or choose a class name inside a component. If the logic grows large, extract helpers or smaller components.

## Common beginner mistakes

Do not call a component like a normal function inside JSX. Write \`<PageTitle />\`, not \`PageTitle()\`.

## Summary

Functional components are simple functions that return UI. Keep names clear, return valid JSX, and let composition do the heavy lifting.`,
    order: 2,
    type: 'EXERCISE',
    difficulty: 'BEGINNER',
    isPublished: true,
  },
  {
    slug: 'passing-data-with-props',
    title: 'Passing data with props',
    description: 'Pass values into components using props.',
    content: `# Passing data with props

Props are how a parent component passes data into a child component. They make components reusable because the same component can render different values.

## Define the data a component needs

Start by naming the values the component expects.

\`\`\`tsx
type LessonCardProps = {
  title: string
  description: string
}

function LessonCard({ title, description }: LessonCardProps) {
  return (
    <article>
      <h2>{title}</h2>
      <p>{description}</p>
    </article>
  )
}
\`\`\`

## Pass props from the parent

The parent provides values as JSX attributes.

\`\`\`tsx
function LessonList() {
  return (
    <LessonCard
      title="Components and Props"
      description="Learn how UI receives data."
    />
  )
}
\`\`\`

## Props are read-only

A child component should not change props directly. It should render from props and ask the parent to change data when needed.

## Common beginner mistakes

Avoid passing a huge object when the component only needs two fields. Prefer explicit props until there is a clear reason to pass the whole object.

## Summary

Props make components reusable and predictable. Define what the component needs, pass values from the parent, and keep props read-only.`,
    order: 3,
    type: 'ARTICLE',
    difficulty: 'BEGINNER',
    isPublished: true,
  },
  {
    slug: 'props-and-typescript',
    title: 'Props and TypeScript',
    description: 'Type component props so mistakes are caught early.',
    content: `# Props and TypeScript

TypeScript helps describe the shape of props. This makes components easier to use and catches missing or incorrect values before runtime.

## Create a props type

Use a type alias for the component contract.

\`\`\`tsx
type UserBadgeProps = {
  name: string
  role?: string
}

function UserBadge({ name, role = 'Member' }: UserBadgeProps) {
  return (
    <p>
      {name} - {role}
    </p>
  )
}
\`\`\`

## Use optional props carefully

Optional props are useful when a component has a sensible default. If a value is required for the UI to make sense, keep it required.

## Prefer readable names

Types should describe the component, not the file. \`UserBadgeProps\` is clearer than \`Props\` once the file grows.

## Common beginner mistakes

Do not use \`any\` for props just to make an error disappear. The type is part of the component design.

## Summary

Typed props document how a component should be used. Required props, optional props, and defaults make UI contracts clear.`,
    order: 4,
    type: 'ARTICLE',
    difficulty: 'BEGINNER',
    isPublished: true,
  },
  {
    slug: 'component-composition',
    title: 'Component composition',
    description: 'Combine small components into larger UI sections.',
    content: `# Component composition

Composition means building larger UI from smaller components. Instead of making one component do everything, each component handles a clear part of the screen.

## Compose from the outside

A page can arrange smaller components and pass the data each one needs.

\`\`\`tsx
function DashboardHeader({ name }: { name: string }) {
  return <h1>Welcome back, {name}</h1>
}

function DashboardPage() {
  return (
    <main>
      <DashboardHeader name="Ada" />
      <p>Your next lesson is ready.</p>
    </main>
  )
}
\`\`\`

## Use children for flexible content

When a component should wrap different content, use \`children\`.

\`\`\`tsx
function Panel({ children }: { children: React.ReactNode }) {
  return <section className="panel">{children}</section>
}
\`\`\`

## Keep ownership clear

The component that owns the data should usually decide what to render. Child components should focus on presenting what they receive.

## Common beginner mistakes

Do not pass too many unrelated props through many layers. If this happens, reconsider where the component belongs.

## Summary

Composition lets you build screens from focused pieces. Use props for data, children for flexible content, and keep ownership easy to follow.`,
    order: 5,
    type: 'ARTICLE',
    difficulty: 'BEGINNER',
    isPublished: true,
  },
  {
    slug: 'components-and-props-practice',
    title: 'Components and props practice',
    description: 'Practice building typed components from repeated UI.',
    content: `# Components and props practice

This practice lesson combines functional components, props, TypeScript, and composition. The goal is to turn repeated markup into reusable UI.

## Build a typed card

Create a reusable card for a technology.

\`\`\`tsx
type TechnologyCardProps = {
  name: string
  description: string
  lessonCount: number
}

function TechnologyCard({
  name,
  description,
  lessonCount,
}: TechnologyCardProps) {
  return (
    <article>
      <h2>{name}</h2>
      <p>{description}</p>
      <span>{lessonCount} lessons</span>
    </article>
  )
}
\`\`\`

## Render multiple cards

Create an array of technologies and render one card for each item. Use a stable slug as the key.

## Review the component boundary

Ask whether the card knows too much. It should display data, not decide where the data comes from.

## Common beginner mistakes

Avoid copying the same markup three times and changing only the text. That is a strong signal to create a component.

## Summary

Practice helps make component boundaries feel natural. Extract repeated UI, type the props, and keep each component focused.`,
    order: 6,
    type: 'EXERCISE',
    difficulty: 'BEGINNER',
    isPublished: true,
  },
]

const componentsAndPropsLessonContentBySlug = {
  'understanding-react-components': `# Understanding React components

## 1. Lesson Goal

Understand a React component as a named piece of UI with one clear responsibility.

By the end, you should be able to look at a screen and identify which parts could become components and why.

## 2. Why It Matters

After React Basics, you can render JSX and data. The next skill is organization.

Real product screens grow quickly. Without components, one file becomes a long mix of headings, buttons, lists, empty states, and labels. Components give that UI structure.

## 3. Core Concept

A component is usually a function that returns UI.

\`\`\`tsx
function WelcomePanel() {
  return (
    <section>
      <h1>Welcome back</h1>
      <p>Continue your learning path.</p>
    </section>
  )
}
\`\`\`

The important part is not just the function. It is the responsibility: \`WelcomePanel\` owns the welcome section.

## 4. Mental Model

Think of a component as a labeled box around a meaningful UI idea.

If you can give the box a useful name, it may be a component. If the name is vague, the boundary may be unclear.

## 5. Guided Walkthrough

Start from a simple screen:

\`\`\`tsx
function DashboardPreview() {
  return (
    <main>
      <section>
        <h1>Welcome back</h1>
        <p>Continue your learning path.</p>
      </section>

      <section>
        <h2>Next lesson</h2>
        <p>JSX fundamentals</p>
      </section>
    </main>
  )
}
\`\`\`

Two sections have different jobs. Extracting them can make the parent easier to read:

\`\`\`tsx
function DashboardPreview() {
  return (
    <main>
      <WelcomePanel />
      <NextLessonPanel />
    </main>
  )
}
\`\`\`

## 6. Common Mistakes

### Mistake 1: Extracting without a reason

Do not split code just to make more files. Split when the component name and responsibility are clear.

### Mistake 2: Keeping everything in one component

If a component has several unrelated sections, it becomes harder to scan and change safely.

### Mistake 3: Naming components after appearance only

\`BlueBox\` describes styling. \`NextLessonPanel\` describes purpose. Purpose usually ages better.

## 7. Practice Task

Build a \`CourseOverview\` screen from focused components.

Requirements:

1. Create a parent \`CourseOverview\` component.
2. Extract a \`CourseHeader\` component.
3. Extract a \`NextLessonPanel\` component.
4. Extract a \`ProgressPanel\` component.
5. Keep each component static for now.
6. Give every component a clear responsibility.

The goal is to practice seeing UI boundaries.

## 8. Self-Check

Before moving on, check that:

- Each component has a useful name.
- Each component returns a meaningful piece of UI.
- The parent component is easier to scan after extraction.
- You did not add props before they were needed.
- You can explain why each boundary exists.

## 9. Reflection

In your own words, explain this:

What makes a piece of UI worth extracting into a component?

Your answer should mention responsibility, naming, or readability.

## 10. Next Step

Next, you will create functional components deliberately and learn the small rules that keep them predictable.`,
  'creating-functional-components': `# Creating functional components

## 1. Lesson Goal

Create functional components that return clear JSX and can be composed inside other components.

## 2. Why It Matters

Most modern React code is written with function components. If you can write small function components confidently, you can read and contribute to real React codebases.

This lesson is about the shape and habits of a good component, not advanced behavior.

## 3. Core Concept

A function component is a JavaScript or TypeScript function whose name starts with an uppercase letter and returns JSX.

\`\`\`tsx
function PageTitle() {
  return <h1>Frontend Engineer</h1>
}
\`\`\`

React treats uppercase JSX tags as components:

\`\`\`tsx
function Page() {
  return <PageTitle />
}
\`\`\`

## 4. Mental Model

Think of a function component as a reusable UI sentence.

The name tells you what the sentence is about. The returned JSX says it. Composition lets you put sentences together into a page.

## 5. Guided Walkthrough

Start with a component that returns one JSX tree:

\`\`\`tsx
function EmptyState() {
  return (
    <section>
      <h2>No lessons yet</h2>
      <p>New lessons will appear here soon.</p>
    </section>
  )
}
\`\`\`

Then use it from another component:

\`\`\`tsx
function LessonsPanel() {
  return (
    <div>
      <EmptyState />
    </div>
  )
}
\`\`\`

## 6. Common Mistakes

### Mistake 1: Calling components like normal functions in JSX

Write \`<EmptyState />\`, not \`EmptyState()\`. JSX keeps component usage visible.

### Mistake 2: Starting component names with lowercase letters

Lowercase JSX names are treated like built-in DOM elements. Use uppercase names for your components.

### Mistake 3: Returning disconnected sibling elements

Return one JSX tree. Use a semantic wrapper or a fragment.

## 7. Practice Task

Build a \`LessonEmptyState\` component and use it inside \`LessonsPanel\`.

Requirements:

1. Create \`LessonEmptyState\`.
2. Return a heading, short message, and one button.
3. Create \`LessonsPanel\`.
4. Render \`LessonEmptyState\` inside \`LessonsPanel\`.
5. Keep both components focused and static.

The goal is to practice component declaration and usage.

## 8. Self-Check

Before moving on, check that:

- Component names start with uppercase letters.
- Components are used as JSX tags.
- Each component returns one JSX tree.
- The parent and child responsibilities are different.
- You can explain where the child component is rendered.

## 9. Reflection

In your own words, explain this:

Why does React component usage look like \`<LessonEmptyState />\` instead of a normal function call?

Your answer should mention readability, JSX, or component composition.

## 10. Next Step

Next, you will pass data into components so the same component can render different content.`,
  'passing-data-with-props': `# Passing data with props

## 1. Lesson Goal

Use props to pass data from a parent component into a child component.

## 2. Why It Matters

A component becomes useful when it can render different data without being rewritten.

For example, one \`LessonCard\` component should be able to show JSX Fundamentals, Components Overview, or State and Events depending on the props it receives.

## 3. Core Concept

Props are read-only inputs passed to a component through JSX attributes.

\`\`\`tsx
type LessonCardProps = {
  title: string
  description: string
}

function LessonCard({ title, description }: LessonCardProps) {
  return (
    <article>
      <h2>{title}</h2>
      <p>{description}</p>
    </article>
  )
}
\`\`\`

The parent provides the values:

\`\`\`tsx
<LessonCard
  title="Components and Props"
  description="Create reusable UI with clear inputs."
/>
\`\`\`

## 4. Mental Model

Think of props as function parameters for UI.

The parent owns the data. The child receives the data and renders it. The child should not secretly invent or mutate the parent's data.

## 5. Guided Walkthrough

Render multiple cards with different values:

\`\`\`tsx
function LessonGrid() {
  return (
    <>
      <LessonCard title="JSX" description="Describe UI with syntax." />
      <LessonCard title="Props" description="Pass data into components." />
    </>
  )
}
\`\`\`

The component implementation is reused. The props make each usage specific.

## 6. Common Mistakes

### Mistake 1: Hardcoding data inside a reusable component

If every card has the same title inside the component, it is not reusable yet.

### Mistake 2: Passing one huge object too early

Prefer explicit props while learning. They make the component contract easier to see.

### Mistake 3: Trying to change props inside the child

Props are inputs. Render from them. Later, you will learn how children can request changes through events.

## 7. Practice Task

Build a reusable \`LessonCard\` component with props.

Requirements:

1. Create a \`LessonCard\` component.
2. Pass \`title\`, \`description\`, and \`difficulty\` as props.
3. Render at least two cards with different values.
4. Keep the card focused on display.
5. Do not store props in state.

The goal is to practice passing data clearly from parent to child.

## 8. Self-Check

Before moving on, check that:

- The card does not hardcode lesson-specific content.
- Prop names describe what the component needs.
- The parent provides different values.
- The child treats props as read-only.
- You can explain which component owns the data.

## 9. Reflection

In your own words, explain this:

Why do props make a component more reusable?

Your answer should mention parent data, child inputs, or rendering different values.

## 10. Next Step

Next, you will use TypeScript to make prop contracts explicit and safer.`,
  'props-and-typescript': `# Props and TypeScript

## 1. Lesson Goal

Define TypeScript types for component props so component inputs are clear and mistakes are caught earlier.

## 2. Why It Matters

In a real codebase, components are used by other developers and by your future self.

Typed props make the component contract visible. They help catch missing values, wrong value types, and unclear names before the browser shows a broken UI.

## 3. Core Concept

A props type describes the values a component expects.

\`\`\`tsx
type ModuleCardProps = {
  title: string
  lessonCount: number
  isPublished: boolean
}
\`\`\`

Then the component uses that type:

\`\`\`tsx
function ModuleCard({ title, lessonCount, isPublished }: ModuleCardProps) {
  return (
    <article>
      <h2>{title}</h2>
      <p>{lessonCount} lessons</p>
      <span>{isPublished ? 'Published' : 'Draft'}</span>
    </article>
  )
}
\`\`\`

## 4. Mental Model

Think of a props type as the component's checklist.

Before someone can use the component correctly, they need to satisfy the checklist. TypeScript helps enforce it.

## 5. Guided Walkthrough

Start with the minimum useful shape:

\`\`\`tsx
type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced'

type LessonCardProps = {
  title: string
  difficulty: Difficulty
  lessonCount: number
}
\`\`\`

Use the type where props enter the component:

\`\`\`tsx
function LessonCard({ title, difficulty, lessonCount }: LessonCardProps) {
  return (
    <article>
      <h2>{title}</h2>
      <p>{difficulty}</p>
      <p>{lessonCount} lessons</p>
    </article>
  )
}
\`\`\`

## 6. Common Mistakes

### Mistake 1: Using \`any\` to silence the compiler

\`any\` removes the help TypeScript is supposed to give. Name the shape instead.

### Mistake 2: Passing more data than the component needs

If a component only renders \`title\` and \`difficulty\`, do not pass an entire learning path object without a reason.

### Mistake 3: Making types too clever

Begin with clear simple types. Add complexity only when the component truly needs it.

## 7. Practice Task

Build a typed \`ModuleSummaryCard\` component.

Requirements:

1. Create a \`Difficulty\` union type.
2. Create a \`ModuleSummaryCardProps\` type.
3. Include \`title\`, \`description\`, \`difficulty\`, and \`lessonCount\`.
4. Render all props inside the component.
5. Render the component from a parent with valid values.

The goal is to make the component contract explicit.

## 8. Self-Check

Before moving on, check that:

- You did not use \`any\`.
- The props type includes only what the component needs.
- The parent passes valid values.
- The union type prevents unsupported difficulty labels.
- You can explain what TypeScript would catch.

## 9. Reflection

In your own words, explain this:

How do typed props improve collaboration in a React codebase?

Your answer should mention contracts, clarity, or catching mistakes early.

## 10. Next Step

Next, you will compose components together and decide which component owns which part of the UI.`,
  'component-composition': `# Component composition

## 1. Lesson Goal

Compose small components into larger UI while keeping data ownership and boundaries easy to follow.

## 2. Why It Matters

Composition is how React apps scale. Pages arrange sections. Sections arrange cards, controls, and empty states. Each layer should have a clear job.

Good composition keeps a screen readable without hiding how data moves.

## 3. Core Concept

Composition means using components inside other components.

\`\`\`tsx
function DashboardPage() {
  return (
    <main>
      <PageHeader title="Dashboard" />
      <ProgressSummary completedLessons={4} totalLessons={10} />
    </main>
  )
}
\`\`\`

The parent decides the layout and passes data down.

## 4. Mental Model

Think of composition as arranging a team.

The parent coordinates. Children handle focused responsibilities. Data flows down through props. A child should not reach sideways into another child's work.

## 5. Guided Walkthrough

Use props for data:

\`\`\`tsx
function PageHeader({ title }: { title: string }) {
  return <h1>{title}</h1>
}
\`\`\`

Use \`children\` when a component should wrap flexible content:

\`\`\`tsx
function Panel({ children }: { children: React.ReactNode }) {
  return <section className="panel">{children}</section>
}
\`\`\`

Compose them:

\`\`\`tsx
function DashboardPage() {
  return (
    <Panel>
      <PageHeader title="Dashboard" />
      <p>Continue your learning journey.</p>
    </Panel>
  )
}
\`\`\`

## 6. Common Mistakes

### Mistake 1: Making children own data they should only display

If the parent knows the data, pass it down. Keep ownership visible.

### Mistake 2: Using \`children\` for everything

\`children\` is useful for flexible wrappers. Use named props when the component needs specific data.

### Mistake 3: Creating hidden dependencies

A child should not depend on unrelated page details. Pass the exact inputs it needs.

## 7. Practice Task

Build a composed \`LearningPanel\`.

Requirements:

1. Create a reusable \`Panel\` component that accepts \`children\`.
2. Create a \`PanelHeader\` component with typed props.
3. Create a \`LessonPreviewCard\` component with typed props.
4. Compose them inside \`LearningPanel\`.
5. Keep data ownership in \`LearningPanel\`.
6. Pass only the props each child needs.

The goal is to practice composition and ownership boundaries.

## 8. Self-Check

Before moving on, check that:

- The parent owns the data.
- Children receive data through props.
- \`children\` is used only for flexible wrapping.
- Component boundaries are clear.
- You can explain the direction data flows.

## 9. Reflection

In your own words, explain this:

What is the difference between passing data through props and passing UI through \`children\`?

Your answer should mention specific inputs, flexible content, or composition.

## 10. Next Step

Next, you will combine extraction, props, typing, and composition in a focused practice build.`,
  'components-and-props-practice': `# Components and props practice

## 1. Lesson Goal

Build a small typed component section that uses extraction, props, composition, and repeated data.

## 2. Why It Matters

This is the point where components stop being isolated examples. You need to turn repeated UI into a reusable component, type its props, pass data from a parent, and keep ownership clear.

That is everyday React work.

## 3. Core Concept

A reusable component has three parts:

1. A clear responsibility.
2. A clear props contract.
3. A parent that supplies data.

\`\`\`tsx
type TechnologyCardProps = {
  name: string
  description: string
  lessonCount: number
}
\`\`\`

The card displays. The parent owns the list.

## 4. Mental Model

Think in two layers:

- Data layer: what information exists?
- UI layer: which component displays each piece?

The parent maps data to components. The child renders one item well.

## 5. Guided Walkthrough

Start with the repeated shape:

\`\`\`tsx
function TechnologyCard({ name, description, lessonCount }: TechnologyCardProps) {
  return (
    <article>
      <h2>{name}</h2>
      <p>{description}</p>
      <span>{lessonCount} lessons</span>
    </article>
  )
}
\`\`\`

Then render data from the parent:

\`\`\`tsx
function TechnologySection() {
  return (
    <section>
      {technologies.map((technology) => (
        <TechnologyCard
          key={technology.slug}
          name={technology.name}
          description={technology.description}
          lessonCount={technology.lessonCount}
        />
      ))}
    </section>
  )
}
\`\`\`

The card does not know where the data came from. That keeps it reusable.

## 6. Common Mistakes

### Mistake 1: Copying card markup instead of extracting

Repeated markup is a signal. Extract the card and pass different props.

### Mistake 2: Letting the card own the whole list

The list belongs to the parent. The card should render one item.

### Mistake 3: Forgetting the empty state

Even a practice component should handle the case where no technologies are available.

## 7. Practice Task

Build a \`TechnologySection\` with typed reusable cards.

Requirements:

1. Create a \`Technology\` type.
2. Create a typed \`TechnologyCard\` component.
3. Create local technology data with at least three items.
4. Render one card for each item with a stable key.
5. Add an empty state branch.
6. Keep list ownership in \`TechnologySection\`.
7. Pass only the props the card needs.

The goal is to combine the full Components and Props module.

## 8. Self-Check

Before marking this module complete, check that:

- Repeated UI is extracted into a component.
- Props are typed.
- The parent owns the array.
- The card renders one item.
- Keys are stable.
- Empty state is handled.
- You can explain the component boundaries.

## 9. Reflection

In three to five sentences, explain your component design:

- Which component owns the data?
- Which component receives props?
- Where did you use composition?
- Why are the props typed?

This reflection prepares you to discuss component design during code review.

## 10. Next Step

Next, you will move into State and Events, where components become interactive through local state and user actions.`,
}

const componentsAndPropsLessonsForSeed = componentsAndPropsLessons.map(
  (lesson) => ({
    ...lesson,
    content: componentsAndPropsLessonContentBySlug[lesson.slug],
  }),
)

const componentsAndPropsStarterCodeBySlug = {
  'understanding-react-components': `function CourseHeader() {
  return null
}

function NextLessonPanel() {
  return null
}

function ProgressPanel() {
  return null
}

export function CourseOverview() {
  return (
    <main>
      {/* TODO: compose the focused components here. */}
    </main>
  )
}`,
  'creating-functional-components': `function LessonEmptyState() {
  return (
    <section>
      {/* TODO: render a heading, message, and button. */}
    </section>
  )
}

export function LessonsPanel() {
  return (
    <section aria-labelledby="lessons-panel-heading">
      <h2 id="lessons-panel-heading">Lessons</h2>
      {/* TODO: render LessonEmptyState as a component. */}
    </section>
  )
}`,
  'passing-data-with-props': `type LessonCardProps = {
  // TODO: define title, description, and difficulty props.
}

function LessonCard(props: LessonCardProps) {
  return (
    <article>
      {/* TODO: render values from props. */}
    </article>
  )
}

export function LessonGrid() {
  return (
    <section>
      {/* TODO: render at least two LessonCard components with different props. */}
    </section>
  )
}`,
  'props-and-typescript': `type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced'

type ModuleSummaryCardProps = {
  // TODO: add title, description, difficulty, and lessonCount.
}

function ModuleSummaryCard(props: ModuleSummaryCardProps) {
  return (
    <article>
      {/* TODO: render all typed props. */}
    </article>
  )
}

export function ModuleSummaryExample() {
  return (
    <section>
      {/* TODO: render ModuleSummaryCard with valid values. */}
    </section>
  )
}`,
  'component-composition': `type PanelHeaderProps = {
  // TODO: define the header props.
}

type LessonPreviewCardProps = {
  // TODO: define the lesson preview props.
}

function Panel({ children }: { children: React.ReactNode }) {
  return <section>{children}</section>
}

function PanelHeader(props: PanelHeaderProps) {
  return null
}

function LessonPreviewCard(props: LessonPreviewCardProps) {
  return null
}

export function LearningPanel() {
  // TODO: keep the data here and pass only what children need.

  return <Panel>{/* TODO: compose the panel content. */}</Panel>
}`,
  'components-and-props-practice': `type Technology = {
  slug: string
  name: string
  description: string
  lessonCount: number
}

type TechnologyCardProps = {
  // TODO: define only the props the card needs.
}

function TechnologyCard(props: TechnologyCardProps) {
  return (
    <article>
      {/* TODO: render one technology. */}
    </article>
  )
}

export function TechnologySection() {
  const technologies: Technology[] = [
    // TODO: add at least three technologies.
  ]

  // TODO: handle the empty state.

  return (
    <section aria-labelledby="technology-section-heading">
      <h2 id="technology-section-heading">Technologies</h2>
      {/* TODO: render TechnologyCard items from data. */}
    </section>
  )
}`,
}

const componentsAndPropsPredictionTasksBySlug = {
  'passing-data-with-props': {
    title: 'Prediction',
    description: 'Predict how props make a component reusable.',
    prompt:
      'What changes when a parent renders the same LessonCard with different props?',
    starterCode: `<LessonCard title="JSX" description="Describe UI." />
<LessonCard title="Props" description="Pass data into UI." />`,
    options: [
      {
        id: 'same-output',
        label:
          'Both cards render the same content because the component function is the same.',
      },
      {
        id: 'different-output',
        label:
          'Each card renders different content because props provide different inputs.',
      },
      {
        id: 'props-mutated',
        label: 'The child changes the props so each card can update itself.',
      },
    ],
    feedback: {
      correctOptionId: 'different-output',
      responses: {
        'same-output':
          'Not quite. The component implementation is the same, but each usage receives different prop values.',
        'different-output':
          'Correct. Props are inputs from the parent, so the same component can render different data.',
        'props-mutated':
          'Not quite. Props are read-only inputs. The child renders from them instead of mutating them.',
      },
    },
    validation: {
      correctOptionId: 'different-output',
    },
    metadata: {
      reason:
        'Catches the misconception that reusable components must contain their own data.',
    },
    type: 'PREDICTION',
    isRequired: true,
  },
  'component-composition': {
    title: 'Prediction',
    description: 'Predict where ownership belongs in a composed UI.',
    prompt:
      'In a composed screen, where should shared lesson data usually live first?',
    starterCode: null,
    options: [
      {
        id: 'parent-owns',
        label:
          'In the parent that coordinates the section and passes needed values down.',
      },
      {
        id: 'every-child-fetches',
        label:
          'Inside every child component so each child can find its own data.',
      },
      {
        id: 'props-change',
        label:
          'Inside props, because child components can edit props directly.',
      },
    ],
    feedback: {
      correctOptionId: 'parent-owns',
      responses: {
        'parent-owns':
          'Correct. The parent coordinates the data and passes focused inputs to children.',
        'every-child-fetches':
          'Not quite. That creates hidden dependencies and makes the UI harder to reason about.',
        'props-change':
          'Not quite. Props carry data down, but children should not edit props directly.',
      },
    },
    validation: {
      correctOptionId: 'parent-owns',
    },
    metadata: {
      reason:
        'Catches confusion around one-way data flow and ownership boundaries.',
    },
    type: 'PREDICTION',
    isRequired: true,
  },
}

const stateAndEventsLessons = [
  {
    slug: 'local-state-with-usestate',
    title: 'Local State with useState',
    description:
      'Understand local component state and how useState drives UI updates.',
    content: readMarkdownLesson('01-local-state-with-usestate.md'),
    order: 1,
    type: 'ARTICLE',
    difficulty: 'BEGINNER',
    isPublished: true,
  },
  {
    slug: 'updating-state-safely',
    title: 'Updating State Safely',
    description:
      'Use updater functions when the next state depends on the previous state.',
    content: readMarkdownLesson('02-updating-state-safely.md'),
    order: 2,
    type: 'ARTICLE',
    difficulty: 'BEGINNER',
    isPublished: true,
  },
  {
    slug: 'handling-user-events',
    title: 'Handling User Events',
    description:
      'Connect user actions to component behavior with clear event handlers.',
    content: readMarkdownLesson('03-handling-user-events.md'),
    order: 3,
    type: 'ARTICLE',
    difficulty: 'BEGINNER',
    isPublished: true,
  },
  {
    slug: 'controlled-form-inputs',
    title: 'Controlled Form Inputs',
    description: 'Keep form values in React state with value and onChange.',
    content: readMarkdownLesson('04-controlled-form-inputs.md'),
    order: 4,
    type: 'EXERCISE',
    difficulty: 'BEGINNER',
    isPublished: true,
  },
  {
    slug: 'derived-ui-state',
    title: 'Derived UI State',
    description:
      'Calculate UI values from existing state instead of duplicating data.',
    content: readMarkdownLesson('05-derived-ui-state.md'),
    order: 5,
    type: 'ARTICLE',
    difficulty: 'BEGINNER',
    isPublished: true,
  },
  {
    slug: 'state-and-events-practice',
    title: 'State and Events Practice',
    description:
      'Combine local state, safe updates, events, controlled inputs, and derived state.',
    content: readMarkdownLesson('06-state-and-events-practice.md'),
    order: 6,
    type: 'EXERCISE',
    difficulty: 'BEGINNER',
    isPublished: true,
  },
]

const stateAndEventsStarterCodeBySlug = {
  'local-state-with-usestate': `import { useState } from 'react'

export function NotificationToggle() {
  // TODO: create local state for whether notifications are enabled.

  function handleToggle() {
    // TODO: update state to the opposite value.
  }

  return (
    <section aria-labelledby="notification-heading">
      <h2 id="notification-heading">Notifications</h2>

      <p>
        {/* TODO: show whether notifications are enabled or disabled. */}
      </p>

      <button onClick={handleToggle} type="button">
        {/* TODO: show a different label for each state. */}
      </button>
    </section>
  )
}`,
  'updating-state-safely': `import { useState } from 'react'

export function SeatReservation() {
  // TODO: store the number of reserved seats.

  function handleReserveSeat() {
    // TODO: add one seat using a safe state update.
  }

  function handleReleaseSeat() {
    // TODO: remove one seat without going below zero.
  }

  return (
    <section aria-labelledby="seat-reservation-heading">
      <h2 id="seat-reservation-heading">Seat reservation</h2>

      <p>{/* TODO: show the current number of reserved seats. */}</p>

      <button onClick={handleReserveSeat} type="button">
        Reserve seat
      </button>
      <button onClick={handleReleaseSeat} type="button">
        Release seat
      </button>
    </section>
  )
}`,
  'handling-user-events': `import { useState } from 'react'

type Preference = 'email' | 'product'

export function PreferencePanel() {
  // TODO: store whether the panel is open.
  // TODO: store the selected preference.

  function handleTogglePanel() {
    // TODO: open or close the panel.
  }

  function handleSelectPreference(preference: Preference) {
    // TODO: store the selected preference.
  }

  return (
    <section aria-labelledby="preference-heading">
      <h2 id="preference-heading">Preferences</h2>

      <button onClick={handleTogglePanel} type="button">
        {/* TODO: show a label based on whether the panel is open. */}
      </button>

      {/* TODO: show preference buttons only when the panel is open. */}
      {/* TODO: display the selected preference. */}
    </section>
  )
}`,
  'controlled-form-inputs': `import { useState } from 'react'

export function ContactForm() {
  // TODO: create state for name, email, message, and submitted summary.

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    // TODO: submit using current state values.
  }

  function handleReset() {
    // TODO: clear the form state.
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="contact-name">Name</label>
      <input id="contact-name" />

      <label htmlFor="contact-email">Email</label>
      <input id="contact-email" type="email" />

      <label htmlFor="contact-message">Message</label>
      <textarea id="contact-message" />

      <button type="submit">{/* TODO: disable when fields are empty. */}</button>
      <button onClick={handleReset} type="button">
        Reset
      </button>

      {/* TODO: show a submitted summary. */}
    </form>
  )
}`,
  'derived-ui-state': `import { useState } from 'react'

export function SignupFormPreview() {
  // TODO: store only the values the user edits directly.
  // TODO: derive passwordsMatch, isPasswordLongEnough, and canSubmit.

  return (
    <form>
      <label htmlFor="signup-email">Email</label>
      <input id="signup-email" type="email" />

      <label htmlFor="signup-password">Password</label>
      <input id="signup-password" type="password" />

      <label htmlFor="signup-confirm-password">Confirm password</label>
      <input id="signup-confirm-password" type="password" />

      <p>{/* TODO: show helpful status text from derived values. */}</p>

      <button type="submit">{/* TODO: disable until derived canSubmit is true. */}</button>
    </form>
  )
}`,
  'state-and-events-practice': `import { useState } from 'react'

type Priority = 'low' | 'medium' | 'high'

type Task = {
  id: number
  title: string
  priority: Priority
  isComplete: boolean
}

export function TaskPlanner() {
  // TODO: store task title, priority, and tasks.
  // TODO: derive canAddTask, completedCount, and totalCount.

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    // TODO: prevent empty titles and add a task with a safe update.
  }

  function handleToggleTask(taskId: number) {
    // TODO: toggle one task without mutating the existing task.
  }

  return (
    <section aria-labelledby="task-planner-heading">
      <h2 id="task-planner-heading">Task planner</h2>

      <form onSubmit={handleSubmit}>
        {/* TODO: add controlled title and priority inputs. */}
        <button type="submit">Add task</button>
      </form>

      <p>{/* TODO: show completed and total task counts. */}</p>

      {/* TODO: show an empty state or a task list. */}
    </section>
  )
}`,
}

const hooksLessons = [
  {
    slug: 'why-hooks-exist',
    title: 'Why Hooks Exist',
    description:
      'Understand what hooks solve and how hook rules keep components predictable.',
    content: `# Why Hooks Exist

## 1. Lesson Goal

Understand hooks as React's way to let function components use stateful React features without changing the component model.

By the end, you should be able to explain why hooks exist, where hooks belong, and why the rules of hooks are not random style preferences.

## 2. Why It Matters

You already know state and events. Hooks are the next layer: they let components remember state, synchronize with external systems, keep references, and reuse stateful behavior.

In real projects, hooks appear everywhere. If you treat them as magic functions, components become hard to debug. If you understand the mental model, hooks become a predictable tool for organizing behavior.

## 3. Core Concept

A hook is a function that lets a React component connect to a React feature.

\`useState\` connects a component to local state. \`useEffect\` connects a component to external synchronization. \`useRef\` gives a component a stable container that does not trigger renders.

Hooks must be called at the top level of a component or another hook. Do not call hooks inside conditions, loops, event handlers, or nested helper functions.

\`\`\`tsx
function ProfileStatus() {
  const [isOnline, setIsOnline] = useState(false)

  return (
    <button onClick={() => setIsOnline((current) => !current)}>
      {isOnline ? 'Online' : 'Offline'}
    </button>
  )
}
\`\`\`

The component can re-render many times, but React needs hook calls to happen in the same order each render.

## 4. Mental Model

Think of hooks as numbered slots React associates with a component instance.

On every render, React walks through the hook calls in order. The first hook call gets the first slot, the second hook call gets the second slot, and so on.

If a hook is hidden inside a condition, the order can change between renders. React may then connect the wrong state or effect to the wrong slot. The rules of hooks protect that order.

## 5. Guided Walkthrough

Start with state at the top level:

\`\`\`tsx
function LessonBookmark() {
  const [isBookmarked, setIsBookmarked] = useState(false)

  return (
    <button onClick={() => setIsBookmarked((current) => !current)}>
      {isBookmarked ? 'Remove bookmark' : 'Bookmark lesson'}
    </button>
  )
}
\`\`\`

Now compare that with a broken pattern:

\`\`\`tsx
function LessonBookmark({ canBookmark }: { canBookmark: boolean }) {
  if (canBookmark) {
    const [isBookmarked, setIsBookmarked] = useState(false)
  }

  return null
}
\`\`\`

The hook only runs sometimes. That means the hook order can change. Instead, call the hook every render and put the condition in the UI or handler logic.

## 6. Common Mistakes

### Mistake 1: Calling hooks only when needed

Hooks should not be conditional. Call them at the top level, then use conditions around behavior or rendering.

### Mistake 2: Treating hooks like normal utility functions

Hooks participate in React rendering. A helper function can be called anywhere, but a hook must follow hook rules.

### Mistake 3: Creating one large component because hooks feel local

Hooks make behavior possible inside function components, but they do not remove the need for clear component boundaries.

## 7. Practice Task

Build a \`LessonBookmarkPanel\` component.

Requirements:

- use \`useState\` at the top level;
- let the learner toggle a bookmark on and off;
- show a different status message for bookmarked and unbookmarked states;
- show an optional note only when bookmarked;
- keep hook calls outside conditions.

## 8. Self-Check

- The hook is called before any conditional return or branch.
- The button changes the state with a clear handler.
- The UI changes based on state.
- No hook is called inside an \`if\`, loop, event handler, or nested function.

## 9. Reflection

Why does React need hooks to be called in the same order on every render?

## 10. Next Step

Next, you will learn \`useEffect\`, the hook React uses when a component needs to synchronize with something outside rendering.`,
    order: 1,
    type: 'ARTICLE',
    difficulty: 'INTERMEDIATE',
    isPublished: true,
  },
  {
    slug: 'useeffect-mental-model',
    title: 'useEffect Mental Model',
    description:
      'Understand effects as synchronization after render, not as event handlers.',
    content: `# useEffect Mental Model

## 1. Lesson Goal

Understand \`useEffect\` as a way to synchronize a component with something outside React after rendering.

By the end, you should be able to explain the difference between event logic and effect logic.

## 2. Why It Matters

Many React bugs come from using effects for the wrong job. Developers put user actions, derived values, or normal render decisions into effects, then wonder why the component feels unpredictable.

Effects are powerful, but they should be used with a clear reason: synchronization.

## 3. Core Concept

Rendering calculates what the UI should look like. Events respond to user actions. Effects run after React has committed the render and let the component synchronize with external systems.

Examples of external systems include:

- the document title;
- browser APIs;
- subscriptions;
- timers;
- network requests;
- third-party widgets.

\`\`\`tsx
function LessonTitle({ title }: { title: string }) {
  useEffect(() => {
    document.title = title
  }, [title])

  return <h1>{title}</h1>
}
\`\`\`

The heading is render output. The browser tab title is outside React, so it is synchronized in an effect.

## 4. Mental Model

Think of an effect as a small synchronization contract:

When these values change, make the outside world match this render.

The effect does not decide what to render. The component already rendered. The effect handles something React cannot express directly in JSX.

## 5. Guided Walkthrough

Imagine a lesson reader that displays a title and updates the browser tab:

\`\`\`tsx
function LessonReader({ lessonTitle }: { lessonTitle: string }) {
  useEffect(() => {
    document.title = lessonTitle
  }, [lessonTitle])

  return <h1>{lessonTitle}</h1>
}
\`\`\`

If \`lessonTitle\` changes, React renders the new heading. After that render, the effect updates \`document.title\`.

Do not use an effect for work that can happen directly in an event:

\`\`\`tsx
function SaveButton() {
  function handleClick() {
    console.log('Save now')
  }

  return <button onClick={handleClick}>Save</button>
}
\`\`\`

The click is already an event. It does not need an effect.

## 6. Common Mistakes

### Mistake 1: Using effects for every state change

Most UI state should be rendered directly. You do not need an effect to calculate text, classes, or disabled states from current state.

### Mistake 2: Moving event logic into effects

If logic should happen because the learner clicked, typed, or submitted, put it in the event handler.

### Mistake 3: Forgetting that effects run after render

Effects do not block rendering. They synchronize after React updates the screen.

## 7. Practice Task

Build a \`LessonDocumentTitle\` component.

Requirements:

- accept a \`lessonTitle\` prop;
- render the lesson title on the page;
- use \`useEffect\` to update \`document.title\`;
- include the correct dependency;
- keep button or event logic out of the effect.

## 8. Self-Check

- The visible title comes from JSX.
- The browser title is updated inside \`useEffect\`.
- The effect depends on \`lessonTitle\`.
- No event-only logic is placed inside the effect.

## 9. Reflection

How would you decide whether code belongs in render, an event handler, or an effect?

## 10. Next Step

Next, you will learn how dependency arrays tell React when an effect needs to synchronize again.`,
    order: 2,
    type: 'ARTICLE',
    difficulty: 'INTERMEDIATE',
    isPublished: true,
  },
  {
    slug: 'effect-dependencies',
    title: 'Effect Dependencies',
    description:
      'Reason about dependency arrays and keep effects synchronized with current values.',
    content: `# Effect Dependencies

## 1. Lesson Goal

Learn how effect dependencies describe the values an effect reads from the render.

By the end, you should be able to choose dependencies by reasoning from the effect body instead of guessing.

## 2. Why It Matters

Dependency bugs are subtle. Missing dependencies can make an effect use stale values. Extra unnecessary dependencies can make an effect run more often than needed.

Professional React work requires explaining why an effect runs when it does.

## 3. Core Concept

The dependency array tells React which rendered values the effect depends on.

\`\`\`tsx
useEffect(() => {
  document.title = lessonTitle
}, [lessonTitle])
\`\`\`

The effect reads \`lessonTitle\`, so \`lessonTitle\` belongs in the dependency array.

An empty dependency array means the effect does not read changing values from render and only needs to run after the first render.

## 4. Mental Model

Read the effect body and ask: "Which values from this render does this synchronization use?"

Those values are dependencies.

The dependency array is not a schedule you manually tune. It is a description of what the effect needs to stay correct.

## 5. Guided Walkthrough

This effect depends on two values:

\`\`\`tsx
function ProgressTitle({
  lessonTitle,
  completedCount,
}: {
  lessonTitle: string
  completedCount: number
}) {
  useEffect(() => {
    document.title = \`\${lessonTitle} (\${completedCount} complete)\`
  }, [lessonTitle, completedCount])

  return <h1>{lessonTitle}</h1>
}
\`\`\`

If either value changes, the document title must be synchronized again.

Now compare a mount-only effect:

\`\`\`tsx
useEffect(() => {
  console.log('Lesson reader mounted')
}, [])
\`\`\`

This effect does not read changing props or state, so an empty array is reasonable.

## 6. Common Mistakes

### Mistake 1: Using an empty array to silence reruns

An empty array is correct only when the effect does not need changing values from render.

### Mistake 2: Thinking dependencies are optional notes

Dependencies are part of the effect's correctness. Missing one can make the effect synchronize old data.

### Mistake 3: Storing derived values in state just to avoid dependencies

If a value can be calculated during render, calculate it during render. Do not move it into an effect to avoid dependency thinking.

## 7. Practice Task

Build a \`ProgressDocumentTitle\` component.

Requirements:

- accept \`lessonTitle\`, \`completedLessons\`, and \`totalLessons\` props;
- render the progress summary in JSX;
- use \`useEffect\` to update \`document.title\`;
- include every value the effect reads;
- avoid derived state.

## 8. Self-Check

- The dependency array matches the values used inside the effect.
- The progress percentage or summary is derived during render.
- The effect does not hide stale values.
- The component stays easy to explain.

## 9. Reflection

What question can you ask yourself to identify the correct dependencies for an effect?

## 10. Next Step

Next, you will learn cleanup: how an effect disconnects from external work it started earlier.`,
    order: 3,
    type: 'ARTICLE',
    difficulty: 'INTERMEDIATE',
    isPublished: true,
  },
  {
    slug: 'effect-cleanup',
    title: 'Effect Cleanup',
    description:
      'Clean up timers, subscriptions, and external work created by effects.',
    content: `# Effect Cleanup

## 1. Lesson Goal

Learn when an effect should return a cleanup function and how cleanup prevents stale external work.

By the end, you should be able to create and clean up a timer safely.

## 2. Why It Matters

Effects often connect to something outside React. If that work continues after the component changes or unmounts, it can cause bugs, duplicate updates, memory leaks, or confusing behavior.

Cleanup is the habit that keeps synchronization responsible.

## 3. Core Concept

An effect can return a function. React calls that function before the effect runs again and when the component unmounts.

\`\`\`tsx
useEffect(() => {
  const intervalId = window.setInterval(() => {
    console.log('tick')
  }, 1000)

  return () => {
    window.clearInterval(intervalId)
  }
}, [])
\`\`\`

The effect starts the timer. The cleanup stops it.

## 4. Mental Model

Think in pairs:

- subscribe -> unsubscribe;
- start timer -> stop timer;
- add listener -> remove listener;
- connect -> disconnect.

If an effect starts something that can keep running, the cleanup should stop it.

## 5. Guided Walkthrough

A simple timer component needs state and an effect:

\`\`\`tsx
function ReadingTimer() {
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setSeconds((current) => current + 1)
    }, 1000)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [])

  return <p>Reading for {seconds} seconds</p>
}
\`\`\`

The effect starts once. The cleanup prevents the interval from continuing after the component is gone.

Notice the updater function inside \`setSeconds\`. It avoids needing \`seconds\` in the dependency array.

## 6. Common Mistakes

### Mistake 1: Starting timers without stopping them

Intervals continue until cleared. Always clean up timers created in effects.

### Mistake 2: Cleaning up the wrong thing

The cleanup should undo the exact external work started by that effect.

### Mistake 3: Adding changing state as a dependency by accident

For intervals that update based on previous state, an updater function often keeps the effect simpler and correct.

## 7. Practice Task

Build a \`FocusSessionTimer\` component.

Requirements:

- track elapsed seconds with state;
- start an interval in \`useEffect\`;
- update seconds safely with an updater function;
- clean up the interval;
- show the elapsed time and a short status message.

## 8. Self-Check

- The interval is created inside an effect.
- The cleanup clears the same interval.
- The state update uses an updater function.
- The effect does not create multiple active intervals.

## 9. Reflection

What kinds of external work should make you look for a cleanup function?

## 10. Next Step

Next, you will learn \`useRef\`, a hook for storing stable values that should not cause re-renders.`,
    order: 4,
    type: 'ARTICLE',
    difficulty: 'INTERMEDIATE',
    isPublished: true,
  },
  {
    slug: 'useref',
    title: 'useRef',
    description:
      'Use refs for stable mutable values that should not trigger rendering.',
    content: `# useRef

## 1. Lesson Goal

Understand \`useRef\` as a stable container whose \`.current\` value can change without causing a render.

By the end, you should be able to choose between state and ref for simple UI behavior.

## 2. Why It Matters

Not every value belongs in state. If changing a value should update the UI, use state. If the value is needed for coordination but does not need to render, a ref may be a better fit.

Refs are common for DOM nodes, timer ids, previous values, and small mutable flags.

## 3. Core Concept

\`useRef\` returns an object with a \`.current\` property.

\`\`\`tsx
const renderCountRef = useRef(0)
\`\`\`

The object stays the same between renders. You can change \`.current\`, but React will not re-render because of that change.

## 4. Mental Model

State is for values that affect what the user sees.

Ref is for values the component needs to remember, but the UI does not need to update immediately when they change.

If the screen should change, reach for state first. If you need a stable box for coordination, consider a ref.

## 5. Guided Walkthrough

This component stores the latest draft length in a ref while state controls the visible input value:

\`\`\`tsx
function DraftTracker() {
  const [draft, setDraft] = useState('')
  const lastLengthRef = useRef(0)

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const nextDraft = event.target.value
    lastLengthRef.current = nextDraft.length
    setDraft(nextDraft)
  }

  return (
    <label>
      Draft
      <input value={draft} onChange={handleChange} />
    </label>
  )
}
\`\`\`

The visible input uses state. The ref remembers a value for logic without becoming another piece of rendered state.

## 6. Common Mistakes

### Mistake 1: Using refs to avoid learning state

If the UI should update when a value changes, use state. Refs do not trigger renders.

### Mistake 2: Reading and writing refs everywhere

Refs are mutable. Keep their usage small and easy to reason about.

### Mistake 3: Treating refs as global storage

A ref belongs to one component instance. It is not shared application state.

## 7. Practice Task

Build a \`DraftAutosaveStatus\` component.

Requirements:

- keep the input value in state;
- use a ref to store the last saved draft;
- update the ref when the learner clicks Save;
- show whether the current draft matches the last saved draft;
- do not use the ref as the source of the input value.

## 8. Self-Check

- State controls the input.
- The ref stores the last saved value.
- Saving updates the ref.
- The UI still renders from state and derived comparisons.

## 9. Reflection

How do you decide whether a value belongs in state or in a ref?

## 10. Next Step

Next, you will combine state, effects, refs, and clear boundaries into custom hooks.`,
    order: 5,
    type: 'ARTICLE',
    difficulty: 'INTERMEDIATE',
    isPublished: true,
  },
  {
    slug: 'custom-hooks',
    title: 'Custom Hooks',
    description:
      'Extract reusable stateful behavior into focused custom hooks.',
    content: `# Custom Hooks

## 1. Lesson Goal

Learn how custom hooks let you reuse stateful logic without copying component code.

By the end, you should be able to extract a small hook that combines state, effects, and a clear return value.

## 2. Why It Matters

As components grow, repeated behavior appears: timers, saved drafts, document titles, subscriptions, toggles, and form helpers.

Copying that logic across components creates drift. A custom hook lets you name the behavior and reuse it while keeping UI components focused on rendering.

## 3. Core Concept

A custom hook is a function whose name starts with \`use\` and that calls other hooks.

\`\`\`tsx
function useDocumentTitle(title: string) {
  useEffect(() => {
    document.title = title
  }, [title])
}
\`\`\`

Components can call the custom hook at the top level:

\`\`\`tsx
function LessonPageTitle({ title }: { title: string }) {
  useDocumentTitle(title)

  return <h1>{title}</h1>
}
\`\`\`

The custom hook owns behavior. The component owns UI.

## 4. Mental Model

Extract a custom hook when you can name a reusable behavior, not just because a component has many lines.

A good custom hook has:

- a clear purpose;
- focused inputs;
- a predictable return value;
- no hidden UI decisions.

## 5. Guided Walkthrough

Start with behavior inside one component:

\`\`\`tsx
function ReadingTimer() {
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setSeconds((current) => current + 1)
    }, 1000)

    return () => window.clearInterval(intervalId)
  }, [])

  return <p>{seconds} seconds</p>
}
\`\`\`

Now extract the behavior:

\`\`\`tsx
function useElapsedSeconds() {
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setSeconds((current) => current + 1)
    }, 1000)

    return () => window.clearInterval(intervalId)
  }, [])

  return seconds
}
\`\`\`

The component becomes simpler:

\`\`\`tsx
function ReadingTimer() {
  const seconds = useElapsedSeconds()

  return <p>{seconds} seconds</p>
}
\`\`\`

## 6. Common Mistakes

### Mistake 1: Extracting too early

Wait until the behavior has a clear name or repeated use. Premature hooks can hide simple logic.

### Mistake 2: Returning too much

A custom hook should return what the component needs, not every internal detail.

### Mistake 3: Putting JSX inside a hook

Hooks should manage behavior. Components should render UI.

## 7. Practice Task

Build a \`usePersistentDraft\` hook and a \`LessonDraftEditor\` component.

Requirements:

- the hook accepts a storage key and initial value;
- the hook stores draft text in state;
- the hook synchronizes the draft to \`localStorage\` with an effect;
- the component renders a controlled textarea;
- the component uses the hook's returned value and setter.

## 8. Self-Check

- The custom hook starts with \`use\`.
- The hook calls hooks only at the top level.
- The hook owns state and synchronization logic.
- The component owns the JSX and user-facing labels.

## 9. Reflection

What makes a piece of stateful behavior worth extracting into a custom hook?

## 10. Next Step

Next, you will move from hook behavior into routing, where React screens become navigable application flows.`,
    order: 6,
    type: 'EXERCISE',
    difficulty: 'INTERMEDIATE',
    isPublished: true,
  },
]

const hooksStarterCodeBySlug = {
  'why-hooks-exist': `import { useState } from 'react'

export function LessonBookmarkPanel() {
  // TODO: create top-level state for whether the lesson is bookmarked.

  function handleToggleBookmark() {
    // TODO: toggle the bookmark state.
  }

  return (
    <section aria-labelledby="bookmark-heading">
      <h2 id="bookmark-heading">Lesson bookmark</h2>

      <p>{/* TODO: show the current bookmark status. */}</p>

      <button onClick={handleToggleBookmark} type="button">
        {/* TODO: show a different label for each state. */}
      </button>

      {/* TODO: show a short note only when the lesson is bookmarked. */}
    </section>
  )
}`,
  'useeffect-mental-model': `import { useEffect } from 'react'

type LessonDocumentTitleProps = {
  lessonTitle: string
}

export function LessonDocumentTitle({ lessonTitle }: LessonDocumentTitleProps) {
  // TODO: synchronize document.title with the current lesson title.

  return (
    <section aria-labelledby="lesson-title-heading">
      <h2 id="lesson-title-heading">{lessonTitle}</h2>
      <p>This lesson title should also appear in the browser tab.</p>
    </section>
  )
}`,
  'effect-dependencies': `import { useEffect } from 'react'

type ProgressDocumentTitleProps = {
  lessonTitle: string
  completedLessons: number
  totalLessons: number
}

export function ProgressDocumentTitle({
  lessonTitle,
  completedLessons,
  totalLessons,
}: ProgressDocumentTitleProps) {
  // TODO: derive a progress summary during render.
  // TODO: synchronize document.title with the lesson title and progress summary.

  return (
    <section aria-labelledby="progress-heading">
      <h2 id="progress-heading">{lessonTitle}</h2>
      <p>{/* TODO: show the progress summary. */}</p>
    </section>
  )
}`,
  'effect-cleanup': `import { useEffect, useState } from 'react'

export function FocusSessionTimer() {
  const [seconds, setSeconds] = useState(0)

  // TODO: start an interval in an effect.
  // TODO: update seconds safely once per second.
  // TODO: clean up the interval.

  return (
    <section aria-labelledby="focus-session-heading">
      <h2 id="focus-session-heading">Focus session</h2>
      <p>{/* TODO: show elapsed seconds. */}</p>
      <p>{/* TODO: show a short status message. */}</p>
    </section>
  )
}`,
  useref: `import { useRef, useState } from 'react'

export function DraftAutosaveStatus() {
  const [draft, setDraft] = useState('')
  // TODO: create a ref for the last saved draft.

  function handleSave() {
    // TODO: update the ref with the current draft.
  }

  // TODO: derive whether the current draft matches the last saved draft.

  return (
    <section aria-labelledby="draft-heading">
      <h2 id="draft-heading">Draft</h2>

      <label htmlFor="draft-text">Draft text</label>
      <textarea
        id="draft-text"
        onChange={(event) => setDraft(event.target.value)}
        value={draft}
      />

      <button onClick={handleSave} type="button">
        Save draft
      </button>

      <p>{/* TODO: show whether the draft is saved or has unsaved changes. */}</p>
    </section>
  )
}`,
  'custom-hooks': `import { useEffect, useState } from 'react'

function usePersistentDraft(storageKey: string, initialValue: string) {
  // TODO: store the draft in state.
  // TODO: synchronize draft changes to localStorage.
  // TODO: return the draft value and setter.
}

export function LessonDraftEditor() {
  // TODO: use usePersistentDraft for the lesson draft.

  return (
    <section aria-labelledby="lesson-draft-heading">
      <h2 id="lesson-draft-heading">Lesson draft</h2>

      <label htmlFor="lesson-draft">Draft notes</label>
      <textarea id="lesson-draft" />

      <p>{/* TODO: show a short autosave status. */}</p>
    </section>
  )
}`,
}

const hooksPredictionTasksBySlug = {
  'why-hooks-exist': {
    title: 'Prediction',
    description: 'Predict why hooks must follow stable call order.',
    prompt: 'Why should hooks be called at the top level of a component?',
    starterCode: `function Profile({ canEdit }: { canEdit: boolean }) {
  if (canEdit) {
    const [draft, setDraft] = useState('')
  }

  return null
}`,
    options: [
      {
        id: 'performance-only',
        label: 'Mostly for performance, so React can skip unnecessary work.',
      },
      {
        id: 'stable-order',
        label:
          'So React sees hook calls in the same order every render and connects the right state to the right slot.',
      },
      {
        id: 'typescript-rule',
        label: 'Because TypeScript cannot type hooks inside conditions.',
      },
    ],
    feedback: {
      correctOptionId: 'stable-order',
      responses: {
        'performance-only':
          'Not quite. Stable hook order is about correctness first. Performance is not the main reason.',
        'stable-order':
          'Correct. React relies on hook call order to associate state and effects with a component instance.',
        'typescript-rule':
          'Not quite. This is a React rendering rule, not a TypeScript limitation.',
      },
    },
    validation: {
      correctOptionId: 'stable-order',
    },
    metadata: {
      reason:
        'Catches the common misconception that hook rules are arbitrary style rules.',
    },
    type: 'PREDICTION',
    isRequired: true,
  },
  'useeffect-mental-model': {
    title: 'Prediction',
    description: 'Distinguish effect logic from event logic.',
    prompt: 'Which job is a good fit for useEffect?',
    starterCode: null,
    options: [
      {
        id: 'click-submit',
        label: 'Submitting a form because the user clicked Submit.',
      },
      {
        id: 'derive-label',
        label: 'Calculating a button label from current state.',
      },
      {
        id: 'document-title',
        label:
          'Updating document.title after the rendered lesson title changes.',
      },
    ],
    feedback: {
      correctOptionId: 'document-title',
      responses: {
        'click-submit':
          'Not quite. A submit caused by a user action belongs in the event handler.',
        'derive-label':
          'Not quite. Derived UI text belongs in render, not in an effect.',
        'document-title':
          'Correct. The browser tab title is outside React, so an effect can synchronize it after render.',
      },
    },
    validation: {
      correctOptionId: 'document-title',
    },
    metadata: {
      reason:
        'Catches overusing effects for event handlers and derived UI state.',
    },
    type: 'PREDICTION',
    isRequired: true,
  },
  'effect-dependencies': {
    title: 'Prediction',
    description: 'Predict which values belong in an effect dependency array.',
    prompt: 'What should be included in this effect dependency array?',
    starterCode: `useEffect(() => {
  document.title = \`\${lessonTitle} - \${completedLessons} complete\`
}, [])`,
    options: [
      {
        id: 'empty-array',
        label: 'Keep [] because document.title only needs to be set once.',
      },
      {
        id: 'used-values',
        label:
          'Include lessonTitle and completedLessons because the effect reads them.',
      },
      {
        id: 'all-props',
        label:
          'Include every prop in the component, even if the effect does not read it.',
      },
    ],
    feedback: {
      correctOptionId: 'used-values',
      responses: {
        'empty-array':
          'Not quite. The effect reads changing render values, so an empty array can leave the title stale.',
        'used-values':
          'Correct. Dependencies should match the rendered values the effect reads.',
        'all-props':
          'Not quite. Dependencies should describe what this effect uses, not every value nearby.',
      },
    },
    validation: {
      correctOptionId: 'used-values',
    },
    metadata: {
      reason:
        'Catches the misconception that dependency arrays are manual run schedules.',
    },
    type: 'PREDICTION',
    isRequired: true,
  },
}

const reflectionValidation = {
  minWords: 6,
  minCharacters: 40,
}

function createReactBasicsCodeTaskForLesson(lesson, order) {
  const starterCode = reactBasicsStarterCodeBySlug[lesson.slug]

  return {
    title: 'Practice task',
    description: lesson.description,
    prompt: extractMarkdownSection(lesson.content, '## 7. Practice Task'),
    starterCode,
    options: undefined,
    feedback: undefined,
    validation: {
      rejectUnchangedStarter: true,
      starterCodeHash: hashStarterCode(starterCode),
      normalization: 'trim',
    },
    metadata: {
      source: 'apps/api/prisma/seed.mjs',
      sourceModule: 'react-basics',
      sourceSection: 'Practice Task',
    },
    type: 'CODE',
    order,
    isRequired: true,
  }
}

function createReactBasicsReflectionTaskForLesson(lesson, order) {
  return {
    title: 'Reflection',
    description: 'Explain the concept in your own words before moving on.',
    prompt: extractMarkdownSection(lesson.content, '## 9. Reflection'),
    starterCode: undefined,
    options: undefined,
    feedback: undefined,
    validation: reflectionValidation,
    metadata: {
      source: 'apps/api/prisma/seed.mjs',
      sourceModule: 'react-basics',
      sourceSection: 'Reflection',
    },
    type: 'REFLECTION',
    order,
    isRequired: true,
  }
}

function createReactBasicsTasksForLesson(lesson) {
  const predictionTask = reactBasicsPredictionTasksBySlug[lesson.slug]

  if (predictionTask) {
    return [
      {
        ...predictionTask,
        order: 1,
      },
      createReactBasicsCodeTaskForLesson(lesson, 2),
      createReactBasicsReflectionTaskForLesson(lesson, 3),
    ]
  }

  return [
    createReactBasicsCodeTaskForLesson(lesson, 1),
    createReactBasicsReflectionTaskForLesson(lesson, 2),
  ]
}

function createComponentsAndPropsCodeTaskForLesson(lesson, order) {
  const starterCode = componentsAndPropsStarterCodeBySlug[lesson.slug]

  return {
    title: 'Practice task',
    description: lesson.description,
    prompt: extractMarkdownSection(lesson.content, '## 7. Practice Task'),
    starterCode,
    options: undefined,
    feedback: undefined,
    validation: {
      rejectUnchangedStarter: true,
      starterCodeHash: hashStarterCode(starterCode),
      normalization: 'trim',
    },
    metadata: {
      source: 'apps/api/prisma/seed.mjs',
      sourceModule: 'components-and-props',
      sourceSection: 'Practice Task',
    },
    type: 'CODE',
    order,
    isRequired: true,
  }
}

function createComponentsAndPropsReflectionTaskForLesson(lesson, order) {
  return {
    title: 'Reflection',
    description: 'Explain the concept in your own words before moving on.',
    prompt: extractMarkdownSection(lesson.content, '## 9. Reflection'),
    starterCode: undefined,
    options: undefined,
    feedback: undefined,
    validation: reflectionValidation,
    metadata: {
      source: 'apps/api/prisma/seed.mjs',
      sourceModule: 'components-and-props',
      sourceSection: 'Reflection',
    },
    type: 'REFLECTION',
    order,
    isRequired: true,
  }
}

function createComponentsAndPropsTasksForLesson(lesson) {
  const predictionTask = componentsAndPropsPredictionTasksBySlug[lesson.slug]

  if (predictionTask) {
    return [
      {
        ...predictionTask,
        order: 1,
      },
      createComponentsAndPropsCodeTaskForLesson(lesson, 2),
      createComponentsAndPropsReflectionTaskForLesson(lesson, 3),
    ]
  }

  return [
    createComponentsAndPropsCodeTaskForLesson(lesson, 1),
    createComponentsAndPropsReflectionTaskForLesson(lesson, 2),
  ]
}

function createCodeTaskForLesson(lesson, order) {
  const starterCode = stateAndEventsStarterCodeBySlug[lesson.slug]

  return {
    title: 'Practice task',
    description: lesson.description,
    prompt: extractMarkdownSection(lesson.content, '## 7. Practice Task'),
    starterCode,
    options: undefined,
    feedback: undefined,
    validation: {
      rejectUnchangedStarter: true,
      starterCodeHash: hashStarterCode(starterCode),
      normalization: 'trim',
    },
    metadata: {
      source: 'docs/content/react/state-and-events',
      sourceSection: 'Practice Task',
    },
    type: 'CODE',
    order,
    isRequired: true,
  }
}

function createReflectionTaskForLesson(lesson, order) {
  return {
    title: 'Reflection',
    description: 'Explain the concept in your own words before moving on.',
    prompt: extractMarkdownSection(lesson.content, '## 9. Reflection'),
    starterCode: undefined,
    options: undefined,
    feedback: undefined,
    validation: reflectionValidation,
    metadata: {
      source: 'docs/content/react/state-and-events',
      sourceSection: 'Reflection',
    },
    type: 'REFLECTION',
    order,
    isRequired: true,
  }
}

function createLocalStatePredictionTask() {
  return {
    title: 'Prediction',
    description: 'Predict how React state changes what appears on screen.',
    prompt: 'What happens each time the button is clicked?',
    starterCode: `function Counter() {
  const [count, setCount] = useState(0)

  return (
    <button onClick={() => setCount(count + 1)}>
      Clicked {count} times
    </button>
  )
}`,
    options: [
      {
        id: 'increment-once',
        label: 'The button always shows "Clicked 1 time".',
      },
      {
        id: 'increment-each-click',
        label: 'The number increases by 1 after every click.',
      },
      {
        id: 'no-change',
        label: 'The number stays at 0 because count is a const.',
      },
    ],
    feedback: {
      correctOptionId: 'increment-each-click',
      responses: {
        'increment-once':
          'This would be true if count were a regular variable recreated on every render. React preserves useState values between renders, so the count can keep increasing.',
        'increment-each-click':
          'Correct. setCount schedules a render with the next value, and React preserves that state for the component between renders.',
        'no-change':
          'A const prevents reassignment within one render, but setCount does not reassign count. It gives React a new state value to use on the next render.',
      },
    },
    validation: {
      correctOptionId: 'increment-each-click',
    },
    metadata: {
      source: 'golden-lesson-v1-prototype',
    },
    type: 'PREDICTION',
    order: 1,
    isRequired: true,
  }
}

function createStateAndEventsTasksForLesson(lesson) {
  if (lesson.slug === 'local-state-with-usestate') {
    return [
      createLocalStatePredictionTask(),
      createCodeTaskForLesson(lesson, 2),
      createReflectionTaskForLesson(lesson, 3),
    ]
  }

  return [
    createCodeTaskForLesson(lesson, 1),
    createReflectionTaskForLesson(lesson, 2),
  ]
}

function createHooksCodeTaskForLesson(lesson, order) {
  const starterCode = hooksStarterCodeBySlug[lesson.slug]

  return {
    title: 'Practice task',
    description: lesson.description,
    prompt: extractMarkdownSection(lesson.content, '## 7. Practice Task'),
    starterCode,
    options: undefined,
    feedback: undefined,
    validation: {
      rejectUnchangedStarter: true,
      starterCodeHash: hashStarterCode(starterCode),
      normalization: 'trim',
    },
    metadata: {
      source: 'apps/api/prisma/seed.mjs',
      sourceModule: 'hooks',
      sourceSection: 'Practice Task',
    },
    type: 'CODE',
    order,
    isRequired: true,
  }
}

function createHooksReflectionTaskForLesson(lesson, order) {
  return {
    title: 'Reflection',
    description: 'Explain the concept in your own words before moving on.',
    prompt: extractMarkdownSection(lesson.content, '## 9. Reflection'),
    starterCode: undefined,
    options: undefined,
    feedback: undefined,
    validation: reflectionValidation,
    metadata: {
      source: 'apps/api/prisma/seed.mjs',
      sourceModule: 'hooks',
      sourceSection: 'Reflection',
    },
    type: 'REFLECTION',
    order,
    isRequired: true,
  }
}

function createHooksTasksForLesson(lesson) {
  const predictionTask = hooksPredictionTasksBySlug[lesson.slug]

  if (predictionTask) {
    return [
      {
        ...predictionTask,
        order: 1,
      },
      createHooksCodeTaskForLesson(lesson, 2),
      createHooksReflectionTaskForLesson(lesson, 3),
    ]
  }

  return [
    createHooksCodeTaskForLesson(lesson, 1),
    createHooksReflectionTaskForLesson(lesson, 2),
  ]
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

  let reactBasicsTaskCount = 0

  for (const lesson of reactBasicsLessons) {
    const seededLesson = await prisma.lesson.findUniqueOrThrow({
      where: {
        moduleId_slug: {
          moduleId: reactBasicsModule.id,
          slug: lesson.slug,
        },
      },
      select: {
        id: true,
      },
    })
    const tasks = createReactBasicsTasksForLesson(lesson)

    for (const task of tasks) {
      await prisma.lessonTask.upsert({
        where: {
          lessonId_order: {
            lessonId: seededLesson.id,
            order: task.order,
          },
        },
        update: task,
        create: {
          ...task,
          lessonId: seededLesson.id,
        },
      })
    }

    reactBasicsTaskCount += tasks.length
  }

  const componentsAndPropsModule = await prisma.module.findUniqueOrThrow({
    where: {
      technologyId_slug: {
        technologyId: reactTechnology.id,
        slug: 'components-and-props',
      },
    },
    select: {
      id: true,
    },
  })

  for (const lesson of componentsAndPropsLessonsForSeed) {
    await prisma.lesson.upsert({
      where: {
        moduleId_slug: {
          moduleId: componentsAndPropsModule.id,
          slug: lesson.slug,
        },
      },
      update: lesson,
      create: {
        ...lesson,
        moduleId: componentsAndPropsModule.id,
      },
    })
  }

  let componentsAndPropsTaskCount = 0

  for (const lesson of componentsAndPropsLessonsForSeed) {
    const seededLesson = await prisma.lesson.findUniqueOrThrow({
      where: {
        moduleId_slug: {
          moduleId: componentsAndPropsModule.id,
          slug: lesson.slug,
        },
      },
      select: {
        id: true,
      },
    })
    const tasks = createComponentsAndPropsTasksForLesson(lesson)

    for (const task of tasks) {
      await prisma.lessonTask.upsert({
        where: {
          lessonId_order: {
            lessonId: seededLesson.id,
            order: task.order,
          },
        },
        update: task,
        create: {
          ...task,
          lessonId: seededLesson.id,
        },
      })
    }

    componentsAndPropsTaskCount += tasks.length
  }

  const stateAndEventsModule = await prisma.module.findUniqueOrThrow({
    where: {
      technologyId_slug: {
        technologyId: reactTechnology.id,
        slug: 'state-and-events',
      },
    },
    select: {
      id: true,
    },
  })

  for (const lesson of stateAndEventsLessons) {
    await prisma.lesson.upsert({
      where: {
        moduleId_slug: {
          moduleId: stateAndEventsModule.id,
          slug: lesson.slug,
        },
      },
      update: lesson,
      create: {
        ...lesson,
        moduleId: stateAndEventsModule.id,
      },
    })
  }

  let stateAndEventsTaskCount = 0

  for (const lesson of stateAndEventsLessons) {
    const seededLesson = await prisma.lesson.findUniqueOrThrow({
      where: {
        moduleId_slug: {
          moduleId: stateAndEventsModule.id,
          slug: lesson.slug,
        },
      },
      select: {
        id: true,
      },
    })
    const tasks = createStateAndEventsTasksForLesson(lesson)

    for (const task of tasks) {
      await prisma.lessonTask.upsert({
        where: {
          lessonId_order: {
            lessonId: seededLesson.id,
            order: task.order,
          },
        },
        update: task,
        create: {
          ...task,
          lessonId: seededLesson.id,
        },
      })
    }

    stateAndEventsTaskCount += tasks.length
  }

  const hooksModule = await prisma.module.findUniqueOrThrow({
    where: {
      technologyId_slug: {
        technologyId: reactTechnology.id,
        slug: 'hooks',
      },
    },
    select: {
      id: true,
    },
  })

  for (const lesson of hooksLessons) {
    await prisma.lesson.upsert({
      where: {
        moduleId_slug: {
          moduleId: hooksModule.id,
          slug: lesson.slug,
        },
      },
      update: lesson,
      create: {
        ...lesson,
        moduleId: hooksModule.id,
      },
    })
  }

  let hooksTaskCount = 0

  for (const lesson of hooksLessons) {
    const seededLesson = await prisma.lesson.findUniqueOrThrow({
      where: {
        moduleId_slug: {
          moduleId: hooksModule.id,
          slug: lesson.slug,
        },
      },
      select: {
        id: true,
      },
    })
    const tasks = createHooksTasksForLesson(lesson)

    for (const task of tasks) {
      await prisma.lessonTask.upsert({
        where: {
          lessonId_order: {
            lessonId: seededLesson.id,
            order: task.order,
          },
        },
        update: task,
        create: {
          ...task,
          lessonId: seededLesson.id,
        },
      })
    }

    hooksTaskCount += tasks.length
  }

  console.log(`Seeded ${learningPaths.length} learning paths.`)
  console.log(`Seeded ${technologies.length} technologies.`)
  console.log(
    `Linked ${frontendEngineerTechnologies.length} technologies to Frontend Engineer.`,
  )
  console.log(`Seeded ${reactModules.length} React modules.`)
  console.log(`Seeded ${reactBasicsLessons.length} React Basics lessons.`)
  console.log(`Seeded ${reactBasicsTaskCount} React Basics tasks.`)
  console.log(
    `Seeded ${componentsAndPropsLessonsForSeed.length} Components and Props lessons.`,
  )
  console.log(
    `Seeded ${componentsAndPropsTaskCount} Components and Props tasks.`,
  )
  console.log(
    `Seeded ${stateAndEventsLessons.length} State and Events lessons.`,
  )
  console.log(`Seeded ${stateAndEventsTaskCount} State and Events tasks.`)
  console.log(`Seeded ${hooksLessons.length} Hooks lessons.`)
  console.log(`Seeded ${hooksTaskCount} Hooks tasks.`)
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
