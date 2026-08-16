-- CreateTable
CREATE TABLE "lesson_task_progress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "lessonTaskId" TEXT NOT NULL,
    "response" JSONB,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lesson_task_progress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "lesson_task_progress_userId_lessonTaskId_key" ON "lesson_task_progress"("userId", "lessonTaskId");

-- AddForeignKey
ALTER TABLE "lesson_task_progress" ADD CONSTRAINT "lesson_task_progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson_task_progress" ADD CONSTRAINT "lesson_task_progress_lessonTaskId_fkey" FOREIGN KEY ("lessonTaskId") REFERENCES "lesson_tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
