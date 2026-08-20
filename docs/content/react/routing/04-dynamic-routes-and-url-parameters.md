# Dynamic Routes and URL Parameters

## 1. Lesson Goal

Learn how dynamic routes use URL parameters to render detail screens.

By the end, you should be able to explain why `/lessons/react-basics` and `/lessons/state-and-events` can use the same route pattern.

## 2. Why It Matters

Products often have many detail pages: one lesson, one project, one user setting, one learning path.

Creating a separate route for every item would not scale. Dynamic routes let one route describe a pattern.

## 3. Core Concept

A dynamic segment is part of the path that can change.

```tsx
{ path: '/lessons/:lessonSlug', element: <LessonPage /> }
```

When the user visits `/lessons/state-and-events`, the route matches and `lessonSlug` is `state-and-events`.

The parameter identifies which resource the page should load or display.

## 4. Mental Model

Think of a dynamic route as a template.

The route pattern says what shape the URL has. The parameter value says which specific item is being requested.

The component should not guess from button clicks. It should read the URL parameter and render based on that address.

## 5. Guided Walkthrough

Define a route:

```tsx
{ path: '/learning-paths/:pathSlug', element: <LearningPathPage /> }
```

Read the parameter inside the page:

```tsx
function LearningPathPage() {
  const { pathSlug } = useParams();

  return <h1>Learning path: {pathSlug}</h1>;
}
```

In a real app, `pathSlug` usually becomes an API input:

```tsx
getLearningPathBySlug(pathSlug);
```

The URL is now the source of which detail page is open.

## 6. Common Mistakes

### Mistake 1: Treating params as always present

A parameter can be missing or invalid. Handle not-found and loading states.

### Mistake 2: Storing the selected item separately from the URL

If the URL already identifies the item, avoid duplicating that identity in local state.

### Mistake 3: Using unstable labels as params

Use stable slugs or ids in URLs, not display titles that may change.

## 7. Practice Task

Build a dynamic lesson route.

Requirements:

- define a route with `/lessons/:lessonSlug`;
- read `lessonSlug` with route params;
- show a loading placeholder;
- show a not-found state when the slug is missing;
- keep the slug as the stable URL identity.

## 8. Self-Check

- The route pattern uses a named parameter.
- The page reads the parameter from the router.
- The UI handles missing or invalid params.
- The slug is not duplicated into unrelated state.

## 9. Reflection

What makes a URL parameter a better source of truth for a detail page than a clicked button's local state?

## 10. Next Step

Next, you will learn nested routes, which let pages share layout while changing only the inner content.
