# Component composition

## 1. Lesson Goal

Compose small components into larger UI while keeping data ownership and boundaries easy to follow.

## 2. Why It Matters

Composition is how React apps scale. Pages arrange sections. Sections arrange cards, controls, and empty states. Each layer should have a clear job.

Good composition keeps a screen readable without hiding how data moves.

## 3. Core Concept

Composition means using components inside other components.

```tsx
function DashboardPage() {
  return (
    <main>
      <PageHeader title="Dashboard" />
      <ProgressSummary completedLessons={4} totalLessons={10} />
    </main>
  )
}
```

The parent decides the layout and passes data down.

## 4. Mental Model

Think of composition as arranging a team.

The parent coordinates. Children handle focused responsibilities. Data flows down through props. A child should not reach sideways into another child's work.

## 5. Guided Walkthrough

Use props for data:

```tsx
function PageHeader({ title }: { title: string }) {
  return <h1>{title}</h1>
}
```

Use `children` when a component should wrap flexible content:

```tsx
function Panel({ children }: { children: React.ReactNode }) {
  return <section className="panel">{children}</section>
}
```

Compose them:

```tsx
function DashboardPage() {
  return (
    <Panel>
      <PageHeader title="Dashboard" />
      <p>Continue your learning journey.</p>
    </Panel>
  )
}
```

## 6. Common Mistakes

### Mistake 1: Making children own data they should only display

If the parent knows the data, pass it down. Keep ownership visible.

### Mistake 2: Using `children` for everything

`children` is useful for flexible wrappers. Use named props when the component needs specific data.

### Mistake 3: Creating hidden dependencies

A child should not depend on unrelated page details. Pass the exact inputs it needs.

## 7. Practice Task

Build a composed `LearningPanel`.

Requirements:

1. Create a reusable `Panel` component that accepts `children`.
2. Create a `PanelHeader` component with typed props.
3. Create a `LessonPreviewCard` component with typed props.
4. Compose them inside `LearningPanel`.
5. Keep data ownership in `LearningPanel`.
6. Pass only the props each child needs.

The goal is to practice composition and ownership boundaries.

## 8. Self-Check

Before moving on, check that:

- The parent owns the data.
- Children receive data through props.
- `children` is used only for flexible wrapping.
- Component boundaries are clear.
- You can explain the direction data flows.

## 9. Reflection

In your own words, explain this:

What is the difference between passing data through props and passing UI through `children`?

Your answer should mention specific inputs, flexible content, or composition.

## 10. Next Step

Next, you will combine extraction, props, typing, and composition in a focused practice build.