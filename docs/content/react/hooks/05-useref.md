# useRef

## 1. Lesson Goal

Understand `useRef` as a stable container whose `.current` value can change without causing a render.

By the end, you should be able to choose between state and ref for simple UI behavior.

## 2. Why It Matters

Not every value belongs in state. If changing a value should update the UI, use state. If the value is needed for coordination but does not need to render, a ref may be a better fit.

Refs are common for DOM nodes, timer ids, previous values, and small mutable flags.

## 3. Core Concept

`useRef` returns an object with a `.current` property.

```tsx
const renderCountRef = useRef(0)
```

The object stays the same between renders. You can change `.current`, but React will not re-render because of that change.

## 4. Mental Model

State is for values that affect what the user sees.

Ref is for values the component needs to remember, but the UI does not need to update immediately when they change.

If the screen should change, reach for state first. If you need a stable box for coordination, consider a ref.

## 5. Guided Walkthrough

This component stores the latest draft length in a ref while state controls the visible input value:

```tsx
function DraftTracker() {
  const [draft, setDraft] = useState('')
  const lastLengthRef = useRef(0)

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const nextDraft = event.target.value
    lastLengthRef.current = nextDraft.length
    setDraft(nextDraft)
  }

  return (
    <label>
      Draft
      <input value={draft} onChange={handleChange} />
    </label>
  )
}
```

The visible input uses state. The ref remembers a value for logic without becoming another piece of rendered state.

## 6. Common Mistakes

### Mistake 1: Using refs to avoid learning state

If the UI should update when a value changes, use state. Refs do not trigger renders.

### Mistake 2: Reading and writing refs everywhere

Refs are mutable. Keep their usage small and easy to reason about.

### Mistake 3: Treating refs as global storage

A ref belongs to one component instance. It is not shared application state.

## 7. Practice Task

Build a `DraftAutosaveStatus` component.

Requirements:

- keep the input value in state;
- use a ref to store the last saved draft;
- update the ref when the learner clicks Save;
- show whether the current draft matches the last saved draft;
- do not use the ref as the source of the input value.

## 8. Self-Check

- State controls the input.
- The ref stores the last saved value.
- Saving updates the ref.
- The UI still renders from state and derived comparisons.

## 9. Reflection

How do you decide whether a value belongs in state or in a ref?

## 10. Next Step

Next, you will combine state, effects, refs, and clear boundaries into custom hooks.