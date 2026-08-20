# Custom Hooks

## 1. Lesson Goal

Learn how custom hooks let you reuse stateful logic without copying component code.

By the end, you should be able to extract a small hook that combines state, effects, and a clear return value.

## 2. Why It Matters

As components grow, repeated behavior appears: timers, saved drafts, document titles, subscriptions, toggles, and form helpers.

Copying that logic across components creates drift. A custom hook lets you name the behavior and reuse it while keeping UI components focused on rendering.

## 3. Core Concept

A custom hook is a function whose name starts with `use` and that calls other hooks.

```tsx
function useDocumentTitle(title: string) {
  useEffect(() => {
    document.title = title
  }, [title])
}
```

Components can call the custom hook at the top level:

```tsx
function LessonPageTitle({ title }: { title: string }) {
  useDocumentTitle(title)

  return <h1>{title}</h1>
}
```

The custom hook owns behavior. The component owns UI.

## 4. Mental Model

Extract a custom hook when you can name a reusable behavior, not just because a component has many lines.

A good custom hook has:

- a clear purpose;
- focused inputs;
- a predictable return value;
- no hidden UI decisions.

## 5. Guided Walkthrough

Start with behavior inside one component:

```tsx
function ReadingTimer() {
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setSeconds((current) => current + 1)
    }, 1000)

    return () => window.clearInterval(intervalId)
  }, [])

  return <p>{seconds} seconds</p>
}
```

Now extract the behavior:

```tsx
function useElapsedSeconds() {
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setSeconds((current) => current + 1)
    }, 1000)

    return () => window.clearInterval(intervalId)
  }, [])

  return seconds
}
```

The component becomes simpler:

```tsx
function ReadingTimer() {
  const seconds = useElapsedSeconds()

  return <p>{seconds} seconds</p>
}
```

## 6. Common Mistakes

### Mistake 1: Extracting too early

Wait until the behavior has a clear name or repeated use. Premature hooks can hide simple logic.

### Mistake 2: Returning too much

A custom hook should return what the component needs, not every internal detail.

### Mistake 3: Putting JSX inside a hook

Hooks should manage behavior. Components should render UI.

## 7. Practice Task

Build a `usePersistentDraft` hook and a `LessonDraftEditor` component.

Requirements:

- the hook accepts a storage key and initial value;
- the hook stores draft text in state;
- the hook synchronizes the draft to `localStorage` with an effect;
- the component renders a controlled textarea;
- the component uses the hook's returned value and setter.

## 8. Self-Check

- The custom hook starts with `use`.
- The hook calls hooks only at the top level.
- The hook owns state and synchronization logic.
- The component owns the JSX and user-facing labels.

## 9. Reflection

What makes a piece of stateful behavior worth extracting into a custom hook?

## 10. Next Step

Next, you will move from hook behavior into routing, where React screens become navigable application flows.