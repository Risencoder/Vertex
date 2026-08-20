# Components overview

## 1. Lesson Goal

Learn how to think about components as named, focused pieces of UI with clear responsibilities.

## 2. Why It Matters

Real screens become complicated quickly. A dashboard can contain navigation, metrics, lists, forms, and empty states.

Components let you split that complexity into smaller pieces that can be named, reviewed, tested, and reused.

## 3. Core Concept

A React component is a function that returns UI. The strongest components have a clear purpose.

```tsx
function EmptyState() {
  return (
    <section>
      <h2>No lessons yet</h2>
      <p>New content will appear here soon.</p>
    </section>
  )
}
```

The name `EmptyState` tells another developer what this UI is for.

## 4. Mental Model

Think of components as paragraphs in a well-written document.

One huge paragraph is hard to read. Too many tiny fragments are also hard to follow. Good components split the UI at meaningful boundaries.

## 5. Guided Walkthrough

Start with the screen:

```tsx
function DashboardPreview() {
  return (
    <main>
      <WelcomePanel />
      <ProgressSummary />
      <LessonList />
    </main>
  )
}
```

Each child component has a responsibility:

- `WelcomePanel` greets the learner.
- `ProgressSummary` shows progress.
- `LessonList` renders available lessons.

This is composition: building a larger UI from smaller components.

## 6. Common Mistakes

### Mistake 1: Putting the whole page in one component

Large components hide intent. Split when a section has a clear name and responsibility.

### Mistake 2: Splitting too early

Do not create a component just to wrap one line. Split for clarity, reuse, or ownership.

### Mistake 3: Using vague names

Names like `Box`, `Thing`, or `Content` often fail to explain the component's role.

## 7. Practice Task

Build a small `DashboardPreview` using three components.

Requirements:

1. Create `WelcomePanel`, `ProgressSummary`, and `NextLessonCard`.
2. Compose them inside `DashboardPreview`.
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

Next, you will render real values and lists from data inside components.