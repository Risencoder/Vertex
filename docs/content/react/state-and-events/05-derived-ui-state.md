# Derived UI State

Estimated reading time: 10-12 minutes

## 1. Lesson Goal

By the end of this lesson, you should understand how to identify values that can be calculated during render instead of stored as separate state.

You should be able to reduce unnecessary state and keep your components easier to reason about.

## 2. Why It Matters

Many UI bugs come from storing the same idea in two places.

For example, a form might store `password`, `confirmPassword`, and `passwordsMatch`. But `passwordsMatch` can be calculated from the first two values. If you store all three, they can get out of sync.

Professional React code avoids state that can be derived from existing state or props. This keeps components smaller, more predictable, and easier to debug.

## 3. Core Concept

Derived UI state is a value calculated from other values during render.

```tsx
const isFormValid = email.length > 0 && password.length >= 8
```

This value affects the UI, but it does not need its own `useState`.

Compare this unnecessary state:

```tsx
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')
const [isFormValid, setIsFormValid] = useState(false)
```

With this simpler version:

```tsx
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')

const isFormValid = email.length > 0 && password.length >= 8
```

`isFormValid` is always based on the latest render values. There is no extra update to forget.

## 4. Mental Model

Ask this question before creating state:

"Can I calculate this from values I already have?"

If the answer is yes, calculate it during render.

State should usually store the minimal facts the component needs. Derived values are conclusions based on those facts.

### Senior Notes

- Store source values, not every possible conclusion.
- Derived values are often easier to test by reading the render logic.
- Avoid duplicating data just because the UI displays it in more than one place.
- If derived logic becomes long, extract a well-named variable or function before adding more state.

## 5. Guided Walkthrough

Start with a simple password form:

```tsx
import { useState } from 'react'

export function PasswordForm() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const passwordsMatch = password === confirmPassword
  const canSubmit = password.length >= 8 && passwordsMatch

  return (
    <form>
      <label htmlFor="password">Password</label>
      <input
        id="password"
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />

      <label htmlFor="confirmPassword">Confirm password</label>
      <input
        id="confirmPassword"
        type="password"
        value={confirmPassword}
        onChange={(event) => setConfirmPassword(event.target.value)}
      />

      {!passwordsMatch ? <p>Passwords do not match.</p> : null}
      <button disabled={!canSubmit}>Create account</button>
    </form>
  )
}
```

`passwordsMatch` and `canSubmit` are not stored. They are calculated every render from the current input state.

Now look at a filter example:

```tsx
import { useState } from 'react'

const lessons = [
  { id: 1, title: 'Local State', difficulty: 'beginner' },
  { id: 2, title: 'Derived State', difficulty: 'beginner' },
  { id: 3, title: 'Performance Patterns', difficulty: 'advanced' },
]

export function LessonFilter() {
  const [difficulty, setDifficulty] = useState('beginner')

  const visibleLessons = lessons.filter(
    (lesson) => lesson.difficulty === difficulty,
  )

  return (
    <section>
      <button onClick={() => setDifficulty('beginner')}>Beginner</button>
      <button onClick={() => setDifficulty('advanced')}>Advanced</button>

      <ul>
        {visibleLessons.map((lesson) => (
          <li key={lesson.id}>{lesson.title}</li>
        ))}
      </ul>
    </section>
  )
}
```

Only the selected difficulty is state. The visible lessons are derived from that state.

## 6. Common Mistakes

### Mistake 1: Storing values that can be calculated

```tsx
const [totalPrice, setTotalPrice] = useState(0)
```

If total price is based on items in a cart, calculate it from the items unless there is a strong reason not to.

### Mistake 2: Trying to keep duplicated state in sync

Duplicated state creates extra work:

```tsx
setPassword(newPassword)
setPasswordsMatch(newPassword === confirmPassword)
```

This is easy to get wrong. Calculate `passwordsMatch` during render instead.

### Mistake 3: Treating every UI condition as state

Values like `isEmpty`, `hasError`, `canSubmit`, or `selectedCount` are often derived values.

They may affect the UI, but that does not automatically mean they need `useState`.

### Mistake 4: Hiding derived logic inside JSX

This can become hard to read:

```tsx
<button disabled={email.length === 0 || password.length < 8}>
  Submit
</button>
```

Prefer a named variable when the condition matters:

```tsx
const canSubmit = email.length > 0 && password.length >= 8
```

## 7. Practice Task

Build a `SignupFormPreview` component.

Requirements:

1. Store `email`, `password`, and `confirmPassword` as controlled inputs.
2. Derive `passwordsMatch`.
3. Derive `isPasswordLongEnough`.
4. Derive `canSubmit`.
5. Show helpful status text based on the derived values.
6. Do not store the derived values in state.

The component should make it clear which values are source state and which values are calculated.

## 8. Self-Check

Before marking this lesson complete, check that:

- You only used state for values the user directly changes.
- Derived values are calculated during render.
- `canSubmit` updates correctly as the user types.
- You did not use extra setters for derived values.
- Your variable names explain the UI conditions.
- The component remains readable without comments.

## 9. Reflection

In one or two sentences, explain this:

Why is duplicated state risky when one value can be calculated from another?

Use an example from your practice component.

## 10. Next Step

You now know how to keep state minimal and calculate UI conditions during render.

Next, you will combine local state, safe updates, events, controlled inputs, and derived values in one focused practice lesson.
