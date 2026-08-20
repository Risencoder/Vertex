# Handling Form Submission

## 1. Lesson Goal

By the end of this lesson, you should be able to handle a form submission in React without losing the current app state. You will learn how the browser's default form behavior and React's event handling fit together.

## 2. Why It Matters

Submitting a form is usually where user input becomes a real action: signing up, saving settings, searching, filtering, or creating a record.

If you handle submission carelessly, the page may reload, state may disappear, duplicate actions may happen, or the user may not know whether anything worked. Good form submission keeps the workflow calm and explicit.

## 3. Core Concept

HTML forms have default behavior. When a form submits, the browser tries to send the form and load a new document.

In a React app, you usually want to keep control inside the app:

```tsx
function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();
  // Use current React state here.
}
```

`preventDefault()` does not submit the form for you. It only stops the browser from taking over. After that, your handler decides what should happen.

## 4. Mental Model

Think of submit as a checkpoint.

Before submit, the user is editing a draft. At submit, the app reads the current draft, checks whether it can become an action, and moves the UI into a clear state such as submitting, success, or error.

The submit handler should answer three questions:

- What data are we submitting?
- Is the action allowed right now?
- What should the user see next?

## 5. Guided Walkthrough

Here is a small signup example without a real API call:

```tsx
import { useState } from "react";

type Status = "idle" | "submitting" | "success";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      return;
    }

    setStatus("submitting");
    setStatus("success");
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="email">Email</label>
      <input
        id="email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />

      <button type="submit" disabled={status === "submitting"}>
        Join newsletter
      </button>

      {status === "success" ? <p>You're on the list.</p> : null}
    </form>
  );
}
```

In real apps, the submit handler usually calls an API. The local shape is still the same: prevent default behavior, read current state, guard invalid actions, show status, and update the UI after the result.

Use `type="submit"` for the primary form button. That keeps keyboard behavior working because pressing Enter inside a field can submit the form.

## 6. Common Mistakes

- Forgetting `event.preventDefault()` and wondering why the app reloads.
- Putting submit logic on a button click instead of the form's `onSubmit`.
- Allowing repeated submissions while a request is already in progress.
- Clearing the form before knowing whether the action succeeded.

## 7. Practice Task

Build a `NewsletterSignupForm`.

It should collect a name and email, handle the form's `onSubmit`, prevent the browser reload, show a submitting state, and then show a submitted summary from the current form state.

Success criteria:

- submission uses the form `onSubmit`;
- browser default submit behavior is prevented;
- the submit button is disabled while submitting;
- the success message uses the submitted values, not hardcoded text.

## 8. Self-Check

- What would happen if you removed `event.preventDefault()`?
- Is the submit handler connected to the form or only to the button?
- Can the user submit twice during a pending submission?
- Does the success state reflect what the user actually entered?

## 9. Reflection

Explain why form submission should be treated as a state transition rather than just a button click.

## 10. Next Step

Next, you will add validation and error messages so the form can guide the user before and after submission.
