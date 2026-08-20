# Understanding React components

## 1. Lesson Goal

Understand a React component as a named piece of UI with one clear responsibility.

By the end, you should be able to look at a screen and identify which parts could become components and why.

## 2. Why It Matters

After React Basics, you can render JSX and data. The next skill is organization.

Real product screens grow quickly. Without components, one file becomes a long mix of headings, buttons, lists, empty states, and labels. Components give that UI structure.

## 3. Core Concept

A component is usually a function that returns UI.

```tsx
function WelcomePanel() {
  return (
    <section>
      <h1>Welcome back</h1>
      <p>Continue your learning path.</p>
    </section>
  )
}
```

The important part is not just the function. It is the responsibility: `WelcomePanel` owns the welcome section.

## 4. Mental Model

Think of a component as a labeled box around a meaningful UI idea.

If you can give the box a useful name, it may be a component. If the name is vague, the boundary may be unclear.

## 5. Guided Walkthrough

Start from a simple screen:

```tsx
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
```

Two sections have different jobs. Extracting them can make the parent easier to read:

```tsx
function DashboardPreview() {
  return (
    <main>
      <WelcomePanel />
      <NextLessonPanel />
    </main>
  )
}
```

## 6. Common Mistakes

### Mistake 1: Extracting without a reason

Do not split code just to make more files. Split when the component name and responsibility are clear.

### Mistake 2: Keeping everything in one component

If a component has several unrelated sections, it becomes harder to scan and change safely.

### Mistake 3: Naming components after appearance only

`BlueBox` describes styling. `NextLessonPanel` describes purpose. Purpose usually ages better.

## 7. Practice Task

Build a `CourseOverview` screen from focused components.

Requirements:

1. Create a parent `CourseOverview` component.
2. Extract a `CourseHeader` component.
3. Extract a `NextLessonPanel` component.
4. Extract a `ProgressPanel` component.
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

Next, you will create functional components deliberately and learn the small rules that keep them predictable.