# Form State and Controlled Inputs

## 1. Lesson Goal

By the end of this lesson, you should be able to use controlled inputs as the starting point for a reliable form workflow. You already know the mechanics of controlled inputs; now the goal is to treat them as part of a larger interaction, not as isolated `value` and `onChange` pairs.

## 2. Why It Matters

Most real React forms are not just input boxes. They show previews, enable or disable actions, validate user intent, and prepare data for submission.

Controlled inputs make that possible because React holds the current form value. Once the value lives in state, the UI can respond to it consistently instead of guessing what is inside the DOM.

## 3. Core Concept

A controlled input has one source of truth: React state.

```tsx
import { useState } from "react";

export function DisplayNameForm() {
  const [displayName, setDisplayName] = useState("");

  return (
    <form>
      <label htmlFor="display-name">Display name</label>
      <input
        id="display-name"
        value={displayName}
        onChange={(event) => setDisplayName(event.target.value)}
      />

      <p>Preview: {displayName || "No name yet"}</p>
    </form>
  );
}
```

The important part is not the input syntax. The important part is that the rest of the screen can safely read `displayName`.

For a real form, state often drives several UI decisions at once:

- what the input displays;
- what preview text appears;
- whether the form looks incomplete;
- what data will be submitted later.

## 4. Mental Model

Think of a form as a small data editor.

The input is the user's editing surface. React state is the current draft. The rendered UI is a projection of that draft.

When the learner types, the draft changes. When the draft changes, React re-renders everything that depends on it. This is what keeps form screens predictable.

## 5. Guided Walkthrough

Start with the question: "What data does this form edit?"

For a profile basics form, the draft might include a name, a role, and a short bio:

```tsx
type Role = "student" | "mentor" | "builder";

type ProfileDraft = {
  name: string;
  role: Role;
  bio: string;
};
```

Then connect each field to the piece of state it edits:

```tsx
const [profile, setProfile] = useState<ProfileDraft>({
  name: "",
  role: "student",
  bio: "",
});

function updateName(name: string) {
  setProfile((current) => ({ ...current, name }));
}
```

Notice the workflow: read the old draft, update the field that changed, and keep the rest of the draft intact.

Once state exists, you can derive useful UI:

```tsx
const hasPreview =
  profile.name.trim().length > 0 || profile.bio.trim().length > 0;
```

The input values, preview, and button states all come from the same draft. That is the real benefit.

## 6. Common Mistakes

- Treating each controlled input as a separate trick instead of part of one form workflow.
- Reading values from the DOM on submit when the form already has React state.
- Updating object state without preserving the other fields.
- Showing preview or status text from a separate state value when it can be derived from the current draft.

## 7. Practice Task

Build a `ProfileBasicsForm`.

It should include controlled fields for name, role, and bio. It should show a live profile preview from the current form state and show whether the draft has enough information to be useful.

Success criteria:

- name, role, and bio are controlled by React state;
- editing any field updates the preview immediately;
- existing fields are not lost when one field changes;
- the preview is derived from the current draft, not stored separately.

## 8. Self-Check

- Can you point to the single source of truth for each input?
- Does the preview update without reading from the DOM?
- Does updating one field preserve the others?
- Could the same state be submitted later without collecting values again?

## 9. Reflection

In your own words, explain why controlled form state is more useful than only reading input values when the user submits.

## 10. Next Step

Next, you will use the current form draft inside a submit handler and prevent the browser's default full-page form behavior.
