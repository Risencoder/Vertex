# Setting up a React project

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

```bash
pnpm create vite my-app --template react-ts
cd my-app
pnpm install
pnpm dev
```

## 4. Mental Model

Think of the project as a small workshop.

The package scripts are the switches. The build tool is the machinery. The `src` folder is your workbench. React components are the pieces you assemble into the UI.

When you run the dev script, the workshop turns on and shows your app in the browser.

## 5. Guided Walkthrough

The entry file usually mounts React:

```tsx
import { createRoot } from 'react-dom/client'
import { App } from './App'

createRoot(document.getElementById('root')!).render(<App />)
```

The `App` component is often the first visible component:

```tsx
export function App() {
  return <h1>Hello React</h1>
}
```

This means the browser loads HTML, React finds the root element, and your component tree starts from `App`.

## 6. Common Mistakes

### Mistake 1: Editing generated files without understanding them

Generated starter files are not sacred. They are a starting point. Learn which files are entry points and which are examples.

### Mistake 2: Creating too many folders too early

Structure should help you find code. A beginner project does not need every folder a large production app might use.

### Mistake 3: Ignoring scripts

Scripts such as `dev`, `build`, and `lint` are part of the engineering workflow. Learn what each one checks.

## 7. Practice Task

Build a small `ProjectMap` component that explains a React project structure.

Requirements:

1. Show three items: package scripts, source folder, and app entry point.
2. Give each item a short practical description.
3. Use clear headings and paragraphs.
4. Keep the component static.
5. Do not add routing, state, or data fetching.

The goal is to explain the project structure as UI.

## 8. Self-Check

Before moving on, check that:

- You can explain what `src/main.tsx` does.
- You can explain what `App.tsx` usually represents.
- You know which script starts local development.
- Your practice component describes structure without adding unrelated behavior.
- Your naming would make sense to another developer.

## 9. Reflection

In your own words, explain this:

Why is understanding the project entry point useful before building features?

Your answer should mention debugging, navigation through the codebase, or confidence changing files.

## 10. Next Step

Next, you will learn JSX, the syntax React components use to describe UI structure.