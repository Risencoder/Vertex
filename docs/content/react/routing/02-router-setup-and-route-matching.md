# Router Setup and Route Matching

## 1. Lesson Goal

Learn how to set up browser routing and reason about how route definitions match URL paths.

By the end, you should be able to create a small route tree with a home page, a page route, and a not-found route.

## 2. Why It Matters

Routing bugs often start at setup. A path is missing, the fallback catches too much, or a detail page cannot be refreshed.

A clear setup gives every screen a predictable address and makes future features easier to add.

## 3. Core Concept

A router watches the current browser location and renders the route whose path matches.

```tsx
createBrowserRouter([
  { path: "/", element: <DashboardPage /> },
  { path: "/learning-paths", element: <LearningPathsPage /> },
  { path: "*", element: <NotFoundPage /> },
]);
```

The `*` route is the fallback. It handles paths the app does not recognize.

## 4. Mental Model

Think of route matching as a decision table.

The router checks the current path, finds the route definition that describes it, and renders that route's element. If no specific route matches, the fallback route handles the request.

The route config should be easy to scan. If a teammate cannot tell which component owns a path, the route setup is doing too much.

## 5. Guided Walkthrough

Start with page components:

```tsx
function DashboardPage() {
  return <h1>Dashboard</h1>;
}

function LearningPathsPage() {
  return <h1>Learning Paths</h1>;
}

function NotFoundPage() {
  return <h1>Page not found</h1>;
}
```

Then create the route config:

```tsx
const router = createBrowserRouter([
  { path: "/", element: <DashboardPage /> },
  { path: "/learning-paths", element: <LearningPathsPage /> },
  { path: "*", element: <NotFoundPage /> },
]);
```

Finally, render the router provider at the app boundary.

## 6. Common Mistakes

### Mistake 1: Forgetting the fallback route

Every production app needs a clear not-found experience.

### Mistake 2: Hiding route setup across many files too early

Small apps benefit from a route config that is easy to read in one place.

### Mistake 3: Expecting route order to solve unclear paths

Use clear paths first. Do not rely on route ordering to compensate for confusing route design.

## 7. Practice Task

Create a route setup for a small learning app.

Requirements:

- create page components for dashboard, learning paths, and settings;
- create a router with `/`, `/learning-paths`, `/settings`, and `*`;
- render the router provider;
- keep route names and component names easy to understand.

## 8. Self-Check

- The home route renders at `/`.
- The learning paths route renders at `/learning-paths`.
- The settings route renders at `/settings`.
- Unknown URLs render the not-found page.

## 9. Reflection

How does a route config help keep screen selection easier to reason about than manual conditional rendering?

## 10. Next Step

Next, you will connect routes with navigation using `Link` and `NavLink`.
