/*
  Warnings:

  - The values [NONE] on the enum `Team` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Team_new" AS ENUM ('MARKETING', 'ENGINEERING');
ALTER TABLE "User" ALTER COLUMN "team" TYPE "Team_new" USING ("team"::text::"Team_new");
ALTER TYPE "Team" RENAME TO "Team_old";
ALTER TYPE "Team_new" RENAME TO "Team";
DROP TYPE "Team_old";
COMMIT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "team" DROP NOT NULL;
