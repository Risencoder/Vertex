# Reusable Form Patterns

## 1. Lesson Goal

By the end of this lesson, you should be able to extract small reusable form pieces without hiding the form's behavior. The goal is practical reuse, not building a form framework.

## 2. Why It Matters

Forms repeat structure: labels, inputs, help text, error messages, submit status, and spacing. Repeating that by hand makes screens inconsistent.

But over-abstracting forms too early can make the code harder to debug. Good reusable patterns remove boring markup while leaving important state and validation decisions visible.

## 3. Core Concept

Extract structure that repeats. Keep behavior close to the form that owns it.

For example, a field wrapper can own label and error layout:

```tsx
type FormFieldProps = {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
};

function FormField({ id, label, error, children }: FormFieldProps) {
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      {children}
      {error ? <p id={`${id}-error`}>{error}</p> : null}
    </div>
  );
}
```

The form still owns the values, validation, and submit handler.

## 4. Mental Model

Reusable form code should answer one question: "What repeated decision am I removing?"

If you are removing repeated layout, a component is useful. If you are hiding business rules, validation timing, or submit behavior too early, the abstraction may be too broad.

Small patterns are easier to change than one giant generic form component.

## 5. Guided Walkthrough

A reusable field wrapper can make a form easier to scan:

```tsx
<FormField id="account-email" label="Email" error={errors.email}>
  <input
    id="account-email"
    type="email"
    value={form.email}
    onChange={(event) => updateField("email", event.target.value)}
    aria-describedby={errors.email ? "account-email-error" : undefined}
    aria-invalid={errors.email ? true : undefined}
  />
</FormField>
```

The wrapper does not know how email validation works. It only gives errors a consistent place to appear.

You can also extract small helpers:

```tsx
function hasText(value: string) {
  return value.trim().length > 0;
}
```

These helpers are useful because they make the form clearer without stealing ownership from it.

## 6. Common Mistakes

- Creating a generic form engine before two or three real forms prove the pattern.
- Hiding field state so the parent can no longer reason about submission.
- Making a reusable component that only works for one screen but looks general.
- Extracting code before naming the repeated decision.

## 7. Practice Task

Build an `AccountForm` with a small reusable `FormField` component.

The form should collect email and display name, show field-level errors, and keep validation and submit behavior inside `AccountForm`.

Success criteria:

- `FormField` handles label, spacing, and error placement;
- `AccountForm` owns form state, validation, and submit behavior;
- errors remain connected to the correct inputs;
- the abstraction makes the form easier to read, not harder.

## 8. Self-Check

- What responsibility does the reusable component own?
- What responsibility stays inside the form?
- Could you reuse the field wrapper in another form?
- Did the abstraction remove repetition without hiding the workflow?

## 9. Reflection

Describe one form pattern that is worth extracting and one form behavior that should stay local until there is a stronger reason.

## 10. Next Step

Next, you will combine form state, submission, validation, and reusable structure in a single practice workflow.
