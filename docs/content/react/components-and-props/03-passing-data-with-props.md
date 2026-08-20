# Passing data with props

## 1. Lesson Goal

Use props to pass data from a parent component into a child component.

## 2. Why It Matters

A component becomes useful when it can render different data without being rewritten.

For example, one `LessonCard` component should be able to show JSX Fundamentals, Components Overview, or State and Events depending on the props it receives.

## 3. Core Concept

Props are read-only inputs passed to a component through JSX attributes.

```tsx
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
```

The parent provides the values:

```tsx
<LessonCard
  title="Components and Props"
  description="Create reusable UI with clear inputs."
/>
```

## 4. Mental Model

Think of props as function parameters for UI.

The parent owns the data. The child receives the data and renders it. The child should not secretly invent or mutate the parent's data.

## 5. Guided Walkthrough

Render multiple cards with different values:

```tsx
function LessonGrid() {
  return (
    <>
      <LessonCard title="JSX" description="Describe UI with syntax." />
      <LessonCard title="Props" description="Pass data into components." />
    </>
  )
}
```

The component implementation is reused. The props make each usage specific.

## 6. Common Mistakes

### Mistake 1: Hardcoding data inside a reusable component

If every card has the same title inside the component, it is not reusable yet.

### Mistake 2: Passing one huge object too early

Prefer explicit props while learning. They make the component contract easier to see.

### Mistake 3: Trying to change props inside the child

Props are inputs. Render from them. Later, you will learn how children can request changes through events.

## 7. Practice Task

Build a reusable `LessonCard` component with props.

Requirements:

1. Create a `LessonCard` component.
2. Pass `title`, `description`, and `difficulty` as props.
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

Next, you will use TypeScript to make prop contracts explicit and safer.