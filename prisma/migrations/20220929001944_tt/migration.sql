/*
  Warnings:

  - You are about to drop the column `pinnedById` on the `Project` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_pinnedById_fkey";

-- DropIndex
DROP INDEX "Project_pinnedById_key";

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "pinnedById",
ADD COLUMN     "pinned" BOOLEAN NOT NULL DEFAULT false;
