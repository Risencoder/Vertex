# Rendering data

## 1. Lesson Goal

Learn how to render values, arrays, and empty states in React components.

## 2. Why It Matters

Most product UI is data shaped into a screen. Learning paths, lessons, users, notifications, and project reviews all start as data.

If you can render data clearly, you can build useful screens before adding advanced behavior.

## 3. Core Concept

Render simple values with JSX expressions:

```tsx
function ProfileSummary({ name }: { name: string }) {
  return <p>Welcome back, {name}</p>
}
```

Render arrays with `map`:

```tsx
const lessons = [
  { slug: 'jsx-fundamentals', title: 'JSX fundamentals' },
  { slug: 'components-overview', title: 'Components overview' },
]
```

Each rendered item needs a stable `key`.

## 4. Mental Model

Think of rendering data as translating a data shape into a UI shape.

A string becomes text. An object becomes a card. An array becomes a list. An empty array becomes an empty state.

## 5. Guided Walkthrough

```tsx
function LessonList() {
  return (
    <ul>
      {lessons.map((lesson) => (
        <li key={lesson.slug}>{lesson.title}</li>
      ))}
    </ul>
  )
}
```

If there are no lessons, show a useful message:

```tsx
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
```

## 6. Common Mistakes

### Mistake 1: Using the array index as the default key

Indexes can cause confusing UI bugs when items are inserted, removed, or reordered. Prefer stable IDs or slugs.

### Mistake 2: Forgetting the empty state

A blank screen makes users wonder if the app is broken. Empty states explain what happened.

### Mistake 3: Doing too much inside `map`

If each item becomes complex, extract an item component.

## 7. Practice Task

Build a `LessonOverviewList` component.

Requirements:

1. Create an array of lesson objects with `slug`, `title`, and `difficulty`.
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
- Your JSX inside `map` stays readable.
- You can explain why keys help React track list items.

## 9. Reflection

In your own words, explain this:

Why is a stable key important when rendering a list?

Your answer should mention helping React track items across renders.

## 10. Next Step

Next, you will combine the React basics into one small UI section.