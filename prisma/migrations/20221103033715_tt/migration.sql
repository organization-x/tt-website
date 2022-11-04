/*
  Warnings:

  - The values [Problem_Solving] on the enum `SoftSkill` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SoftSkill_new" AS ENUM ('Teamwork', 'Leading', 'Writing', 'Proactive', 'Organization', 'Communication', 'Problem_Solver', 'Motivation', 'Independent', 'Responsible', 'Reliable', 'Mentor', 'Initiative', 'Adaptable', 'Perserverance', 'Meticulous');
ALTER TABLE "User" ALTER COLUMN "softSkills" TYPE "SoftSkill_new"[] USING ("softSkills"::text::"SoftSkill_new"[]);
ALTER TABLE "Endorsement" ALTER COLUMN "softSkill" TYPE "SoftSkill_new" USING ("softSkill"::text::"SoftSkill_new");
ALTER TYPE "SoftSkill" RENAME TO "SoftSkill_old";
ALTER TYPE "SoftSkill_new" RENAME TO "SoftSkill";
DROP TYPE "SoftSkill_old";
COMMIT;
