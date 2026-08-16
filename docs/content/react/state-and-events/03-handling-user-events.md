# Handling User Events

Estimated reading time: 10-12 minutes

## 1. Lesson Goal

By the end of this lesson, you should understand how React event handlers connect user actions to component behavior.

You should be able to write clear event handlers for clicks, form actions, and simple input changes without calling them at the wrong time.

## 2. Why It Matters

Users do not interact with your components by reading your state variables. They click, type, submit, focus, blur, and choose options.

Events are the bridge between the user and your component logic. A good event handler makes the user's action explicit and keeps the component easy to reason about.

In real frontend work, messy event handling quickly creates bugs: buttons run too early, forms reload the page, handlers become hard to test, and UI state changes in surprising places.

## 3. Core Concept

In React, you pass a function as an event handler:

```tsx
function SaveButton() {
  function handleSave() {
    console.log('Saved')
  }

  return <button onClick={handleSave}>Save</button>
}
```

Notice that `handleSave` is passed, not called.

This is correct:

```tsx
<button onClick={handleSave}>Save</button>
```

This is usually wrong:

```tsx
<button onClick={handleSave()}>Save</button>
```

The second version calls the function while rendering. React needs a function it can call later, when the event actually happens.

Event handlers can update state:

```tsx
function handleToggle() {
  setIsOpen((currentValue) => !currentValue)
}
```

They can also receive event information:

```tsx
function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault()
}
```

## 4. Mental Model

Think of an event handler as a named response to a user action.

The render describes what is on the screen. The handler describes what should happen when the user interacts with that screen.

Good handlers usually answer one question:

"When this specific user action happens, what state or behavior should change?"

### Senior Notes

- Name handlers by the user action or intent, such as `handleSave`, `handleClose`, or `handleSubmit`.
- Keep handlers small enough to scan.
- Move unrelated logic out of the handler when it becomes hard to read.
- Avoid hiding important state changes inside deeply nested inline functions.

## 5. Guided Walkthrough

Start with a simple click handler:

```tsx
import { useState } from 'react'

export function ExpandablePanel() {
  const [isExpanded, setIsExpanded] = useState(false)

  function handleTogglePanel() {
    setIsExpanded((currentValue) => !currentValue)
  }

  return (
    <section>
      <button onClick={handleTogglePanel}>
        {isExpanded ? 'Hide details' : 'Show details'}
      </button>

      {isExpanded ? <p>Here are the details.</p> : null}
    </section>
  )
}
```

The button does not change the UI directly. It triggers an event handler. The handler updates state. React renders the next UI snapshot.

Now look at a form submit handler:

```tsx
import { useState } from 'react'

export function FeedbackForm() {
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('Idle')

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus(`Submitted: ${message}`)
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="message">Message</label>
      <input
        id="message"
        value={message}
        onChange={(event) => setMessage(event.target.value)}
      />

      <button type="submit">Send</button>
      <p>{status}</p>
    </form>
  )
}
```

`event.preventDefault()` matters because browser forms normally submit by navigating away or refreshing the page. In a React app, you often want to handle the submit inside JavaScript instead.

The `onChange` handler updates state as the user types. The `onSubmit` handler uses the current state when the user submits.

## 6. Common Mistakes

### Mistake 1: Calling the handler during render

```tsx
<button onClick={handleSave()}>Save</button>
```

This runs immediately. Pass the function instead:

```tsx
<button onClick={handleSave}>Save</button>
```

### Mistake 2: Forgetting to prevent form submission

If a form refreshes the page, check whether the submit handler calls `event.preventDefault()`.

```tsx
function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault()
}
```

### Mistake 3: Writing handlers that do too much

A handler that validates data, formats text, updates five state values, logs analytics, and performs navigation is hard to reason about.

Start small. Let each handler express one user intent clearly.

### Mistake 4: Using vague handler names

Names like `doThing`, `click`, or `submit` do not explain intent well.

Prefer names like `handleOpenMenu`, `handleSubmitFeedback`, or `handleResetFilters`.

## 7. Practice Task

Build a `PreferencePanel` component.

Requirements:

1. Store whether the panel is open.
2. Add a button that opens and closes the panel.
3. When the panel is open, show two buttons: `Email updates` and `Product updates`.
4. Store the selected preference in state.
5. Display the selected preference.
6. Use named event handlers for the main actions.

Keep the component focused on event handling and state updates.

## 8. Self-Check

Before marking this lesson complete, check that:

- Your click handlers are passed as functions.
- Your handler names describe user intent.
- You used state updates instead of manually changing the DOM.
- The selected preference changes when a user clicks a button.
- The panel open/closed state works after repeated clicks.
- No handler is doing unrelated work.

## 9. Reflection

In one or two sentences, explain this:

What is the difference between passing an event handler and calling an event handler during render?

Use your own words. This distinction prevents many beginner React bugs.

## 10. Next Step

You now know how user actions reach your component logic.

Next, you will apply events to form inputs. You will learn how controlled inputs keep form values in React state and why that makes forms easier to validate, reset, and submit.
