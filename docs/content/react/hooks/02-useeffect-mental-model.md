# useEffect Mental Model

## 1. Lesson Goal

Understand `useEffect` as a way to synchronize a component with something outside React after rendering.

By the end, you should be able to explain the difference between event logic and effect logic.

## 2. Why It Matters

Many React bugs come from using effects for the wrong job. Developers put user actions, derived values, or normal render decisions into effects, then wonder why the component feels unpredictable.

Effects are powerful, but they should be used with a clear reason: synchronization.

## 3. Core Concept

Rendering calculates what the UI should look like. Events respond to user actions. Effects run after React has committed the render and let the component synchronize with external systems.

Examples of external systems include:

- the document title;
- browser APIs;
- subscriptions;
- timers;
- network requests;
- third-party widgets.

```tsx
function LessonTitle({ title }: { title: string }) {
  useEffect(() => {
    document.title = title
  }, [title])

  return <h1>{title}</h1>
}
```

The heading is render output. The browser tab title is outside React, so it is synchronized in an effect.

## 4. Mental Model

Think of an effect as a small synchronization contract:

When these values change, make the outside world match this render.

The effect does not decide what to render. The component already rendered. The effect handles something React cannot express directly in JSX.

## 5. Guided Walkthrough

Imagine a lesson reader that displays a title and updates the browser tab:

```tsx
function LessonReader({ lessonTitle }: { lessonTitle: string }) {
  useEffect(() => {
    document.title = lessonTitle
  }, [lessonTitle])

  return <h1>{lessonTitle}</h1>
}
```

If `lessonTitle` changes, React renders the new heading. After that render, the effect updates `document.title`.

Do not use an effect for work that can happen directly in an event:

```tsx
function SaveButton() {
  function handleClick() {
    console.log('Save now')
  }

  return <button onClick={handleClick}>Save</button>
}
```

The click is already an event. It does not need an effect.

## 6. Common Mistakes

### Mistake 1: Using effects for every state change

Most UI state should be rendered directly. You do not need an effect to calculate text, classes, or disabled states from current state.

### Mistake 2: Moving event logic into effects

If logic should happen because the learner clicked, typed, or submitted, put it in the event handler.

### Mistake 3: Forgetting that effects run after render

Effects do not block rendering. They synchronize after React updates the screen.

## 7. Practice Task

Build a `LessonDocumentTitle` component.

Requirements:

- accept a `lessonTitle` prop;
- render the lesson title on the page;
- use `useEffect` to update `document.title`;
- include the correct dependency;
- keep button or event logic out of the effect.

## 8. Self-Check

- The visible title comes from JSX.
- The browser title is updated inside `useEffect`.
- The effect depends on `lessonTitle`.
- No event-only logic is placed inside the effect.

## 9. Reflection

How would you decide whether code belongs in render, an event handler, or an effect?

## 10. Next Step

Next, you will learn how dependency arrays tell React when an effect needs to synchronize again.