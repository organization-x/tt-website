-- CreateEnum
CREATE TYPE "Team" AS ENUM ('Marketing', 'Engineering', 'Design');

-- CreateEnum
CREATE TYPE "Position" AS ENUM ('Frontend', 'Backend', 'Fullstack', 'Designer');

-- CreateEnum
CREATE TYPE "TechSkill" AS ENUM ('JavaScript', 'Python', 'React', 'TensorFlow', 'Pytorch', 'Google_Cloud', 'AWS');

-- CreateEnum
CREATE TYPE "SoftSkill" AS ENUM ('Teamwork', 'Leadership', 'Writing', 'Proactive');

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
    "url" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "skills" "TechSkill"[],

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
    "url" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "about" TEXT NOT NULL,
    "team" "Team",
    "positions" "Position"[],
    "softSkills" "SoftSkill"[],
    "techSkills" "TechSkill"[],

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Project_url_key" ON "Project"("url");

-- CreateIndex
CREATE INDEX "Project_title_skills_idx" ON "Project"("title", "skills");

-- CreateIndex
CREATE UNIQUE INDEX "User_url_key" ON "User"("url");

-- CreateIndex
CREATE INDEX "User_name_techSkills_softSkills_positions_idx" ON "User"("name", "techSkills", "softSkills", "positions");

-- AddForeignKey
ALTER TABLE "Links" ADD CONSTRAINT "Links_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectAuthor" ADD CONSTRAINT "ProjectAuthor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectAuthor" ADD CONSTRAINT "ProjectAuthor_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
