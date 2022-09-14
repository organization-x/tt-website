/*
  Warnings:

  - Changed the type of `role` on the `ProjectAuthor` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('Project_Manager', 'Lead_Engineer', 'Software_Engineer', 'Lead_Designer', 'Designer');

-- AlterTable
ALTER TABLE "ProjectAuthor" DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL;
