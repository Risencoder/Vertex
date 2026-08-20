# Performance Practice

## 1. Lesson Goal

By the end of this lesson, you should be able to improve a small React screen by reasoning about renders before choosing an optimization tool.

This is the integration lesson for the Performance module.

## 2. Why It Matters

Performance work is most valuable when it preserves product behavior while making the screen easier or faster to use.

The best engineers do not automatically add optimization hooks. They understand the interaction, simplify ownership, protect useful boundaries, and measure the result.

## 3. Core Concept

A practical React performance workflow looks like this:

1. Identify the user interaction.
2. Understand which state changes.
3. Find the expensive work.
4. Simplify state ownership if possible.
5. Add boundaries or memoization only where needed.
6. Measure the same interaction again.

This order matters because earlier steps often remove the need for later tools.

## 4. Mental Model

Treat performance as a debugging process.

You are debugging unnecessary work, not decorating the code with optimization APIs. The result should be a screen whose data flow is clearer and whose expensive work is better contained.

## 5. Guided Walkthrough

Imagine a lesson library screen with a filter input, a selected lesson preview, and a large list.

The tempting move is to memoize everything. The better move is to ask:

- Does the filter state need to live above the preview?
- Is the list expensive because filtering is costly or because each item renders too much?
- Are child props stable enough for memoization to help?
- What interaction will prove the change worked?

A focused improvement might move a preview toggle into the preview component, memoize a large list boundary, or memoize one expensive filter. Not all three are automatically needed.

## 6. Common Mistakes

- Starting with `useMemo` instead of understanding the render path.
- Memoizing a child whose props change on every render.
- Moving state so far down that the feature no longer works.
- Finishing without checking whether the user-visible interaction improved.

## 7. Practice Task

Build a `LessonLibraryPerformanceReview`.

It should include a query input, a selected lesson preview, a large lesson list, and a small investigation note. Improve one performance issue by choosing from state ownership, component boundaries, `React.memo`, `useMemo`, or `useCallback`.

Success criteria:

- the selected issue is described before the fix;
- the fix uses the simplest tool that solves the issue;
- the core behavior remains the same;
- the investigation note explains what you would measure before and after.

## 8. Self-Check

- Did you identify a real interaction before optimizing?
- Did you simplify state ownership before adding memo hooks?
- Does any memoized component receive stable props?
- Can you explain how you would verify improvement?

## 9. Reflection

Explain the performance decision you made, why you chose that tool, and what evidence would convince you that the change helped.

## 10. Next Step

You now have a practical baseline for React performance work. Future projects will give you larger screens where these decisions become product-level tradeoffs.
