-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Team" ADD VALUE 'Operations';
ALTER TYPE "Team" ADD VALUE 'Product';
ALTER TYPE "Team" ADD VALUE 'Leadership';
ALTER TYPE "Team" ADD VALUE 'Data';

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "images" TEXT[];
