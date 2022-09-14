/*
  Warnings:

  - You are about to drop the `Link` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Link" DROP CONSTRAINT "Link_userId_fkey";

-- DropTable
DROP TABLE "Link";

-- DropEnum
DROP TYPE "Social";

-- CreateTable
CREATE TABLE "Links" (
    "GitHub" TEXT,
    "LinkedIn" TEXT,
    "Devto" TEXT,
    "Twitter" TEXT,
    "Facebook" TEXT,
    "Website" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Links_pkey" PRIMARY KEY ("userId")
);

-- AddForeignKey
ALTER TABLE "Links" ADD CONSTRAINT "Links_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
