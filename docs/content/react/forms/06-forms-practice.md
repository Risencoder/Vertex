# Forms Practice

## 1. Lesson Goal

By the end of this lesson, you should be able to build a small form workflow that combines controlled fields, validation, submission state, and reusable structure. This is the integration point for the Forms module.

## 2. Why It Matters

Employable React work rarely asks for isolated input examples. You are more likely to build a settings screen, invite form, support request, project submission, or admin editor.

Those forms need several concepts to work together. This lesson asks you to combine them in one focused feature.

## 3. Core Concept

A production-oriented form workflow has a clear loop:

1. The user edits a draft.
2. The UI derives status from the draft.
3. The user submits.
4. The app validates.
5. The app shows errors or success.
6. The workflow remains understandable after the result.

The code does not need to be clever. It needs to make the workflow visible.

## 4. Mental Model

Treat the form as a small state machine.

It can be idle, invalid, submitting, successful, or ready for another edit. The fields hold the draft. Validation explains what is missing. Submission turns the draft into an action.

When you can name those states, the UI becomes easier to build.

## 5. Guided Walkthrough

For a project submission form, the draft might look like this:

```tsx
type ProjectSubmission = {
  title: string;
  repositoryUrl: string;
  notes: string;
};
```

The rules might be simple:

- title is required;
- repository URL must start with `https://`;
- notes should explain what changed.

The submit handler should not hide those decisions:

```tsx
function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();

  const nextErrors = validateSubmission(form);

  if (Object.keys(nextErrors).length > 0) {
    setErrors(nextErrors);
    return;
  }

  setErrors({});
  setStatus("success");
}
```

This is enough for a realistic local workflow. A future API call would fit in the same place.

## 6. Common Mistakes

- Adding an API call before the local form behavior is clear.
- Validating only one field and letting other invalid data through.
- Showing success while errors are still visible.
- Extracting reusable components so aggressively that the submit flow becomes hard to follow.

## 7. Practice Task

Build a `ProjectSubmissionForm`.

It should collect a project title, repository URL, and short notes. It should validate the fields on submit, show field-level errors, show a success summary when valid, and use a small reusable field wrapper for repeated label/error structure.

Success criteria:

- all fields are controlled;
- validation runs before success;
- errors are shown near the relevant fields;
- success summary uses the submitted values;
- reusable structure improves readability without hiding the form workflow.

## 8. Self-Check

- Can you trace the form from draft to validation to success?
- Does each error tell the user how to recover?
- Does the reusable field wrapper have a narrow responsibility?
- Would adding a real API call require changing the whole component?

## 9. Reflection

Explain which part of the form workflow was hardest to keep clear and what you did to make it easier to reason about.

## 10. Next Step

You now have the foundation for real React form workflows. Later modules can build on this with async requests, server errors, and more advanced reusable patterns.
