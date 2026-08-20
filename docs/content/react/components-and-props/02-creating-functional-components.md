# Creating functional components

## 1. Lesson Goal

Create functional components that return clear JSX and can be composed inside other components.

## 2. Why It Matters

Most modern React code is written with function components. If you can write small function components confidently, you can read and contribute to real React codebases.

This lesson is about the shape and habits of a good component, not advanced behavior.

## 3. Core Concept

A function component is a JavaScript or TypeScript function whose name starts with an uppercase letter and returns JSX.

```tsx
function PageTitle() {
  return <h1>Frontend Engineer</h1>
}
```

React treats uppercase JSX tags as components:

```tsx
function Page() {
  return <PageTitle />
}
```

## 4. Mental Model

Think of a function component as a reusable UI sentence.

The name tells you what the sentence is about. The returned JSX says it. Composition lets you put sentences together into a page.

## 5. Guided Walkthrough

Start with a component that returns one JSX tree:

```tsx
function EmptyState() {
  return (
    <section>
      <h2>No lessons yet</h2>
      <p>New lessons will appear here soon.</p>
    </section>
  )
}
```

Then use it from another component:

```tsx
function LessonsPanel() {
  return (
    <div>
      <EmptyState />
    </div>
  )
}
```

## 6. Common Mistakes

### Mistake 1: Calling components like normal functions in JSX

Write `<EmptyState />`, not `EmptyState()`. JSX keeps component usage visible.

### Mistake 2: Starting component names with lowercase letters

Lowercase JSX names are treated like built-in DOM elements. Use uppercase names for your components.

### Mistake 3: Returning disconnected sibling elements

Return one JSX tree. Use a semantic wrapper or a fragment.

## 7. Practice Task

Build a `LessonEmptyState` component and use it inside `LessonsPanel`.

Requirements:

1. Create `LessonEmptyState`.
2. Return a heading, short message, and one button.
3. Create `LessonsPanel`.
4. Render `LessonEmptyState` inside `LessonsPanel`.
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

Why does React component usage look like `<LessonEmptyState />` instead of a normal function call?

Your answer should mention readability, JSX, or component composition.

## 10. Next Step

Next, you will pass data into components so the same component can render different content.