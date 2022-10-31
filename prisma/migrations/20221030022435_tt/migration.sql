-- CreateEnum
CREATE TYPE "Badge" AS ENUM ('Projects_10', 'Projects_25', 'Views_100', 'Views_500', 'All_Endorsed');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "badges" "Badge"[];
