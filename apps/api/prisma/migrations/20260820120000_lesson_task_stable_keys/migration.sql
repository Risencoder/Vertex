-- Add stable identity keys to lesson tasks without recreating existing rows.
ALTER TABLE "lesson_tasks" ADD COLUMN "key" TEXT;

UPDATE "lesson_tasks"
SET "key" = CASE "type"
  WHEN 'PREDICTION' THEN 'prediction-main'
  WHEN 'CODE' THEN 'practice-main'
  WHEN 'REFLECTION' THEN 'reflection-main'
  WHEN 'PRACTICE' THEN 'practice-main'
  WHEN 'READING' THEN 'reading-main'
  ELSE lower("type"::text) || '-main'
END;

ALTER TABLE "lesson_tasks" ALTER COLUMN "key" SET NOT NULL;

CREATE UNIQUE INDEX "lesson_tasks_lessonId_key_key" ON "lesson_tasks"("lessonId", "key");

DROP INDEX "lesson_tasks_lessonId_order_key";
