# Multiple Fields and Form State

## 1. Lesson Goal

By the end of this lesson, you should be able to manage several related form fields without making updates brittle. You will use one form draft object when fields belong to the same workflow.

## 2. Why It Matters

Real forms usually have more than one field. Profile settings, project submissions, checkout forms, and search filters all need multiple values to move together.

If each update accidentally overwrites another field, the form becomes frustrating. If related state is scattered everywhere, the submit handler becomes harder to trust.

## 3. Core Concept

When fields describe one draft, store them together:

```tsx
type ProfileForm = {
  displayName: string;
  location: string;
  learningGoal: string;
};

const [form, setForm] = useState<ProfileForm>({
  displayName: "",
  location: "",
  learningGoal: "",
});
```

Then update one field while preserving the rest:

```tsx
function updateField(field: keyof ProfileForm, value: string) {
  setForm((current) => ({
    ...current,
    [field]: value,
  }));
}
```

This keeps one coherent draft while still making each input controlled.

## 4. Mental Model

Think of the form object as a draft document.

Changing one field should edit one line in the document, not replace the whole document with a partial version. The spread operator copies the previous draft, and the computed property updates the field that changed.

The submit handler can then read one complete object.

## 5. Guided Walkthrough

Here is the shape of a profile settings form:

```tsx
type ProfileForm = {
  displayName: string;
  location: string;
  learningGoal: string;
};

function ProfileSettingsForm() {
  const [form, setForm] = useState<ProfileForm>({
    displayName: "",
    location: "",
    learningGoal: "",
  });

  function updateField(field: keyof ProfileForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  return (
    <form>
      <input
        value={form.displayName}
        onChange={(event) => updateField("displayName", event.target.value)}
      />
    </form>
  );
}
```

This pattern is useful when the fields are submitted together. It also makes derived UI easier:

```tsx
const completedFields = Object.values(form).filter((value) =>
  value.trim(),
).length;
```

For very large forms, you may split sections or use a more specialized approach later. For small to medium forms, a typed draft object is often enough.

## 6. Common Mistakes

- Replacing the entire form object with only one field.
- Using an untyped string key and accidentally updating a field that does not exist.
- Grouping unrelated UI state into the form draft.
- Creating derived state for values that can be calculated from the draft.

## 7. Practice Task

Build a `ProfileSettingsForm`.

It should manage display name, location, and learning goal in one form object. Each input should update only its own field. The form should show how many fields are complete and display a summary preview.

Success criteria:

- related fields are stored in one typed form object;
- each change preserves the other fields;
- completed field count is derived from the form object;
- the summary preview updates as the user types.

## 8. Self-Check

- Can you explain why one field update does not erase the others?
- Are unrelated values kept outside the form object?
- Is the completed count derived instead of manually synchronized?
- Would the submit handler receive one complete draft?

## 9. Reflection

Explain when you would group form fields into one object and when separate state values might still be simpler.

## 10. Next Step

Next, you will extract small reusable form patterns without turning every form into a generic framework.
