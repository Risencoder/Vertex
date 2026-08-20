# Effect Cleanup

## 1. Lesson Goal

Learn when an effect should return a cleanup function and how cleanup prevents stale external work.

By the end, you should be able to create and clean up a timer safely.

## 2. Why It Matters

Effects often connect to something outside React. If that work continues after the component changes or unmounts, it can cause bugs, duplicate updates, memory leaks, or confusing behavior.

Cleanup is the habit that keeps synchronization responsible.

## 3. Core Concept

An effect can return a function. React calls that function before the effect runs again and when the component unmounts.

```tsx
useEffect(() => {
  const intervalId = window.setInterval(() => {
    console.log('tick')
  }, 1000)

  return () => {
    window.clearInterval(intervalId)
  }
}, [])
```

The effect starts the timer. The cleanup stops it.

## 4. Mental Model

Think in pairs:

- subscribe -> unsubscribe;
- start timer -> stop timer;
- add listener -> remove listener;
- connect -> disconnect.

If an effect starts something that can keep running, the cleanup should stop it.

## 5. Guided Walkthrough

A simple timer component needs state and an effect:

```tsx
function ReadingTimer() {
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setSeconds((current) => current + 1)
    }, 1000)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [])

  return <p>Reading for {seconds} seconds</p>
}
```

The effect starts once. The cleanup prevents the interval from continuing after the component is gone.

Notice the updater function inside `setSeconds`. It avoids needing `seconds` in the dependency array.

## 6. Common Mistakes

### Mistake 1: Starting timers without stopping them

Intervals continue until cleared. Always clean up timers created in effects.

### Mistake 2: Cleaning up the wrong thing

The cleanup should undo the exact external work started by that effect.

### Mistake 3: Adding changing state as a dependency by accident

For intervals that update based on previous state, an updater function often keeps the effect simpler and correct.

## 7. Practice Task

Build a `FocusSessionTimer` component.

Requirements:

- track elapsed seconds with state;
- start an interval in `useEffect`;
- update seconds safely with an updater function;
- clean up the interval;
- show the elapsed time and a short status message.

## 8. Self-Check

- The interval is created inside an effect.
- The cleanup clears the same interval.
- The state update uses an updater function.
- The effect does not create multiple active intervals.

## 9. Reflection

What kinds of external work should make you look for a cleanup function?

## 10. Next Step

Next, you will learn `useRef`, a hook for storing stable values that should not cause re-renders.