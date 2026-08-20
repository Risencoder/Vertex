# Routing Practice

## 1. Lesson Goal

Combine route setup, navigation, dynamic params, and nested layout thinking in one small routing flow.

By the end, you should be able to design a focused route structure for a learning product feature.

## 2. Why It Matters

Routing skills become useful when they work together. A production route is rarely just a path string. It usually needs navigation, layout, params, loading states, and clear ownership.

This practice turns the routing pieces into one small app shape.

## 3. Core Concept

A good route structure is intentional.

It answers:

- which screens exist;
- which screens share layout;
- which routes need params;
- how users move between routes;
- what happens when a path is invalid.

## 4. Mental Model

Think of routing as product geography.

The dashboard is a place. A module detail page is a place. A lesson detail page is a place. Navigation is how the learner moves between them.

Your job is to make that geography stable, predictable, and easy to extend.

## 5. Guided Walkthrough

Start from the screens:

```tsx
Dashboard
Learning
Learning Module
Lesson Detail
Not Found
```

Then sketch the paths:

```tsx
/
/learning
/learning/modules/:moduleSlug
/learning/modules/:moduleSlug/lessons/:lessonSlug
*
```

Finally, decide where layout belongs. If all learning routes share a header or side navigation, place that in a `LearningLayout`.

## 6. Common Mistakes

### Mistake 1: Designing routes from components only

Routes should represent product places, not just component filenames.

### Mistake 2: Forgetting invalid states

Every dynamic route needs a plan for missing or unknown params.

### Mistake 3: Building too much abstraction too early

A clear route array and a small layout are enough for many features.

## 7. Practice Task

Build a small learning routes prototype.

Requirements:

- define routes for dashboard, learning index, module detail, lesson detail, and not found;
- add navigation for dashboard and learning;
- use params for module and lesson slugs;
- create a shared learning layout with `Outlet`;
- keep placeholder pages small but realistic.

## 8. Self-Check

- The route structure is readable.
- Dynamic routes use stable slug params.
- Shared learning UI lives in a layout route.
- Navigation uses router links.
- Not-found behavior exists.

## 9. Reflection

Which route in your prototype would be hardest to change later, and how could you make it easier to evolve?

## 10. Next Step

Next, routing will become part of larger product flows: forms, protected pages, data loading, and project work.
