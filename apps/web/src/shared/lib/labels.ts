export type Difficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'

export type LessonType = 'ARTICLE' | 'VIDEO' | 'EXERCISE' | 'PROJECT_PREP'

const difficultyLabels: Record<Difficulty, string> = {
  ADVANCED: 'Advanced',
  BEGINNER: 'Beginner',
  INTERMEDIATE: 'Intermediate',
}

const lessonTypeLabels: Record<LessonType, string> = {
  ARTICLE: 'Article',
  EXERCISE: 'Exercise',
  PROJECT_PREP: 'Project prep',
  VIDEO: 'Video',
}

export function formatDifficulty(difficulty: Difficulty) {
  return difficultyLabels[difficulty] ?? difficulty
}

export function formatLessonType(type: LessonType) {
  return lessonTypeLabels[type] ?? type
}
