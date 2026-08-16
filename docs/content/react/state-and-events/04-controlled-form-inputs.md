# Controlled Form Inputs

Estimated reading time: 11-13 minutes

## 1. Lesson Goal

By the end of this lesson, you should understand what a controlled input is and how React state can become the source of truth for form values.

You should be able to build a small form where the displayed input value and component state stay in sync.

## 2. Why It Matters

Forms are where many real applications become interactive. Login screens, search boxes, settings pages, checkout flows, profile editors, and support forms all depend on user input.

If your component does not know what the user typed, it cannot validate, submit, reset, or conditionally enable actions in a predictable way.

Controlled inputs make form data visible to React. That visibility gives you better control over user experience and application behavior.

## 3. Core Concept

A controlled input is an input whose value is controlled by React state.

```tsx
import { useState } from 'react'

export function NameField() {
  const [name, setName] = useState('')

  return (
    <label>
      Name
      <input
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
    </label>
  )
}
```

Two pieces work together:

- `value={name}` tells the input what to display.
- `onChange` updates state when the user types.

If you provide `value` without `onChange`, the input becomes read-only from the user's perspective. React is saying, "The value is this," but no code updates that value when the user types.

## 4. Mental Model

Think of a controlled input as a loop:

1. React renders the input with the current state value.
2. The user types.
3. The input fires an `onChange` event.
4. The handler stores the new value in state.
5. React renders again with the updated value.

The user still feels like they are typing normally. The difference is that React now knows the value at every render.

### Senior Notes

- Controlled inputs are useful when the UI depends on the current value.
- Keep form state names specific, such as `email`, `password`, or `searchQuery`.
- Do not store form values in state you do not need.
- For large forms, clarity matters more than clever abstractions.

## 5. Guided Walkthrough

Start with a search input:

```tsx
import { useState } from 'react'

export function SearchBox() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <section>
      <label htmlFor="search">Search</label>
      <input
        id="search"
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
      />

      <p>Searching for: {searchQuery || 'Nothing yet'}</p>
    </section>
  )
}
```

The paragraph proves that React knows what the user typed. The input and the UI are connected through state.

Now build a more realistic form:

```tsx
import { useState } from 'react'

export function ProfileForm() {
  const [displayName, setDisplayName] = useState('')
  const [role, setRole] = useState('frontend')

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    console.log({ displayName, role })
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="displayName">Display name</label>
      <input
        id="displayName"
        value={displayName}
        onChange={(event) => setDisplayName(event.target.value)}
      />

      <label htmlFor="role">Role</label>
      <select
        id="role"
        value={role}
        onChange={(event) => setRole(event.target.value)}
      >
        <option value="frontend">Frontend</option>
        <option value="backend">Backend</option>
        <option value="fullstack">Full stack</option>
      </select>

      <button type="submit">Save profile</button>
    </form>
  )
}
```

Both fields are controlled. React knows the latest `displayName` and `role`, so the submit handler can use those values directly.

## 6. Common Mistakes

### Mistake 1: Providing value without onChange

```tsx
<input value={email} />
```

This input cannot update because React always renders it with the same value. Add an `onChange` handler when the value should be editable.

### Mistake 2: Reading from the DOM instead of state

Avoid reaching into the DOM for values you already control with state.

```tsx
document.querySelector('input')
```

In React, prefer reading `email`, `displayName`, or whatever state value represents the input.

### Mistake 3: Using one vague state variable for a whole form

```tsx
const [value, setValue] = useState('')
```

This becomes confusing as soon as the form has multiple fields. Use names that match the data.

### Mistake 4: Forgetting to reset form state

If a successful submit should clear the form, reset the state values:

```tsx
setDisplayName('')
setRole('frontend')
```

The inputs will update because they are controlled by state.

## 7. Practice Task

Build a `ContactForm` component.

Requirements:

1. Add controlled inputs for `name`, `email`, and `message`.
2. Show a submit button.
3. Prevent the default form submit behavior.
4. Display a short summary after submit.
5. Disable the submit button if any field is empty.
6. Add a reset button that clears the form.

Keep validation simple. The goal is controlled input flow, not advanced form validation.

## 8. Self-Check

Before marking this lesson complete, check that:

- Every editable field has both `value` and `onChange`.
- Form state names are clear.
- The submit handler uses state values.
- The form does not refresh the page on submit.
- The disabled button reflects the current input values.
- Resetting state updates the visible inputs.

## 9. Reflection

In one or two sentences, explain this:

Why does a controlled input need both a `value` and an `onChange` handler?

Your answer should connect state, rendering, and user typing.

## 10. Next Step

You now know how to keep form inputs in sync with React state.

Next, you will learn about derived UI state: values that can be calculated from existing state instead of stored separately. This will help you avoid unnecessary state and reduce bugs in forms and interactive components.
