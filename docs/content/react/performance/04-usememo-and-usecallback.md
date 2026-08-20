# useMemo and useCallback

## 1. Lesson Goal

By the end of this lesson, you should be able to explain when `useMemo` and `useCallback` are useful and when they add unnecessary complexity.

These hooks are optimization tools with costs, not default best practices.

## 2. Why It Matters

Developers often reach for `useMemo` and `useCallback` because they see a component re-rendering. That can make code harder to read without making the app faster.

Used well, these hooks solve specific problems: avoiding expensive recalculation or keeping a prop stable for a memoized child.

## 3. Core Concept

`useMemo` memoizes a calculated value:

```tsx
const visibleLessons = useMemo(() => {
  return lessons.filter((lesson) => lesson.title.includes(query));
}, [lessons, query]);
```

`useCallback` memoizes a function identity:

```tsx
const handleSelectLesson = useCallback((lessonId: string) => {
  setSelectedLessonId(lessonId);
}, []);
```

Both depend on dependency arrays. Both add mental overhead. Use them when the saved work or stable identity matters.

## 4. Mental Model

Think of these hooks as caches inside a component.

A cache is useful when recomputing is expensive or when stable identity unlocks another optimization. A cache is not free. It needs dependencies, memory, and reader attention.

Before adding one, ask: "What work am I avoiding, and how do I know it matters?"

## 5. Guided Walkthrough

Filtering a small array usually does not need `useMemo`:

```tsx
const visibleLessons = lessons.filter((lesson) => lesson.title.includes(query));
```

That is readable and probably cheap.

If the list is large, the filtering is expensive, and typing feels slow, `useMemo` may be reasonable:

```tsx
const visibleLessons = useMemo(() => {
  return expensiveFilter(lessons, query);
}, [lessons, query]);
```

For `useCallback`, the common case is a memoized child:

```tsx
const LessonList = React.memo(function LessonList({
  lessons,
  onSelectLesson,
}: LessonListProps) {
  return null;
});
```

If `onSelectLesson` is recreated every render, the child may still re-render. `useCallback` can stabilize it when that child boundary is worth protecting.

## 6. Common Mistakes

- Adding `useMemo` to every calculation.
- Adding `useCallback` to every event handler.
- Forgetting dependencies and creating stale values.
- Using memo hooks before fixing state ownership or component boundaries.

## 7. Practice Task

Build a `LessonSearchPanel`.

It should filter a lesson list by query. Start with normal derived values. Then add `useMemo` only around an intentionally expensive filter function and use `useCallback` only for a handler passed into a memoized child.

Success criteria:

- the initial code is readable without memo hooks;
- `useMemo` wraps a calculation with a clear cost;
- `useCallback` supports a memoized child boundary;
- dependency arrays include the values the memoized logic reads.

## 8. Self-Check

- What work does `useMemo` avoid?
- Why does the callback identity matter?
- Are the dependency arrays accurate?
- Would the code be better without memoization at this size?

## 9. Reflection

Explain one case where `useMemo` or `useCallback` improves a React screen and one case where it would only make the code harder to read.

## 10. Next Step

Next, you will practice measuring before optimizing so performance decisions are based on evidence instead of habit.
