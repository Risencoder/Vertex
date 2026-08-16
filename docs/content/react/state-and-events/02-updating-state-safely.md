# Updating State Safely

Estimated reading time: 10-12 minutes

## 1. Lesson Goal

By the end of this lesson, you should understand why some state updates should be written as functions, especially when the next value depends on the previous value.

You should be able to choose between passing a direct value to a setter and passing an updater function.

## 2. Why It Matters

Many interactive components update the same piece of state more than once. Counters, toggles, quantity selectors, retry buttons, multi-step forms, and notification settings all depend on the current value.

Code that looks correct in a simple click handler can become unreliable when updates happen quickly, when multiple updates run together, or when another developer adds more logic later.

Safe state updates help you write components that stay correct as the UI becomes more interactive.

## 3. Core Concept

When the next state value does not depend on the previous value, passing a direct value is fine:

```tsx
setIsOpen(true)
setSelectedTab('billing')
setEmail('')
```

But when the next value is based on the current value, use an updater function:

```tsx
setCount((currentCount) => currentCount + 1)
setIsEnabled((currentValue) => !currentValue)
```

The updater function receives the latest state value that React has available for that update. This makes the update safer than relying on a value captured by the current render.

Compare these two versions:

```tsx
setCount(count + 1)
```

```tsx
setCount((currentCount) => currentCount + 1)
```

The first version uses `count` from the current render. The second version asks React to calculate the next value from the latest state.

## 4. Mental Model

Think of state updates as requests React will process.

The value you read during render belongs to that render snapshot. If `count` is `0`, then every line in that render sees `count` as `0`.

An updater function says: "When React applies this update, take the current stored value and calculate the next one from it."

This matters because your component code is not editing state directly. It is scheduling a new value for React to use in a future render.

### Senior Notes

- Use direct values when replacing state with a known value.
- Use updater functions when calculating from previous state.
- Prefer update code that remains correct if another update is added later.
- If an update feels hard to reason about, make the state shape simpler before adding more logic.

## 5. Guided Walkthrough

Start with a counter:

```tsx
import { useState } from 'react'

export function StepCounter() {
  const [count, setCount] = useState(0)

  function increase() {
    setCount((currentCount) => currentCount + 1)
  }

  function decrease() {
    setCount((currentCount) => currentCount - 1)
  }

  return (
    <section>
      <p>Current count: {count}</p>
      <button onClick={decrease}>Decrease</button>
      <button onClick={increase}>Increase</button>
    </section>
  )
}
```

The important part is not the counter itself. The important part is how the next value is calculated.

`increase` does not say "use the `count` from this render." It says "take the latest count and add one."

Now look at a realistic quantity selector:

```tsx
import { useState } from 'react'

export function QuantitySelector() {
  const [quantity, setQuantity] = useState(1)

  function addItem() {
    setQuantity((currentQuantity) => currentQuantity + 1)
  }

  function removeItem() {
    setQuantity((currentQuantity) => Math.max(1, currentQuantity - 1))
  }

  return (
    <section>
      <h2>Order quantity</h2>
      <p>Quantity: {quantity}</p>

      <button onClick={removeItem}>Remove one</button>
      <button onClick={addItem}>Add one</button>
    </section>
  )
}
```

This component also includes a rule: quantity cannot go below `1`.

That rule belongs inside the update. The update receives the latest value, calculates the next value, and protects the component from invalid state.

## 6. Common Mistakes

### Mistake 1: Using the current render value for repeated updates

```tsx
setCount(count + 1)
setCount(count + 1)
```

This does not mean "add two" in the way beginners often expect. Both lines may read the same `count` value from the current render.

Use updater functions when repeated updates depend on the previous value:

```tsx
setCount((currentCount) => currentCount + 1)
setCount((currentCount) => currentCount + 1)
```

### Mistake 2: Mutating arrays or objects in state

Avoid changing existing arrays or objects directly:

```tsx
items.push(newItem)
setItems(items)
```

React works best when you create a new value:

```tsx
setItems((currentItems) => [...currentItems, newItem])
```

This keeps the update predictable and avoids hidden mutation bugs.

### Mistake 3: Putting validation outside the update

If the next value depends on the previous value and a rule, keep the rule in the updater:

```tsx
setQuantity((currentQuantity) => Math.max(1, currentQuantity - 1))
```

The rule is easier to review when it lives next to the state change.

### Mistake 4: Using updater functions everywhere without thinking

Updater functions are not required for every state change. This is fine:

```tsx
setSelectedPlan('pro')
```

Use the simpler form when replacing state with a known value.

## 7. Practice Task

Build a `SeatReservation` component.

Requirements:

1. Start with `reservedSeats` set to `0`.
2. Add a button to reserve one seat.
3. Add a button to release one seat.
4. Do not allow the value to go below `0`.
5. Use updater functions for both actions.
6. Show the current number of reserved seats.

Keep the component small. The goal is to practice safe updates, not build a full booking system.

## 8. Self-Check

Before marking this lesson complete, check that:

- You can explain when to use an updater function.
- Your state updates do not mutate existing state.
- Your release action cannot create a negative value.
- Your button handlers are easy to read.
- You used direct setter values only where the next value is already known.
- You can explain why the updater function receives a parameter.

## 9. Reflection

In one or two sentences, explain this:

Why is `setCount((currentCount) => currentCount + 1)` safer than `setCount(count + 1)` when the next value depends on the previous value?

Your answer should mention render snapshots or the latest available state.

## 10. Next Step

You now know how to update state safely.

Next, you will focus on the other side of interaction: events. You will learn how React receives user actions and how event handlers connect those actions to state updates.
