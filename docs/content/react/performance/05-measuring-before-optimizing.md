# Measuring Before Optimizing

## 1. Lesson Goal

By the end of this lesson, you should be able to describe a small measurement workflow before changing React code for performance.

The goal is to make optimization evidence-based.

## 2. Why It Matters

Performance work can easily become superstition. A developer sees renders, adds memoization, and assumes the app is better.

Real users care about whether the interface responds quickly, whether typing feels smooth, whether navigation stalls, and whether large updates block interaction. Measurement keeps your work connected to those outcomes.

## 3. Core Concept

Before optimizing, identify:

- the user action that feels slow;
- the expected behavior;
- the actual behavior;
- the likely expensive work;
- the measurement that proves improvement.

You can start simple with browser tools, React DevTools profiling, timestamps around expensive calculations, or controlled reproduction steps.

## 4. Mental Model

Think like an investigator, not a decorator.

Optimization is not adding performance-looking code. It is forming a hypothesis, changing one thing, and checking whether the measured result improved.

If you cannot describe the slow interaction, you probably are not ready to optimize it.

## 5. Guided Walkthrough

Suppose typing in a lesson search box feels slow.

A useful investigation could be:

1. Reproduce the slow typing with a large lesson list.
2. Confirm whether filtering or rendering is expensive.
3. Measure before changing code.
4. Move state or add memoization in one focused place.
5. Measure the same interaction again.

The code change might be simple:

```tsx
const visibleLessons = useMemo(() => {
  return expensiveFilter(lessons, query);
}, [lessons, query]);
```

But the important work happened before that line: you found a real slow interaction and confirmed what caused it.

## 6. Common Mistakes

- Optimizing because a component rendered, not because users feel slowness.
- Making several changes at once and not knowing which one helped.
- Measuring a different scenario before and after.
- Ignoring simpler fixes like moving state or reducing rendered items.

## 7. Practice Task

Create a `PerformanceInvestigation` note inside a small React component.

Choose one interaction, write a short hypothesis, add a lightweight measurement point around an expensive calculation or render path, make one focused improvement, and record what you would compare before and after.

Success criteria:

- the slow interaction is named clearly;
- the hypothesis explains what work may be expensive;
- the improvement changes one thing;
- the before/after measurement target is the same.

## 8. Self-Check

- What user action are you measuring?
- What evidence shows it is slow?
- What single change are you testing?
- How would you know whether the change helped?

## 9. Reflection

Explain why measuring before optimizing usually leads to better React code than adding memoization based on intuition.

## 10. Next Step

Next, you will combine render reasoning, state ownership, component boundaries, memo hooks, and measurement in one practice workflow.
