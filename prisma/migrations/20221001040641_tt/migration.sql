/*
  Warnings:

  - You are about to drop the column `pinned` on the `Project` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[pinnedProjectId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "pinned";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "pinnedProjectId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_pinnedProjectId_key" ON "User"("pinnedProjectId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_pinnedProjectId_fkey" FOREIGN KEY ("pinnedProjectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
