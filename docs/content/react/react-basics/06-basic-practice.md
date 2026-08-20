# Basic practice

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

```tsx
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
```

Then render a list of lesson data:

```tsx
const lessons = [
  {
    slug: 'what-is-react',
    title: 'What is React?',
    description: 'Understand the role of React.',
    difficulty: 'Beginner',
  },
]
```

The final screen should read like a real product section, even if the data is local.

## 6. Common Mistakes

### Mistake 1: Building everything in one component

The point is to practice composition. Split repeated lesson UI into a card component.

### Mistake 2: Hardcoding repeated markup

If three cards have the same shape, use data and `map`.

### Mistake 3: Skipping empty states

Even static practice should include the habit of handling no data.

## 7. Practice Task

Build a `LearningPathPreview` component.

Requirements:

1. Create a `LessonCard` component.
2. Create local lesson data with at least three lessons.
3. Render the lessons with `map`.
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

Next, you will move into Components and Props, where these static components become reusable through explicit inputs.