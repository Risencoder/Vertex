-- CreateEnum
CREATE TYPE "LessonTaskReviewStatus" AS ENUM ('NEEDS_IMPROVEMENT', 'READY_TO_CONTINUE', 'REVIEW_UNAVAILABLE');

-- CreateTable
CREATE TABLE "lesson_task_attempts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "lessonTaskId" TEXT NOT NULL,
    "response" JSONB NOT NULL,
    "attemptNumber" INTEGER NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lesson_task_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lesson_task_reviews" (
    "id" TEXT NOT NULL,
    "lessonTaskAttemptId" TEXT NOT NULL,
    "status" "LessonTaskReviewStatus" NOT NULL,
    "output" JSONB,
    "provider" TEXT,
    "model" TEXT,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lesson_task_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "lesson_task_attempts_userId_lessonTaskId_attemptNumber_key" ON "lesson_task_attempts"("userId", "lessonTaskId", "attemptNumber");

-- CreateIndex
CREATE UNIQUE INDEX "lesson_task_reviews_lessonTaskAttemptId_key" ON "lesson_task_reviews"("lessonTaskAttemptId");

-- AddForeignKey
ALTER TABLE "lesson_task_attempts" ADD CONSTRAINT "lesson_task_attempts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson_task_attempts" ADD CONSTRAINT "lesson_task_attempts_lessonTaskId_fkey" FOREIGN KEY ("lessonTaskId") REFERENCES "lesson_tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson_task_reviews" ADD CONSTRAINT "lesson_task_reviews_lessonTaskAttemptId_fkey" FOREIGN KEY ("lessonTaskAttemptId") REFERENCES "lesson_task_attempts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
