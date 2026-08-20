# Effect Dependencies

## 1. Lesson Goal

Learn how effect dependencies describe the values an effect reads from the render.

By the end, you should be able to choose dependencies by reasoning from the effect body instead of guessing.

## 2. Why It Matters

Dependency bugs are subtle. Missing dependencies can make an effect use stale values. Extra unnecessary dependencies can make an effect run more often than needed.

Professional React work requires explaining why an effect runs when it does.

## 3. Core Concept

The dependency array tells React which rendered values the effect depends on.

```tsx
useEffect(() => {
  document.title = lessonTitle
}, [lessonTitle])
```

The effect reads `lessonTitle`, so `lessonTitle` belongs in the dependency array.

An empty dependency array means the effect does not read changing values from render and only needs to run after the first render.

## 4. Mental Model

Read the effect body and ask: "Which values from this render does this synchronization use?"

Those values are dependencies.

The dependency array is not a schedule you manually tune. It is a description of what the effect needs to stay correct.

## 5. Guided Walkthrough

This effect depends on two values:

```tsx
function ProgressTitle({
  lessonTitle,
  completedCount,
}: {
  lessonTitle: string
  completedCount: number
}) {
  useEffect(() => {
    document.title = `${lessonTitle} (${completedCount} complete)`
  }, [lessonTitle, completedCount])

  return <h1>{lessonTitle}</h1>
}
```

If either value changes, the document title must be synchronized again.

Now compare a mount-only effect:

```tsx
useEffect(() => {
  console.log('Lesson reader mounted')
}, [])
```

This effect does not read changing props or state, so an empty array is reasonable.

## 6. Common Mistakes

### Mistake 1: Using an empty array to silence reruns

An empty array is correct only when the effect does not need changing values from render.

### Mistake 2: Thinking dependencies are optional notes

Dependencies are part of the effect's correctness. Missing one can make the effect synchronize old data.

### Mistake 3: Storing derived values in state just to avoid dependencies

If a value can be calculated during render, calculate it during render. Do not move it into an effect to avoid dependency thinking.

## 7. Practice Task

Build a `ProgressDocumentTitle` component.

Requirements:

- accept `lessonTitle`, `completedLessons`, and `totalLessons` props;
- render the progress summary in JSX;
- use `useEffect` to update `document.title`;
- include every value the effect reads;
- avoid derived state.

## 8. Self-Check

- The dependency array matches the values used inside the effect.
- The progress percentage or summary is derived during render.
- The effect does not hide stale values.
- The component stays easy to explain.

## 9. Reflection

What question can you ask yourself to identify the correct dependencies for an effect?

## 10. Next Step

Next, you will learn cleanup: how an effect disconnects from external work it started earlier.