# What is React?

## 1. Lesson Goal

Understand React as a tool for describing user interfaces with components, not as a magic layer that replaces HTML, CSS, or JavaScript.

By the end, you should be able to explain what React does, where it fits in a frontend app, and why component-based UI matters.

## 2. Why It Matters

Real products change constantly. A dashboard may show a signed-in user, an empty state, a loading message, or a list of lessons.

Without structure, UI code becomes a pile of manual DOM updates. React gives you a way to describe the screen as small pieces and let the rendering layer update the browser when data changes.

## 3. Core Concept

React is a JavaScript library for building user interfaces. Its main idea is simple: write components that describe what should appear on screen.

A component is usually a function that returns JSX.

```tsx
function WelcomeCard() {
  return (
    <section>
      <h1>Welcome back</h1>
      <p>Continue your learning path.</p>
    </section>
  )
}
```

React does not remove HTML or CSS. It gives you a component model for organizing them with JavaScript.

## 4. Mental Model

Think of a React component as a recipe for part of the UI.

The component receives information, decides what the UI should look like, and returns a description of that UI. React compares that description with what is already on the screen and updates the browser.

You focus on the desired result. React handles the rendering mechanics.

## 5. Guided Walkthrough

A small product screen may start like this:

```tsx
function LearningStatus() {
  const lessonCount = 3

  return (
    <section>
      <h2>React Basics</h2>
      <p>{lessonCount} lessons available</p>
    </section>
  )
}
```

Notice what React adds:

1. The UI has a name: `LearningStatus`.
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

Build a small `LearningStatus` component.

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

Next, you will look at the project setup that lets React code run locally and grow into a real application.