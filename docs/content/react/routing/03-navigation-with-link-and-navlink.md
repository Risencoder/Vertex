# Navigation with Link and NavLink

## 1. Lesson Goal

Learn how to navigate between routes without forcing a full page reload.

By the end, you should understand when to use `Link` and when `NavLink` gives the user better feedback.

## 2. Why It Matters

Navigation is part of the product experience. If links reload the whole page unnecessarily, the app feels slower and loses client state.

React Router navigation keeps the app running while the URL and rendered route change.

## 3. Core Concept

Use `Link` for normal route navigation.

```tsx
<Link to="/learning-paths">Learning Paths</Link>
```

Use `NavLink` when the UI should know whether the link points to the current route.

```tsx
<NavLink to="/learning-paths">
  {({ isActive }) => (isActive ? "Viewing paths" : "Learning Paths")}
</NavLink>
```

Both update the browser URL through the router instead of doing a full document navigation.

## 4. Mental Model

Think of `Link` as an app-aware anchor.

It still represents navigation, but the router handles it inside the React app. `NavLink` adds route awareness, which is useful for sidebars, tabs, and navigation menus.

## 5. Guided Walkthrough

A simple navigation area can use `Link`:

```tsx
function AppNav() {
  return (
    <nav aria-label="Main navigation">
      <Link to="/">Dashboard</Link>
      <Link to="/learning-paths">Learning Paths</Link>
    </nav>
  );
}
```

For active styling, use `NavLink`:

```tsx
function AppNav() {
  return (
    <nav aria-label="Main navigation">
      <NavLink to="/">Dashboard</NavLink>
      <NavLink to="/learning-paths">Learning Paths</NavLink>
    </nav>
  );
}
```

The route becomes visible in the navigation state.

## 6. Common Mistakes

### Mistake 1: Using plain anchors for internal app routes

Plain anchors can reload the document. Use router navigation for internal routes.

### Mistake 2: Using `NavLink` everywhere

Only use active route styling where it helps the user understand location.

### Mistake 3: Making disabled navigation behave like a link

If something is not available yet, do not render it as an active route target.

## 7. Practice Task

Build an `AppNavigation` component.

Requirements:

- include links for dashboard, learning paths, and settings;
- use `NavLink` for items that need active styling;
- use readable text labels;
- keep disabled or future items non-interactive;
- use semantic navigation markup.

## 8. Self-Check

- Internal navigation uses router links.
- Active route styling is applied only where useful.
- The navigation has an accessible label.
- Disabled items cannot be clicked as real links.

## 9. Reflection

Why is route-aware navigation better than storing the active menu item in local state?

## 10. Next Step

Next, you will use dynamic URL segments to build detail pages.
