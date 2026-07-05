# Vertex Domain Model

## 1. Product Philosophy

Vertex is an AI-powered engineering growth platform, not just a course platform.

The product is designed to help developers move through a full growth cycle: learn concepts, build real work, submit results, receive feedback, improve, and continue with measurable progress.

Courses and lessons are only part of the system. The core product value is structured growth through practice, project work, review, and iteration.

## 2. Core Product Loop

The first version of Vertex should support this loop:

```text
Learn
Build
Submit
Review
Improve
Repeat
```

This loop should influence both product design and database design. Learning content should not exist only for passive reading. It should connect to progress, projects, submissions, and reviews.

## 3. MVP Scope

Included in MVP:

- Authentication
- User Profile
- Learning Paths
- Technologies
- Modules
- Lessons
- Lesson Progress
- Projects
- Project Submissions
- Project Reviews

Excluded for now:

- Payments
- Teams
- Marketplace
- Community
- Certificates
- Public profiles
- Full AI automation

## 4. Core Entities

### User

Purpose:
Represents the authenticated account in Vertex.

Main responsibilities:

- Own authentication identity.
- Own profile, settings, progress, submissions, and reviews.
- Act as the main actor in the learning loop.

Important relationships:

- Has one `Profile`.
- Has one `UserSettings`.
- Has many `LessonProgress` records.
- Has many `ProjectSubmission` records.
- Can receive many `Achievement` records.

Future extension points:

- Roles and permissions.
- Account status.
- Team membership.
- Public profile visibility.

### Profile

Purpose:
Stores user-facing personal and learning context.

Main responsibilities:

- Store display name and basic profile details.
- Store learning goals and experience level.
- Keep product-facing user metadata separate from authentication data.

Important relationships:

- Belongs to one `User`.

Future extension points:

- Portfolio metadata.
- Career goals.
- Public profile fields.
- Skill summary.

### LearningPath

Purpose:
Represents a structured path toward a learning outcome.

Main responsibilities:

- Group related technologies into a coherent path.
- Define the high-level direction for a learner.
- Provide a product-level container for progression.

Important relationships:

- Has many `LearningPathTechnology` records.
- Connects to many `Technology` records through `LearningPathTechnology`.

Future extension points:

- Difficulty levels.
- Recommended order.
- Path enrollment.
- Path completion tracking.

### LearningPathTechnology

Purpose:
Joins `LearningPath` and `Technology` while preserving ordering and path-specific metadata.

Main responsibilities:

- Define which technologies belong to a learning path.
- Store technology order inside a path.
- Allow the same technology to appear in multiple paths.

Important relationships:

- Belongs to one `LearningPath`.
- Belongs to one `Technology`.

Future extension points:

- Required vs optional technologies.
- Path-specific descriptions.
- Estimated time.
- Unlock rules.

### Technology

Purpose:
Represents a reusable technology, tool, concept, framework, language, or platform.

Main responsibilities:

- Own modules, lessons, and projects related to a specific technology.
- Be reusable across multiple learning paths.
- Provide a stable learning area independent from a single path.

Important relationships:

- Has many `LearningPathTechnology` records.
- Has many `Module` records.
- Has many `Project` records.

Future extension points:

- Technology categories.
- Skill tags.
- Versions.
- Prerequisites.

### Module

Purpose:
Groups lessons inside a technology.

Main responsibilities:

- Organize lessons into clear sections.
- Provide ordering within a technology.
- Represent a meaningful learning milestone.

Important relationships:

- Belongs to one `Technology`.
- Has many `Lesson` records.

Future extension points:

- Module-level progress.
- Module assessments.
- Prerequisite modules.
- Estimated duration.

### Lesson

Purpose:
Represents a focused learning unit.

Main responsibilities:

- Teach one topic or concept.
- Provide tasks and resources.
- Support progress tracking at the lesson level.

Important relationships:

- Belongs to one `Module`.
- Has many `LessonTask` records.
- Has many `Resource` records.
- Has many `LessonProgress` records.

Future extension points:

- Lesson types.
- Rich content blocks.
- AI explanations.
- Reusable lessons if needed later.

### LessonTask

Purpose:
Represents an actionable task inside a lesson.

Main responsibilities:

- Convert passive learning into action.
- Define what the user should do to practice the lesson.
- Support simple completion criteria in the MVP.

Important relationships:

- Belongs to one `Lesson`.

Future extension points:

- Task types.
- Automated checks.
- Code challenges.
- AI-assisted hints.

### Resource

Purpose:
Stores supporting material for a lesson.

Main responsibilities:

- Link to documentation, articles, videos, examples, or internal notes.
- Help users go deeper without bloating lesson content.

Important relationships:

- Belongs to one `Lesson` in the MVP.

Future extension points:

- Reusable standalone resource library.
- Resource tagging.
- Resource quality score.
- Multiple resource owners.

### LessonProgress

Purpose:
Tracks a user's progress through a lesson.

Main responsibilities:

- Store completion state for `User + Lesson`.
- Support progress tracking before more complex analytics exist.
- Provide the first reliable progress signal.

Important relationships:

- Belongs to one `User`.
- Belongs to one `Lesson`.

Future extension points:

- Time spent.
- Confidence score.
- Attempts.
- Last activity timestamp.

### Project

Purpose:
Represents a practical build assignment independent from a lesson.

Main responsibilities:

- Define what the user should build.
- Connect learning to real project work.
- Belong to a technology or learning area without being locked to one lesson.

Important relationships:

- Belongs to one `Technology` in the MVP direction.
- Has many `ProjectSubmission` records.

Future extension points:

- Project difficulty.
- Starter files.
- Rubrics.
- Multiple technologies per project.
- Optional connection to learning paths.

### ProjectSubmission

Purpose:
Represents a user's submitted solution for a project.

Main responsibilities:

- Store submission metadata.
- Connect a user to a project attempt.
- Provide the input for review.

Important relationships:

- Belongs to one `User`.
- Belongs to one `Project`.
- Has many or one `ProjectReview` records depending on review policy.

Future extension points:

- GitHub repository URL.
- Live demo URL.
- Submitted files.
- Submission attempts.
- Status workflow.

### ProjectReview

Purpose:
Stores feedback for a project submission.

Main responsibilities:

- Keep review separate from submission.
- Store feedback, score, or evaluation result.
- Support human review now and AI-assisted review later.

Important relationships:

- Belongs to one `ProjectSubmission`.

Future extension points:

- AI review versioning.
- Reviewer identity.
- Rubric-based scoring.
- Review history.
- Re-review requests.

### Achievement

Purpose:
Represents a milestone or recognition earned by a user.

Main responsibilities:

- Track meaningful progress milestones.
- Support motivation without replacing real skill tracking.

Important relationships:

- Belongs to one `User`.

Future extension points:

- Achievement categories.
- Visibility settings.
- Unlock rules.
- Delayed MVP inclusion if needed.

### UserSettings

Purpose:
Stores user preferences and product settings.

Main responsibilities:

- Keep preferences separate from profile and auth data.
- Store settings that affect user experience.

Important relationships:

- Belongs to one `User`.

Future extension points:

- Notification preferences.
- Theme.
- AI assistance preferences.
- Privacy controls.

## 5. Relationships Overview

```text
User
 |-- Profile
 |-- UserSettings
 |-- LessonProgress ---------------- Lesson
 |                                   |-- LessonTask
 |                                   |-- Resource
 |                                   `-- Module ------------- Technology
 |-- ProjectSubmission ------------- Project --------------- Technology
 |   `-- ProjectReview
 `-- Achievement

LearningPath
 `-- LearningPathTechnology -------- Technology
                                      |-- Module
                                      `-- Project
```

Important decisions:

- `Technology` is reusable across `LearningPath` records.
- `Project` is separate from `Lesson`.
- `ProjectSubmission` belongs to `User` and `Project`.
- `ProjectReview` belongs to `ProjectSubmission`.
- `LessonProgress` tracks `User + Lesson`.

## 6. Product Flow

Main user journey:

1. Landing
2. Register/Login
3. Choose Learning Path
4. Open Technology
5. Complete Modules/Lessons
6. Build Project
7. Submit Project
8. Receive Review
9. Track Progress
10. Continue Learning

The MVP should make this journey possible with minimal complexity. It does not need advanced automation, payments, public profiles, or team workflows.

## 7. Architecture Decisions

### Decision 001

`LearningPath -> Technology -> Module -> Lesson` is the primary learning structure.

Reason:
This structure supports long-term reuse and keeps learning content organized by real technologies and skills.

### Decision 002

`Technology` is reusable.

Reason:
The same technology can appear in multiple learning paths. For example, TypeScript can be part of frontend, backend, and full-stack paths.

### Decision 003

`Project` is independent from `Lesson`.

Reason:
Projects should represent real build work and may require multiple lessons, modules, or technologies.

### Decision 004

Progress is tracked at `Lesson` level first.

Reason:
Lesson-level progress is simple, useful, and enough for the MVP. More detailed module, path, or skill progress can be derived or added later.

### Decision 005

Project review is modeled separately from submission.

Reason:
Submissions and reviews have different lifecycles. A submission may be reviewed later, reviewed multiple times, or reviewed by different systems in the future.

## 8. Open Questions

- Should projects belong only to `Technology` or also to `LearningPath`?
- Can lessons be reused across modules?
- Should resources be standalone reusable entities?
- How detailed should task types be in MVP?
- How should AI reviews be versioned later?
- Should achievements be part of MVP or delayed?

## 9. MVP Database Direction

This document should guide the first Prisma schema, but it is not the Prisma schema itself.

The Prisma schema should be created later from these product decisions, with database-specific details added only when implementation starts. This document defines the product model, entity responsibilities, and relationship direction for MVP v1.
