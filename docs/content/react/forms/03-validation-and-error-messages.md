# Validation and Error Messages

## 1. Lesson Goal

By the end of this lesson, you should be able to add basic validation and field-level error messages to a React form. The goal is not to build a validation library; it is to make user feedback predictable and useful.

## 2. Why It Matters

Forms are conversations with users. A good form explains what it needs, points to the field that needs attention, and lets the user recover.

Poor validation often feels like the app is blaming the user. Good validation reduces confusion and makes the next action obvious.

## 3. Core Concept

Validation is a function from form state to feedback.

```tsx
type LoginErrors = {
  email?: string;
  password?: string;
};

function validateLogin(email: string, password: string): LoginErrors {
  const errors: LoginErrors = {};

  if (!email.includes("@")) {
    errors.email = "Enter a valid email address.";
  }

  if (password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  }

  return errors;
}
```

The form decides when to run validation. The result decides what messages to show.

## 4. Mental Model

Think of errors as UI state, not as alerts.

An error should live near the field it describes. It should be based on the current draft and the user's intent. A field can be invalid before the user touches it, but showing every error immediately can feel noisy.

Two useful moments for validation are:

- after the user tries to submit;
- after a field has been touched.

## 5. Guided Walkthrough

A simple password reset form might validate only one field:

```tsx
import { useState } from "react";

export function PasswordResetForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedEmail = email.trim();

    if (!trimmedEmail.includes("@")) {
      setError("Enter a valid email address.");
      return;
    }

    setError(null);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="reset-email">Email</label>
      <input
        id="reset-email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        aria-describedby={error ? "reset-email-error" : undefined}
        aria-invalid={error ? true : undefined}
      />

      {error ? <p id="reset-email-error">{error}</p> : null}

      <button type="submit">Send reset link</button>
    </form>
  );
}
```

The message belongs to the field. The input points to the message. The submit handler stops when validation fails.

That pattern scales better than showing a generic alert because the user can see exactly what needs attention.

## 6. Common Mistakes

- Treating validation as only disabling a button.
- Showing errors without saying which field caused them.
- Storing error text that no longer matches the current input.
- Using vague messages like "Invalid input" when the user needs a specific next action.

## 7. Practice Task

Build a `PasswordResetForm`.

It should include one email field, validate on submit, show a field-level error message, connect the input to the message with accessible attributes, and show a success message when the email is valid.

Success criteria:

- invalid email shows a clear field-level message;
- valid email clears the error and shows success;
- the input uses `aria-invalid` and `aria-describedby` when an error is visible;
- the form does not submit successfully while invalid.

## 8. Self-Check

- Does the user know exactly which field needs attention?
- Does the error disappear when the next successful submission happens?
- Is validation based on current form state?
- Could a screen reader connect the field to its error message?

## 9. Reflection

Describe the difference between blocking a form submission and helping a user correct the form.

## 10. Next Step

Next, you will manage multiple related fields together so larger forms stay easier to update and reason about.
