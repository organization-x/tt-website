-- CreateEnum
CREATE TYPE "Team" AS ENUM ('MARKETING', 'ENGINEERING');

-- CreateEnum
CREATE TYPE "Position" AS ENUM ('FRONTEND', 'BACKEND', 'FULLSTACK', 'DESIGNER');

-- CreateEnum
CREATE TYPE "Skill" AS ENUM ('JAVASCRIPT', 'PYTHON', 'REACT', 'TENSORFLOW', 'PYTORCH', 'GCLOUD', 'AWS');

-- CreateEnum
CREATE TYPE "Social" AS ENUM ('GITHUB', 'LINKEDIN', 'DEVTO', 'TWITTER', 'FACEBOOK', 'WEBSITE');

-- CreateTable
CREATE TABLE "SocialLink" (
    "social" "Social" NOT NULL,
    "link" TEXT NOT NULL,
    "userId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ProjectAuthor" (
    "userId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "role" TEXT NOT NULL,

    CONSTRAINT "ProjectAuthor_pkey" PRIMARY KEY ("userId","projectId")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "snippet" TEXT NOT NULL,
    "theme" TEXT NOT NULL,
    "bannerurl" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "skills" "Skill"[],

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("token")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "iconurl" TEXT NOT NULL,
    "bannerurl" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "about" TEXT NOT NULL,
    "team" "Team",
    "positions" "Position"[],
    "skills" "Skill"[],

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SocialLink_link_key" ON "SocialLink"("link");

-- CreateIndex
CREATE INDEX "Project_title_skills_idx" ON "Project"("title", "skills");

-- CreateIndex
CREATE INDEX "User_name_skills_positions_idx" ON "User"("name", "skills", "positions");

-- AddForeignKey
ALTER TABLE "SocialLink" ADD CONSTRAINT "SocialLink_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectAuthor" ADD CONSTRAINT "ProjectAuthor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectAuthor" ADD CONSTRAINT "ProjectAuthor_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
