# JSX fundamentals

## 1. Lesson Goal

Understand JSX as a syntax for describing UI inside component code, including expressions, attributes, and valid return structure.

## 2. Why It Matters

JSX is where React starts to feel different. You are not writing a separate template file. You are describing UI close to the values and decisions that shape it.

If you understand JSX well, component code becomes easier to read and debug.

## 3. Core Concept

JSX looks similar to HTML, but it is JavaScript syntax. A component can return JSX, and JSX can contain JavaScript expressions inside curly braces.

```tsx
const userName = 'Ada'

function Greeting() {
  return <p>Hello, {userName}</p>
}
```

The expression `{userName}` is evaluated and placed into the UI.

## 4. Mental Model

Think of JSX as a UI description with small windows into JavaScript.

Plain text describes fixed UI. Curly braces let values enter the UI. Component tags let you compose bigger screens from smaller pieces.

## 5. Guided Walkthrough

Attributes in JSX often look like HTML, but some names are different.

Use `className`, not `class`:

```tsx
function Badge() {
  return <span className="badge">Beginner</span>
}
```

Return one JSX tree:

```tsx
function Header() {
  return (
    <>
      <h1>Vertex</h1>
      <p>Build real engineering skill.</p>
    </>
  )
}
```

A fragment groups elements without adding an extra DOM element.

## 6. Common Mistakes

### Mistake 1: Using `class` instead of `className`

JSX uses JavaScript-friendly attribute names. Use `className` for CSS classes.

### Mistake 2: Putting statements inside JSX expressions

Curly braces accept expressions, not statements. Use a variable before the return when logic gets larger.

### Mistake 3: Returning sibling elements without a wrapper

Return one tree. Use a semantic element or a fragment.

## 7. Practice Task

Build a `ProfileBadge` component.

Requirements:

1. Create constants for a user name, role, and completed lesson count.
2. Render the values inside JSX using curly braces.
3. Add a CSS class using `className`.
4. Return one valid JSX tree.
5. Keep expressions small and readable.

The goal is to practice JSX syntax, not styling complexity.

## 8. Self-Check

Before moving on, check that:

- You used curly braces for JavaScript values.
- You used `className`.
- Your component returns one JSX tree.
- You avoided complex logic inside JSX.
- You can explain how JSX differs from plain HTML.

## 9. Reflection

In your own words, explain this:

Why does JSX allow JavaScript expressions inside markup-like UI?

Your answer should mention connecting data or values to rendered UI.

## 10. Next Step

Next, you will use JSX inside focused components so UI can be split into reusable pieces.