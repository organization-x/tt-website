/*
  Warnings:

  - A unique constraint covering the columns `[pinnedById]` on the table `Project` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "pinnedById" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Project_pinnedById_key" ON "Project"("pinnedById");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_pinnedById_fkey" FOREIGN KEY ("pinnedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
