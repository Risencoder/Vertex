-- AlterEnum
ALTER TYPE "TaskType" ADD VALUE 'PREDICTION';

-- AlterTable
ALTER TABLE "lesson_tasks" ADD COLUMN     "feedback" JSONB,
ADD COLUMN     "isRequired" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "options" JSONB,
ADD COLUMN     "prompt" TEXT,
ADD COLUMN     "starterCode" TEXT,
ADD COLUMN     "validation" JSONB;
