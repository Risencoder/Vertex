# Avoiding Unnecessary State

## 1. Lesson Goal

By the end of this lesson, you should be able to remove unnecessary state and place remaining state closer to the UI that owns it.

This is often the best first performance improvement because it makes the app simpler before it makes it faster.

## 2. Why It Matters

Every state update schedules a render. That does not mean state is bad. It means state should represent real information that can change independently.

When derived values or local UI details are stored too high in the tree, the app may render more than needed and become harder to debug.

## 3. Core Concept

Do not store values that can be calculated from current props or state during render.

```tsx
function LessonSummary({
  completed,
  total,
}: {
  completed: number;
  total: number;
}) {
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  return <p>{percentage}% complete</p>;
}
```

`percentage` does not need state because it is derived from `completed` and `total`.

State should answer: "Could this value change independently?" If not, derive it.

## 4. Mental Model

Think of state as source data, not every value the UI displays.

Source data is information the user changes, the server returns, or the app must remember. Derived data is a calculation from that source.

The fewer sources of truth you maintain, the fewer updates React needs to coordinate and the fewer synchronization bugs you create.

## 5. Guided Walkthrough

This version stores too much:

```tsx
const [completedLessons, setCompletedLessons] = useState(3);
const [totalLessons, setTotalLessons] = useState(10);
const [percentage, setPercentage] = useState(30);
```

Now the component has to keep `percentage` synchronized. If `completedLessons` changes and `percentage` does not, the UI lies.

Prefer this:

```tsx
const [completedLessons, setCompletedLessons] = useState(3);
const [totalLessons, setTotalLessons] = useState(10);

const percentage =
  totalLessons === 0 ? 0 : Math.round((completedLessons / totalLessons) * 100);
```

State ownership matters too. If a modal's open state only affects the modal, it may not belong in the entire dashboard component. Moving it closer can prevent unrelated sections from being pulled into that update.

## 6. Common Mistakes

- Storing derived values like counts, labels, or percentages in state.
- Keeping a small local interaction state in a large parent component.
- Moving state down so far that siblings can no longer coordinate correctly.
- Removing state without checking whether the value really changes independently.

## 7. Practice Task

Refactor a `ProgressPanel` that stores too much state.

Keep only the source values in state. Derive percentage, status label, and button text during render. Then move a small details toggle into a child component if it does not need to affect the parent.

Success criteria:

- derived values are no longer stored as state;
- the UI still shows percentage, status, and labels correctly;
- local toggle state is owned by the smallest useful component;
- the code is easier to reason about before any memoization is added.

## 8. Self-Check

- Which values are true sources of state?
- Which values can be derived every render?
- Did moving state down break any coordination?
- Did the refactor reduce both complexity and render scope?

## 9. Reflection

Describe one value that should stay in state and one value that should be derived in the UI. Explain why.

## 10. Next Step

Next, you will use component boundaries and `React.memo` carefully when state ownership alone is not enough.
