# Local State with useState

Estimated reading time: 10-12 minutes

## 1. Lesson Goal

By the end of this lesson, you should understand what local state is, why React needs it, and how `useState` connects data changes to UI updates.

You should also be able to decide when a value belongs in state and when it should remain a regular variable.

## 2. Why It Matters

Most useful interfaces change after the user does something. A menu opens, a counter increases, a form field updates, a selected tab changes, or a save button becomes disabled.

React does not update the screen because you changed any random variable. React updates the screen when component state changes. That is why local state is one of the first React ideas that separates static markup from interactive software.

For employable frontend work, this matters because many UI bugs come from storing the wrong thing, updating it in the wrong way, or expecting React to notice changes it cannot see.

## 3. Core Concept

Local state is data owned by one component. The component uses that data while rendering, and React re-renders the component when the data changes.

In React, local state is commonly created with `useState`:

```tsx
import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  )
}
```

`useState(0)` gives the component two things:

- `count`: the current state value for this render.
- `setCount`: the function used to request a new state value.

The first value passed to `useState` is the initial value. React uses it when the component first appears. After that, React remembers the state between renders.

A regular variable does not work the same way:

```tsx
function BrokenCounter() {
  let count = 0

  return (
    <button onClick={() => count + 1}>
      Count: {count}
    </button>
  )
}
```

This does not update the UI. The variable is recreated every render, and React is not told that anything important changed. State is the signal React understands.

## 4. Mental Model

Think of a component render as a snapshot.

When React renders `Counter`, it calls the component function and gets a snapshot of the UI for the current `count`. If `count` is `0`, the button says `Count: 0`.

When you call `setCount(1)`, you are not editing the old snapshot. You are asking React to render a new snapshot with a new state value. React calls the component again, `count` is now `1`, and the returned UI says `Count: 1`.

This is the important shift:

- Components describe what the UI should look like for the current state.
- State changes request a new render.
- React compares the new result with the previous screen and updates what changed.

Do not think of state as a box you mutate directly. Think of it as input to rendering.

## 5. Guided Walkthrough

Start with a minimal example:

```tsx
import { useState } from 'react'

export function LikeButton() {
  const [likes, setLikes] = useState(0)

  return (
    <button onClick={() => setLikes(likes + 1)}>
      Likes: {likes}
    </button>
  )
}
```

What happens here:

1. React renders `LikeButton`.
2. `likes` starts at `0`.
3. The button displays `Likes: 0`.
4. The user clicks the button.
5. `setLikes(likes + 1)` requests the next value.
6. React re-renders the component.
7. The button displays the updated value.

Now look at a more realistic example:

```tsx
import { useState } from 'react'

type Plan = 'starter' | 'pro' | 'team'

export function PlanSelector() {
  const [selectedPlan, setSelectedPlan] = useState<Plan>('starter')

  return (
    <section>
      <h2>Choose a plan</h2>

      <div>
        <button onClick={() => setSelectedPlan('starter')}>
          Starter
        </button>
        <button onClick={() => setSelectedPlan('pro')}>
          Pro
        </button>
        <button onClick={() => setSelectedPlan('team')}>
          Team
        </button>
      </div>

      <p>Selected plan: {selectedPlan}</p>
    </section>
  )
}
```

This is still local state. The selected plan only matters inside this component. There is no need for global state, a server request, or a complex abstraction.

The state value controls what the user sees. The event handlers describe how user actions change that value.

Senior Notes:

- Keep state as close as possible to where it is used.
- Do not introduce global state just because a value changes.
- Name state by what it represents, not by the UI control that changes it.
- If a value can be calculated from existing state during render, do not store it as separate state.

## 6. Common Mistakes

### Mistake 1: Mutating state directly

```tsx
count = count + 1
```

This does not tell React to render again. Always use the setter function returned by `useState`.

### Mistake 2: Storing values that do not affect the UI

If changing a value should not update what the user sees, it may not need to be state. State is for data that affects rendering.

### Mistake 3: Creating too much state

Beginners often create state for every small value. This makes components harder to reason about. Start with the minimum state needed to describe the UI.

### Mistake 4: Expecting state to change immediately in the same render

Calling a setter requests another render. The current render still has the current snapshot. This lesson focuses on the basic model; the next lesson will cover safe updates in more detail.

### Mistake 5: Using unclear names

`value`, `data`, and `item` are often too vague. Names like `selectedPlan`, `isMenuOpen`, or `likes` make the component easier to read.

## 7. Practice Task

Build a small `NotificationToggle` component.

Requirements:

1. Store whether notifications are enabled.
2. Show the current status as text.
3. Add a button that toggles the status.
4. Change the button label based on the current state.
5. Keep all state local to the component.

Your component should make it obvious how state affects the UI and how the button changes that state.

## 8. Self-Check

Before marking this lesson complete, check that:

- You can explain why a regular variable does not update the UI.
- You used `useState` for data that affects rendering.
- You used the setter function instead of mutating state directly.
- Your state name describes the meaning of the data.
- Your component still works after multiple clicks.
- You did not introduce global state or unrelated abstractions.

## 9. Reflection

In one or two sentences, explain this:

Why does React need state to update the UI instead of just letting you change a local variable?

If you can answer that clearly, you are learning the React mental model instead of memorizing syntax.

## 10. Next Step

You now know how to create local state and use it to drive the UI.

Next, you will learn how to update state safely when the next value depends on the previous value. That is where counters, toggles, repeated clicks, and real user interactions start to reveal the difference between code that works once and code that stays reliable.
