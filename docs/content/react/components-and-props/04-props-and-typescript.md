# Props and TypeScript

## 1. Lesson Goal

Define TypeScript types for component props so component inputs are clear and mistakes are caught earlier.

## 2. Why It Matters

In a real codebase, components are used by other developers and by your future self.

Typed props make the component contract visible. They help catch missing values, wrong value types, and unclear names before the browser shows a broken UI.

## 3. Core Concept

A props type describes the values a component expects.

```tsx
type ModuleCardProps = {
  title: string
  lessonCount: number
  isPublished: boolean
}
```

Then the component uses that type:

```tsx
function ModuleCard({ title, lessonCount, isPublished }: ModuleCardProps) {
  return (
    <article>
      <h2>{title}</h2>
      <p>{lessonCount} lessons</p>
      <span>{isPublished ? 'Published' : 'Draft'}</span>
    </article>
  )
}
```

## 4. Mental Model

Think of a props type as the component's checklist.

Before someone can use the component correctly, they need to satisfy the checklist. TypeScript helps enforce it.

## 5. Guided Walkthrough

Start with the minimum useful shape:

```tsx
type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced'

type LessonCardProps = {
  title: string
  difficulty: Difficulty
  lessonCount: number
}
```

Use the type where props enter the component:

```tsx
function LessonCard({ title, difficulty, lessonCount }: LessonCardProps) {
  return (
    <article>
      <h2>{title}</h2>
      <p>{difficulty}</p>
      <p>{lessonCount} lessons</p>
    </article>
  )
}
```

## 6. Common Mistakes

### Mistake 1: Using `any` to silence the compiler

`any` removes the help TypeScript is supposed to give. Name the shape instead.

### Mistake 2: Passing more data than the component needs

If a component only renders `title` and `difficulty`, do not pass an entire learning path object without a reason.

### Mistake 3: Making types too clever

Begin with clear simple types. Add complexity only when the component truly needs it.

## 7. Practice Task

Build a typed `ModuleSummaryCard` component.

Requirements:

1. Create a `Difficulty` union type.
2. Create a `ModuleSummaryCardProps` type.
3. Include `title`, `description`, `difficulty`, and `lessonCount`.
4. Render all props inside the component.
5. Render the component from a parent with valid values.

The goal is to make the component contract explicit.

## 8. Self-Check

Before moving on, check that:

- You did not use `any`.
- The props type includes only what the component needs.
- The parent passes valid values.
- The union type prevents unsupported difficulty labels.
- You can explain what TypeScript would catch.

## 9. Reflection

In your own words, explain this:

How do typed props improve collaboration in a React codebase?

Your answer should mention contracts, clarity, or catching mistakes early.

## 10. Next Step

Next, you will compose components together and decide which component owns which part of the UI.