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

  for (const lesson of componentsAndPropsLessons) {
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

  console.log(`Seeded ${learningPaths.length} learning paths.`)
  console.log(`Seeded ${technologies.length} technologies.`)
  console.log(
    `Linked ${frontendEngineerTechnologies.length} technologies to Frontend Engineer.`,
  )
  console.log(`Seeded ${reactModules.length} React modules.`)
  console.log(`Seeded ${reactBasicsLessons.length} React Basics lessons.`)
  console.log(`Seeded ${reactBasicsTaskCount} React Basics tasks.`)
  console.log(
    `Seeded ${componentsAndPropsLessons.length} Components and Props lessons.`,
  )
  console.log(
    `Seeded ${stateAndEventsLessons.length} State and Events lessons.`,
  )
  console.log(`Seeded ${stateAndEventsTaskCount} State and Events tasks.`)
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
