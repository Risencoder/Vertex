# React.memo and Component Boundaries

## 1. Lesson Goal

By the end of this lesson, you should be able to decide when a component boundary and `React.memo` can reduce useful work, and when it only adds noise.

The goal is not to wrap every component. The goal is to protect expensive subtrees when their inputs have not changed.

## 2. Why It Matters

Large screens often contain sections that update for different reasons. A filter panel, a chart, a sidebar, and a table may not all need to re-render for the same interaction.

Good boundaries make those sections easier to reason about. `React.memo` can help when a child receives the same props and rendering it is meaningfully expensive.

## 3. Core Concept

`React.memo` tells React it can skip re-rendering a component when its props are equal to the previous props.

```tsx
const LessonCard = React.memo(function LessonCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <article>
      <h2>{title}</h2>
      <p>{description}</p>
    </article>
  );
});
```

This is useful only if the component receives stable props and skipping its render saves meaningful work.

## 4. Mental Model

Think of `React.memo` as a checkpoint at a component boundary.

When the parent renders, React reaches the checkpoint and asks, "Are the props the same as last time?" If yes, it may reuse the previous result. If props are new every time, the checkpoint does little.

Boundaries come first. Memoization works best when your component tree already separates independent concerns.

## 5. Guided Walkthrough

Suppose a dashboard has a search input and a large summary card:

```tsx
function Dashboard({ summary }: { summary: Summary }) {
  const [query, setQuery] = useState("");

  return (
    <>
      <SearchBox value={query} onChange={setQuery} />
      <SummaryPanel summary={summary} />
    </>
  );
}
```

Typing updates `query`, so the parent renders. If `SummaryPanel` is expensive and `summary` is stable, `React.memo` may help:

```tsx
const SummaryPanel = React.memo(function SummaryPanel({
  summary,
}: {
  summary: Summary;
}) {
  return <ExpensiveChart data={summary.chartData} />;
});
```

But if the parent creates a new `summary` object every render, `React.memo` cannot help much because the prop identity changes.

## 6. Common Mistakes

- Wrapping every component in `React.memo` by default.
- Memoizing tiny components that are already cheap.
- Passing new objects or functions every render and expecting memo to skip work.
- Using memoization to hide poor state ownership.

## 7. Practice Task

Build a `CourseDashboard` with a search input and an expensive-looking `ProgressSummary` child.

First separate the summary into its own component. Then use `React.memo` only if the summary receives stable props and has a clear reason to skip re-renders.

Success criteria:

- component boundaries separate independent UI sections;
- `React.memo` is applied to a child with stable props;
- you can explain what interaction should no longer re-render the memoized child;
- you do not memoize unrelated small components.

## 8. Self-Check

- What props does the memoized component receive?
- Are those props stable across unrelated parent renders?
- Is the component expensive enough to justify memoization?
- Would better state ownership remove the need for memo?

## 9. Reflection

Explain why `React.memo` is most useful at good component boundaries rather than as a default wrapper around every component.

## 10. Next Step

Next, you will look at `useMemo` and `useCallback`, which can help stabilize expensive calculations and function props when there is a measured reason.
