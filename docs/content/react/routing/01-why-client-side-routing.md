# Why Client-Side Routing

## 1. Lesson Goal

Understand why React apps use client-side routing and how it changes the relationship between URL, screen, and application state.

By the end, you should be able to explain why a single-page app can show different screens without asking the server for a full new HTML document every time.

## 2. Why It Matters

Most product interfaces have more than one screen: dashboard, lessons, projects, settings, detail pages, and not-found states.

Without routing, those screens become conditional rendering scattered across one component. That works for a demo, but it does not scale. Routing gives the app a predictable way to connect URLs to screens.

## 3. Core Concept

Client-side routing means the browser URL changes, but React decides which UI to render.

The server still delivers the React app. After that, navigation inside the app can happen without a full page reload. React reads the current path and renders the matching route.

```tsx
const routes = [
  { path: "/", element: <DashboardPage /> },
  { path: "/lessons", element: <LessonsPage /> },
];
```

The URL becomes part of the UI state. A route says: when the path looks like this, render this screen.

## 4. Mental Model

Think of routing as a map from URL to screen.

State answers "what is happening inside this screen?" Routing answers "which screen are we on?"

That separation matters. A selected tab may be local state. A lesson detail page should usually be a route because it needs a shareable URL, browser refresh support, and back button behavior.

## 5. Guided Walkthrough

Imagine a learning app with two screens:

```tsx
function DashboardPage() {
  return <h1>Dashboard</h1>;
}

function LessonsPage() {
  return <h1>Lessons</h1>;
}
```

With routing, you do not need a large `if` statement in `App`. You define paths and let the router choose.

```tsx
createBrowserRouter([
  { path: "/", element: <DashboardPage /> },
  { path: "/lessons", element: <LessonsPage /> },
]);
```

Now `/` and `/lessons` represent different places in the product.

## 6. Common Mistakes

### Mistake 1: Treating routes like buttons

A route is not just a click target. It is an addressable state of the application.

### Mistake 2: Keeping page identity in local state

If the user should be able to refresh, bookmark, or share the screen, it probably belongs in the URL.

### Mistake 3: Thinking client-side routing removes the server

The server still serves the app and data. The router controls screen selection in the browser.

## 7. Practice Task

Build a small route plan for a learning dashboard.

Requirements:

- define routes for dashboard, lessons, projects, and settings;
- write one component placeholder per route;
- include a not-found route;
- keep the route plan separate from local UI state;
- use clear route paths.

## 8. Self-Check

- You can explain why a URL should represent a screen.
- Your route paths are stable and readable.
- You did not model page selection as local component state.
- The not-found route is included.

## 9. Reflection

When should a UI change become part of the URL instead of staying as local state?

## 10. Next Step

Next, you will set up a router and learn how route matching turns paths into rendered pages.
