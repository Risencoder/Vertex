# Nested Routes and Layouts

## 1. Lesson Goal

Learn how nested routes let related screens share layout while rendering different child content.

By the end, you should be able to explain why dashboards, settings areas, and learning sections often use layout routes.

## 2. Why It Matters

Real apps have repeated structure: sidebar, header, content area, and page-specific content.

Copying that layout into every page creates duplication. Nested routes let the shared structure live once while child routes change inside it.

## 3. Core Concept

A parent route can render a layout. Child routes render inside that layout through an outlet.

```tsx
function AppLayout() {
  return (
    <div>
      <Sidebar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
```

The parent owns the frame. The child owns the screen content.

## 4. Mental Model

Think of nested routes as folders in the UI.

The parent route creates the room. The child route decides what appears inside the room.

This keeps navigation, headers, and shared wrappers close to the routes that need them.

## 5. Guided Walkthrough

Create a parent route:

```tsx
{
  path: '/app',
  element: <AppLayout />,
  children: [
    { index: true, element: <DashboardPage /> },
    { path: 'settings', element: <SettingsPage /> },
  ],
}
```

The `index` route renders at `/app`. The settings child renders at `/app/settings`.

Inside `AppLayout`, `Outlet` marks where the matched child should appear.

```tsx
function AppLayout() {
  return (
    <>
      <AppHeader />
      <Outlet />
    </>
  );
}
```

## 6. Common Mistakes

### Mistake 1: Forgetting the outlet

Without `Outlet`, the child route has nowhere to render.

### Mistake 2: Repeating layout wrappers in every page

If several pages share the same frame, consider a layout route.

### Mistake 3: Nesting before there is a shared structure

Do not create nested routes just for complexity. Use them when they clarify shared UI.

## 7. Practice Task

Build a nested learning layout.

Requirements:

- create a `LearningLayout` component with a heading and `Outlet`;
- define child routes for an index page and a modules page;
- use relative child paths;
- keep shared layout markup in the parent;
- keep page-specific content in child components.

## 8. Self-Check

- The parent route renders the shared layout.
- `Outlet` appears where child content should render.
- Child paths are relative to the parent.
- Shared layout markup is not copied into every child page.

## 9. Reflection

How do nested routes help separate shared product structure from page-specific content?

## 10. Next Step

Next, you will combine route setup, navigation, params, and layouts in a small routing practice.
