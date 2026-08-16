# State and Events Practice

Estimated reading time: 12-15 minutes

## 1. Lesson Goal

By the end of this lesson, you should be able to build a small interactive React component that combines local state, safe updates, event handlers, controlled inputs, and derived UI state.

The goal is not to learn a new API. The goal is to practice using the ideas from this module together.

## 2. Why It Matters

Real frontend work rarely asks you to use one concept in isolation. A simple feature often needs several pieces working together:

- State stores what the user changed.
- Events describe how the user interacts.
- Controlled inputs keep form data visible to React.
- Derived values keep UI rules consistent.
- Safe updates protect values that depend on previous state.

This practice lesson helps you move from understanding individual ideas to building a small, reviewable feature.

## 3. Core Concept

You will build a `TaskPlanner` component.

The component should let a user:

1. Type a task title.
2. Choose a priority.
3. Add the task to a list.
4. Mark tasks as complete.
5. See a derived completion summary.

This combines the full module:

- Controlled inputs for the task form.
- Event handlers for submit and toggle actions.
- Safe updates when adding or updating tasks.
- Derived state for validation and progress.

## 4. Mental Model

Think of the component as a small state machine.

The source state answers:

- What has the user typed?
- Which priority is selected?
- What tasks currently exist?

The derived values answer:

- Can the user submit the form?
- How many tasks are complete?
- Are all tasks complete?

Do not store every answer. Store the facts. Calculate the conclusions.

### Senior Notes

- Small practice components should still use professional habits.
- Clear names matter more than clever shortcuts.
- A feature is easier to review when source state and derived values are easy to identify.
- Do not introduce global state, routing, or server calls for a local interaction exercise.

## 5. Guided Walkthrough

Start with the smallest useful version:

```tsx
import { useState } from 'react'

export function QuickTaskInput() {
  const [title, setTitle] = useState('')

  const canAddTask = title.trim().length > 0

  return (
    <form>
      <label htmlFor="quickTaskTitle">Task title</label>
      <input
        id="quickTaskTitle"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />

      <button disabled={!canAddTask}>Add task</button>
    </form>
  )
}
```

This minimal example combines a controlled input with a derived submit rule. It does not add tasks yet. It only proves that the input state and UI condition are connected.

Now expand that idea into a small feature. Start with the task type:

```tsx
type Priority = 'low' | 'medium' | 'high'

type Task = {
  id: number
  title: string
  priority: Priority
  isComplete: boolean
}
```

Now define the source state:

```tsx
import { useState } from 'react'

export function TaskPlanner() {
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')
  const [tasks, setTasks] = useState<Task[]>([])

  const canAddTask = title.trim().length > 0
  const completedCount = tasks.filter((task) => task.isComplete).length
  const totalCount = tasks.length

  return <section>{/* UI goes here */}</section>
}
```

`canAddTask`, `completedCount`, and `totalCount` are derived. They should not be separate state values.

Add a submit handler:

```tsx
function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault()

  const trimmedTitle = title.trim()

  if (trimmedTitle.length === 0) {
    return
  }

  setTasks((currentTasks) => [
    ...currentTasks,
    {
      id: Date.now(),
      title: trimmedTitle,
      priority,
      isComplete: false,
    },
  ])

  setTitle('')
  setPriority('medium')
}
```

The task update uses an updater function because the next list depends on the previous list.

Add a toggle handler:

```tsx
function handleToggleTask(taskId: number) {
  setTasks((currentTasks) =>
    currentTasks.map((task) =>
      task.id === taskId
        ? { ...task, isComplete: !task.isComplete }
        : task,
    ),
  )
}
```

This creates a new array and a new object for the changed task. It does not mutate the existing task directly.

A possible UI shape:

```tsx
return (
  <section>
    <h2>Task planner</h2>

    <form onSubmit={handleSubmit}>
      <label htmlFor="taskTitle">Task title</label>
      <input
        id="taskTitle"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />

      <label htmlFor="priority">Priority</label>
      <select
        id="priority"
        value={priority}
        onChange={(event) => setPriority(event.target.value as Priority)}
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      <button disabled={!canAddTask} type="submit">
        Add task
      </button>
    </form>

    <p>
      Completed {completedCount} of {totalCount} tasks.
    </p>

    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <button onClick={() => handleToggleTask(task.id)}>
            {task.isComplete ? 'Undo' : 'Complete'}
          </button>
          {task.title} ({task.priority})
        </li>
      ))}
    </ul>
  </section>
)
```

This is not a production task manager. It is a focused exercise for state and events.

## 6. Common Mistakes

### Mistake 1: Storing derived counts in state

Avoid this:

```tsx
const [completedCount, setCompletedCount] = useState(0)
```

The completed count can be calculated from `tasks`.

### Mistake 2: Mutating a task object directly

```tsx
task.isComplete = true
```

Create a new object for the changed task instead.

### Mistake 3: Letting empty tasks into the list

Always trim and validate the title before adding the task.

```tsx
const trimmedTitle = title.trim()
```

### Mistake 4: Putting too many concerns into the practice

Do not add persistence, filters, routing, drag-and-drop, or server requests. Those are useful later, but they distract from the module goal.

## 7. Practice Task

Build the full `TaskPlanner` component.

Requirements:

1. Use controlled inputs for task title and priority.
2. Prevent empty task titles.
3. Add tasks with a safe updater function.
4. Toggle task completion without mutating existing tasks.
5. Derive `canAddTask`, `completedCount`, and `totalCount`.
6. Show an empty state when there are no tasks.
7. Reset the form after adding a task.
8. Keep all state local to the component.

Optional improvement: show a short message when all tasks are complete and there is at least one task.

## 8. Self-Check

Before marking this module complete, check that:

- The form inputs are controlled.
- The submit handler prevents the default browser behavior.
- Empty or whitespace-only tasks are not added.
- Task list updates use an updater function.
- Toggling a task does not mutate existing objects.
- Derived values are not stored as state.
- The UI updates correctly after adding several tasks.
- The UI updates correctly after toggling tasks multiple times.

## 9. Reflection

In three to five sentences, explain your component design:

- Which values are source state?
- Which values are derived?
- Which event handlers update state?
- Where did you use safe updates?

This reflection prepares you to discuss your decisions in code review or an interview.

## 10. Next Step

You have completed the State and Events module.

Next, you are ready to apply this module in larger components. Keep the same habit: understand what state represents, what events change it, and which values can be calculated during render.
