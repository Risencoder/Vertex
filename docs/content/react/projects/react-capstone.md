# React Capstone

## Project Goal

Build a small React application that proves you can combine the core skills from the React path into one coherent product experience.

This is not another lesson. The goal is to make decisions, connect features, and produce a reviewable application that feels like a real engineering artifact.

## Product Brief

Create a learning or productivity app with at least three connected screens. The app should let a user browse data, inspect details, submit a form, and see useful UI state changes after interaction.

Choose one focused product idea:

- a learning path planner;
- a project tracker;
- a habit or study dashboard;
- a resource library;
- a lightweight issue or task board.

Keep the scope small. A polished small app is better than an unfinished large app.

## Required Capabilities

Your application must demonstrate:

- component extraction with clear props;
- state and event handling for real interactions;
- at least one custom hook or well-scoped built-in hook usage;
- client-side routing with list/detail or nested screen structure;
- a controlled form with validation and submission state;
- sensible performance decisions, explained in notes or code comments.

## Functional Requirements

The app should include:

1. A dashboard or list screen.
2. A detail screen reached through routing.
3. A form that creates, filters, edits, or submits meaningful data.
4. Loading, empty, error, or success states where they make sense.
5. Navigation that works after browser refresh on nested routes.
6. A small README or notes section explaining the main decisions.

The app does not need a backend. Local data, mock data, or browser state is acceptable for this capstone.

## Engineering Expectations

Use readable component boundaries. Keep state close to the UI that owns it. Derive values instead of storing unnecessary state. Use `useMemo`, `useCallback`, or `React.memo` only when you can explain why the boundary or calculation matters.

Do not optimize by habit. If you add a performance tool, describe the interaction it protects.

## Submission Expectations

Submit:

- a repository URL;
- an optional deployed demo URL;
- notes explaining what you built, what tradeoffs you made, and what you would improve next.

Your notes should make the project reviewable without requiring the reviewer to guess your intent.

## Review Criteria

The capstone is ready for review when:

- the app runs locally from the repository instructions;
- routes and navigation work;
- form validation gives clear feedback;
- state ownership is understandable;
- components are named around product meaning;
- the app avoids unnecessary abstractions;
- performance choices are reasonable and explained;
- the README or notes describe the main decisions.

## Non Goals

Do not add authentication, payments, a database, AI features, or a large design system. Do not turn the project into a clone of Vertex itself.

The capstone should prove React product-building skill, not infrastructure breadth.
