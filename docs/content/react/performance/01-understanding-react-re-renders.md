# Understanding React Re-Renders

## 1. Lesson Goal

By the end of this lesson, you should be able to explain why React re-renders components and separate normal re-rendering from an actual performance problem.

Performance work starts with understanding. If every re-render feels suspicious, you will optimize the wrong thing.

## 2. Why It Matters

React apps re-render all the time. A form field changes, a route loads, a session updates, or a parent passes new data.

Most re-renders are normal and cheap. The problems usually appear when a re-render triggers expensive work, updates a very large section of UI, or happens more often than the user action requires.

## 3. Core Concept

A render is React asking a component: "What should the UI look like for the current props and state?"

```tsx
function Counter({ label }: { label: string }) {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      {label}: {count}
    </button>
  );
}
```

Clicking the button updates state. React calls `Counter` again with the new state. The function running again is not a bug; it is how React produces the next UI description.

The question is not "Did this component render?" The better question is "Did this render do expensive or unnecessary work?"

## 4. Mental Model

Think of render as recalculating a UI snapshot.

Props and state are the inputs. JSX is the output. When an input changes, React recalculates the snapshot.

That recalculation is usually fine. Performance problems appear when the snapshot calculation does too much, when too many components recalculate because state lives too high, or when the browser has too much work after React updates the DOM.

## 5. Guided Walkthrough

Imagine a dashboard with a search box and a list:

```tsx
function Dashboard() {
  const [query, setQuery] = useState("");

  return (
    <>
      <SearchBox value={query} onChange={setQuery} />
      <LessonList query={query} />
    </>
  );
}
```

Typing changes `query`, so `Dashboard` re-renders. Since `LessonList` depends on `query`, it should update too.

Now compare that with this:

```tsx
function Dashboard() {
  const [query, setQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <Sidebar
        open={sidebarOpen}
        onToggle={() => setSidebarOpen((open) => !open)}
      />
      <SearchBox value={query} onChange={setQuery} />
      <ExpensiveLessonList query={query} />
    </>
  );
}
```

If toggling the sidebar makes an expensive list recalculate, you may have a performance opportunity. The first step is not `memo`. The first step is understanding what changed and what work followed.

## 6. Common Mistakes

- Treating every re-render as a bug.
- Adding memoization before identifying expensive work.
- Forgetting that parent renders can cause child renders.
- Measuring only with console logs and assuming every log means user-visible slowness.

## 7. Practice Task

Build a small render investigation component.

Create a `LearningDashboard` with a search query, a sidebar toggle, and a lesson list. Add clear comments or lightweight counters that show which UI parts re-render when each state value changes. Then adjust the state location or component boundaries so unrelated updates are easier to reason about.

Success criteria:

- the component has at least two independent interactions;
- you can explain which state change causes which render;
- you identify one render that is normal and one render that may deserve investigation;
- you do not add memoization yet.

## 8. Self-Check

- Can you explain why a component function runs again?
- Can you identify the state or prop that triggered the render?
- Did you avoid treating logs as proof of a real performance issue?
- Do you know what you would measure next?

## 9. Reflection

Explain the difference between a normal React re-render and a performance problem that deserves optimization.

## 10. Next Step

Next, you will reduce avoidable work by keeping state minimal and owned by the smallest useful part of the UI.
