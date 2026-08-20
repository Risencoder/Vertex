# Components and props practice

## 1. Lesson Goal

Build a small typed component section that uses extraction, props, composition, and repeated data.

## 2. Why It Matters

This is the point where components stop being isolated examples. You need to turn repeated UI into a reusable component, type its props, pass data from a parent, and keep ownership clear.

That is everyday React work.

## 3. Core Concept

A reusable component has three parts:

1. A clear responsibility.
2. A clear props contract.
3. A parent that supplies data.

```tsx
type TechnologyCardProps = {
  name: string
  description: string
  lessonCount: number
}
```

The card displays. The parent owns the list.

## 4. Mental Model

Think in two layers:

- Data layer: what information exists?
- UI layer: which component displays each piece?

The parent maps data to components. The child renders one item well.

## 5. Guided Walkthrough

Start with the repeated shape:

```tsx
function TechnologyCard({ name, description, lessonCount }: TechnologyCardProps) {
  return (
    <article>
      <h2>{name}</h2>
      <p>{description}</p>
      <span>{lessonCount} lessons</span>
    </article>
  )
}
```

Then render data from the parent:

```tsx
function TechnologySection() {
  return (
    <section>
      {technologies.map((technology) => (
        <TechnologyCard
          key={technology.slug}
          name={technology.name}
          description={technology.description}
          lessonCount={technology.lessonCount}
        />
      ))}
    </section>
  )
}
```

The card does not know where the data came from. That keeps it reusable.

## 6. Common Mistakes

### Mistake 1: Copying card markup instead of extracting

Repeated markup is a signal. Extract the card and pass different props.

### Mistake 2: Letting the card own the whole list

The list belongs to the parent. The card should render one item.

### Mistake 3: Forgetting the empty state

Even a practice component should handle the case where no technologies are available.

## 7. Practice Task

Build a `TechnologySection` with typed reusable cards.

Requirements:

1. Create a `Technology` type.
2. Create a typed `TechnologyCard` component.
3. Create local technology data with at least three items.
4. Render one card for each item with a stable key.
5. Add an empty state branch.
6. Keep list ownership in `TechnologySection`.
7. Pass only the props the card needs.

The goal is to combine the full Components and Props module.

## 8. Self-Check

Before marking this module complete, check that:

- Repeated UI is extracted into a component.
- Props are typed.
- The parent owns the array.
- The card renders one item.
- Keys are stable.
- Empty state is handled.
- You can explain the component boundaries.

## 9. Reflection

In three to five sentences, explain your component design:

- Which component owns the data?
- Which component receives props?
- Where did you use composition?
- Why are the props typed?

This reflection prepares you to discuss component design during code review.

## 10. Next Step

Next, you will move into State and Events, where components become interactive through local state and user actions.