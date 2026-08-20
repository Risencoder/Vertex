# Why Hooks Exist

## 1. Lesson Goal

Understand hooks as React's way to let function components use stateful React features without changing the component model.

By the end, you should be able to explain why hooks exist, where hooks belong, and why the rules of hooks are not random style preferences.

## 2. Why It Matters

You already know state and events. Hooks are the next layer: they let components remember state, synchronize with external systems, keep references, and reuse stateful behavior.

In real projects, hooks appear everywhere. If you treat them as magic functions, components become hard to debug. If you understand the mental model, hooks become a predictable tool for organizing behavior.

## 3. Core Concept

A hook is a function that lets a React component connect to a React feature.

`useState` connects a component to local state. `useEffect` connects a component to external synchronization. `useRef` gives a component a stable container that does not trigger renders.

Hooks must be called at the top level of a component or another hook. Do not call hooks inside conditions, loops, event handlers, or nested helper functions.

```tsx
function ProfileStatus() {
  const [isOnline, setIsOnline] = useState(false)

  return (
    <button onClick={() => setIsOnline((current) => !current)}>
      {isOnline ? 'Online' : 'Offline'}
    </button>
  )
}
```

The component can re-render many times, but React needs hook calls to happen in the same order each render.

## 4. Mental Model

Think of hooks as numbered slots React associates with a component instance.

On every render, React walks through the hook calls in order. The first hook call gets the first slot, the second hook call gets the second slot, and so on.

If a hook is hidden inside a condition, the order can change between renders. React may then connect the wrong state or effect to the wrong slot. The rules of hooks protect that order.

## 5. Guided Walkthrough

Start with state at the top level:

```tsx
function LessonBookmark() {
  const [isBookmarked, setIsBookmarked] = useState(false)

  return (
    <button onClick={() => setIsBookmarked((current) => !current)}>
      {isBookmarked ? 'Remove bookmark' : 'Bookmark lesson'}
    </button>
  )
}
```

Now compare that with a broken pattern:

```tsx
function LessonBookmark({ canBookmark }: { canBookmark: boolean }) {
  if (canBookmark) {
    const [isBookmarked, setIsBookmarked] = useState(false)
  }

  return null
}
```

The hook only runs sometimes. That means the hook order can change. Instead, call the hook every render and put the condition in the UI or handler logic.

## 6. Common Mistakes

### Mistake 1: Calling hooks only when needed

Hooks should not be conditional. Call them at the top level, then use conditions around behavior or rendering.

### Mistake 2: Treating hooks like normal utility functions

Hooks participate in React rendering. A helper function can be called anywhere, but a hook must follow hook rules.

### Mistake 3: Creating one large component because hooks feel local

Hooks make behavior possible inside function components, but they do not remove the need for clear component boundaries.

## 7. Practice Task

Build a `LessonBookmarkPanel` component.

Requirements:

- use `useState` at the top level;
- let the learner toggle a bookmark on and off;
- show a different status message for bookmarked and unbookmarked states;
- show an optional note only when bookmarked;
- keep hook calls outside conditions.

## 8. Self-Check

- The hook is called before any conditional return or branch.
- The button changes the state with a clear handler.
- The UI changes based on state.
- No hook is called inside an `if`, loop, event handler, or nested function.

## 9. Reflection

Why does React need hooks to be called in the same order on every render?

## 10. Next Step

Next, you will learn `useEffect`, the hook React uses when a component needs to synchronize with something outside rendering.