/*
  Warnings:

  - A unique constraint covering the columns `[sessions]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "sessions" TEXT[];

-- CreateIndex
CREATE UNIQUE INDEX "User_sessions_key" ON "User"("sessions");
