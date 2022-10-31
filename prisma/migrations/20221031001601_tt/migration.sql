/*
  Warnings:

  - You are about to drop the column `badges` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "badges";

-- DropEnum
DROP TYPE "Badge";
