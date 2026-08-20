import { createHash } from 'node:crypto'
import { existsSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const loaderRoot = dirname(fileURLToPath(import.meta.url))
const repositoryRoot = resolve(loaderRoot, '../../..')
const contentRoot = resolve(repositoryRoot, 'docs/content')
const supportedDifficulties = new Set(['BEGINNER', 'INTERMEDIATE', 'ADVANCED'])
const supportedLessonTypes = new Set([
  'ARTICLE',
  'VIDEO',
  'EXERCISE',
  'PROJECT_PREP',
])
const supportedTaskTypes = new Set([
  'READING',
  'PREDICTION',
  'PRACTICE',
  'CODE',
  'REFLECTION',
])

function readJsonFile(filePath) {
  try {
    return JSON.parse(readFileSync(filePath, 'utf8'))
  } catch (error) {
    throw new Error(`Unable to read JSON file: ${filePath}`, {
      cause: error,
    })
  }
}

function readTextFile(filePath) {
  if (!existsSync(filePath)) {
    throw new Error(`Missing content file: ${filePath}`)
  }

  return readFileSync(filePath, 'utf8')
}

function assertRecord(value, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`${label} must be an object.`)
  }
}

function assertString(value, label) {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`${label} must be a non-empty string.`)
  }
}

function assertInteger(value, label) {
  if (!Number.isInteger(value) || value < 1) {
    throw new Error(`${label} must be a positive integer.`)
  }
}

function assertBoolean(value, label) {
  if (typeof value !== 'boolean') {
    throw new Error(`${label} must be a boolean.`)
  }
}

function assertArray(value, label) {
  if (!Array.isArray(value)) {
    throw new Error(`${label} must be an array.`)
  }
}

function validateSequentialOrders(items, label) {
  const orders = items.map((item) => item.order)
  const uniqueOrders = new Set(orders)

  if (uniqueOrders.size !== orders.length) {
    throw new Error(`${label} orders must be unique.`)
  }

  const sortedOrders = [...orders].sort((left, right) => left - right)

  sortedOrders.forEach((order, index) => {
    if (order !== index + 1) {
      throw new Error(`${label} orders must be sequential starting at 1.`)
    }
  })
}

function hashStarterCode(starterCode) {
  return createHash('sha256').update(starterCode.trim()).digest('hex')
}

function normalizeMultiline(value, label, { allowNull = false } = {}) {
  if (value === null && allowNull) {
    return null
  }

  if (typeof value === 'undefined') {
    return undefined
  }

  if (typeof value === 'string') {
    return value
  }

  if (Array.isArray(value) && value.every((line) => typeof line === 'string')) {
    return value.join('\n')
  }

  throw new Error(`${label} must be a string or an array of strings.`)
}

function extractMarkdownSection(markdown, sectionHeading) {
  const lines = markdown.split('\n')
  const sectionIndex = lines.findIndex((line) => line.trim() === sectionHeading)

  if (sectionIndex === -1) {
    throw new Error(`Missing Markdown section: ${sectionHeading}`)
  }

  const nextSectionIndex = lines.findIndex(
    (line, index) => index > sectionIndex && /^## \d+\./.test(line.trim()),
  )

  return lines
    .slice(sectionIndex, nextSectionIndex === -1 ? undefined : nextSectionIndex)
    .join('\n')
    .trim()
}

function validateCatalog() {
  const catalogPath = resolve(contentRoot, 'catalog.json')
  const catalog = readJsonFile(catalogPath)

  assertRecord(catalog, 'catalog.json')
  assertArray(catalog.technologies, 'catalog.technologies')

  const reactTechnology = catalog.technologies.find(
    (technology) => technology?.slug === 'react',
  )

  if (!reactTechnology) {
    throw new Error('catalog.json must reference the react technology.')
  }
}

function loadReactTechnologyManifest() {
  const technologyPath = resolve(contentRoot, 'react/technology.json')
  const technology = readJsonFile(technologyPath)

  assertRecord(technology, 'react/technology.json')
  assertString(technology.slug, 'technology.slug')
  assertArray(technology.modules, 'technology.modules')

  return technology
}

function findReactModuleManifest(moduleSlug) {
  const technology = loadReactTechnologyManifest()
  const moduleReference = technology.modules.find(
    (module) => module?.slug === moduleSlug,
  )

  if (!moduleReference) {
    throw new Error(`react/technology.json must reference ${moduleSlug}.`)
  }

  assertString(moduleReference.manifest, `${moduleSlug}.manifest`)

  return resolve(contentRoot, 'react', moduleReference.manifest)
}

function validateLesson(lesson, index, moduleSlug) {
  const label = `${moduleSlug} lesson ${index + 1}`

  assertRecord(lesson, label)
  assertString(lesson.slug, `${label}.slug`)
  assertString(lesson.title, `${label}.title`)
  assertString(lesson.description, `${label}.description`)
  assertString(lesson.content, `${label}.content`)
  assertString(lesson.tasks, `${label}.tasks`)
  assertInteger(lesson.order, `${label}.order`)
  assertString(lesson.type, `${label}.type`)
  assertString(lesson.difficulty, `${label}.difficulty`)
  assertBoolean(lesson.isPublished, `${label}.isPublished`)

  if (!supportedLessonTypes.has(lesson.type)) {
    throw new Error(`${label}.type is not supported: ${lesson.type}`)
  }

  if (!supportedDifficulties.has(lesson.difficulty)) {
    throw new Error(
      `${label}.difficulty is not supported: ${lesson.difficulty}`,
    )
  }
}

function validatePredictionTask(task, label) {
  assertString(task.prompt, `${label}.prompt`)
  assertArray(task.options, `${label}.options`)
  assertRecord(task.feedback, `${label}.feedback`)
  assertRecord(task.validation, `${label}.validation`)
  assertString(task.validation.correctOptionId, `${label}.correctOptionId`)

  const optionIds = new Set()

  task.options.forEach((option, index) => {
    assertRecord(option, `${label}.options[${index}]`)
    assertString(option.id, `${label}.options[${index}].id`)
    assertString(option.label, `${label}.options[${index}].label`)
    optionIds.add(option.id)
  })

  if (!optionIds.has(task.validation.correctOptionId)) {
    throw new Error(`${label}.correctOptionId must match an option id.`)
  }

  if (task.feedback.correctOptionId !== task.validation.correctOptionId) {
    throw new Error(
      `${label}.feedback.correctOptionId must match validation.correctOptionId.`,
    )
  }
}

function validateCodeTask(task, label) {
  const starterCode = normalizeMultiline(
    task.starterCode,
    `${label}.starterCode`,
  )

  assertString(starterCode, `${label}.starterCode`)
  assertRecord(task.validation, `${label}.validation`)

  if (task.validation.rejectUnchangedStarter !== true) {
    throw new Error(`${label}.validation.rejectUnchangedStarter must be true.`)
  }
}

function validateReflectionTask(task, label) {
  assertRecord(task.validation, `${label}.validation`)
  assertInteger(task.validation.minWords, `${label}.validation.minWords`)
  assertInteger(
    task.validation.minCharacters,
    `${label}.validation.minCharacters`,
  )
}

function normalizeTask(task, lesson, content, index) {
  const label = `${lesson.slug} task ${index + 1}`

  assertRecord(task, label)
  assertString(task.key, `${label}.key`)
  assertString(task.title, `${label}.title`)
  assertString(task.type, `${label}.type`)
  assertInteger(task.order, `${label}.order`)
  assertBoolean(task.isRequired, `${label}.isRequired`)

  if (!supportedTaskTypes.has(task.type)) {
    throw new Error(`${label}.type is not supported: ${task.type}`)
  }

  if (task.type === 'PREDICTION') {
    validatePredictionTask(task, label)
  }

  if (task.type === 'CODE') {
    validateCodeTask(task, label)
  }

  if (task.type === 'REFLECTION') {
    validateReflectionTask(task, label)
  }

  const starterCode = normalizeMultiline(
    task.starterCode,
    `${label}.starterCode`,
    {
      allowNull: true,
    },
  )
  const prompt =
    typeof task.promptSection === 'string'
      ? extractMarkdownSection(content, task.promptSection)
      : normalizeMultiline(task.prompt, `${label}.prompt`, { allowNull: true })
  const validation =
    task.type === 'CODE' && task.validation?.rejectUnchangedStarter === true
      ? {
          ...task.validation,
          starterCodeHash: hashStarterCode(starterCode),
        }
      : task.validation

  return {
    key: task.key,
    title: task.title,
    description: task.description,
    prompt,
    starterCode,
    options: task.options,
    feedback: task.feedback,
    validation,
    metadata: task.metadata,
    type: task.type,
    order: task.order,
    isRequired: task.isRequired,
  }
}

function normalizeLesson(lesson, moduleRoot, index, moduleSlug) {
  validateLesson(lesson, index, moduleSlug)

  const contentPath = resolve(moduleRoot, lesson.content)
  const tasksPath = resolve(moduleRoot, lesson.tasks)
  const content = readTextFile(contentPath)
  const tasks = readJsonFile(tasksPath)

  assertArray(tasks, `${lesson.slug}.tasks`)
  validateSequentialOrders(tasks, `${lesson.slug} task`)

  const taskKeys = new Set()
  const normalizedTasks = tasks.map((task, taskIndex) => {
    const normalizedTask = normalizeTask(task, lesson, content, taskIndex)

    if (taskKeys.has(normalizedTask.key)) {
      throw new Error(`${lesson.slug} task keys must be unique.`)
    }

    taskKeys.add(normalizedTask.key)

    return normalizedTask
  })

  return {
    slug: lesson.slug,
    title: lesson.title,
    description: lesson.description,
    content,
    order: lesson.order,
    type: lesson.type,
    difficulty: lesson.difficulty,
    isPublished: lesson.isPublished,
    tasks: normalizedTasks,
  }
}

export function loadReactModuleContent(moduleSlug) {
  validateCatalog()

  const moduleManifestPath = findReactModuleManifest(moduleSlug)
  const moduleRoot = dirname(moduleManifestPath)
  const moduleManifest = readJsonFile(moduleManifestPath)

  assertRecord(moduleManifest, `${moduleSlug}/module.json`)
  assertString(moduleManifest.slug, 'module.slug')
  assertString(moduleManifest.title, 'module.title')
  assertString(moduleManifest.description, 'module.description')
  assertInteger(moduleManifest.order, 'module.order')
  assertString(moduleManifest.difficulty, 'module.difficulty')
  assertBoolean(moduleManifest.isPublished, 'module.isPublished')
  assertArray(moduleManifest.lessons, 'module.lessons')

  if (moduleManifest.slug !== moduleSlug) {
    throw new Error(
      `Expected module slug ${moduleSlug}, received ${moduleManifest.slug}.`,
    )
  }

  if (!supportedDifficulties.has(moduleManifest.difficulty)) {
    throw new Error(
      `Unsupported module difficulty: ${moduleManifest.difficulty}`,
    )
  }

  validateSequentialOrders(moduleManifest.lessons, `${moduleSlug} lesson`)

  return {
    module: {
      slug: moduleManifest.slug,
      title: moduleManifest.title,
      description: moduleManifest.description,
      order: moduleManifest.order,
      difficulty: moduleManifest.difficulty,
      isPublished: moduleManifest.isPublished,
    },
    lessons: moduleManifest.lessons.map((lesson, index) =>
      normalizeLesson(lesson, moduleRoot, index, moduleSlug),
    ),
  }
}

export function loadStateAndEventsContent() {
  return loadReactModuleContent('state-and-events')
}
