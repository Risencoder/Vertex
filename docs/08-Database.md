# Database Design

## Status

Accepted draft: Data Model v0.1

## Core Structure

Vertex uses an extensible learning model:

LearningPath
> Technology
> Module
> Topic
> Lesson

Additional systems:

- User
- Enrollment
- LessonProgress
- TopicProgress
- Skill
- UserSkill
- Challenge
- Submission
- AIFeedback
- TopicDependency

## Key Decision

Vertex is not tied to one programming language or stack.

The main extensible entity is Technology, which can represent:

- programming languages
- frameworks
- libraries
- databases
- ORMs
- tools
- cloud platforms
- DevOps concepts
- AI tools
- general concepts

