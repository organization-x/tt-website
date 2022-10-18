-- CreateEnum
CREATE TYPE "Team" AS ENUM ('Marketing', 'Engineering', 'Design');

-- CreateEnum
CREATE TYPE "Position" AS ENUM ('Frontend', 'Backend', 'Fullstack', 'Designer');

-- CreateEnum
CREATE TYPE "TechSkill" AS ENUM ('JavaScript', 'Python', 'React', 'TensorFlow', 'Pytorch', 'Google_Cloud', 'AWS');

-- CreateEnum
CREATE TYPE "SoftSkill" AS ENUM ('Teamwork', 'Leadership', 'Writing', 'Proactive');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('Admin', 'User');

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
    "position" "Position" NOT NULL,

    CONSTRAINT "ProjectAuthor_pkey" PRIMARY KEY ("userId","projectId")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "theme" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "skills" "TechSkill"[],
    "ownerId" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "visible" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "token" TEXT NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("token")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "discordId" TEXT,
    "url" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'User',
    "name" TEXT NOT NULL,
    "about" TEXT NOT NULL,
    "team" "Team",
    "positions" "Position"[],
    "softSkills" "SoftSkill"[],
    "techSkills" "TechSkill"[],
    "pinnedProjectId" TEXT,
    "visible" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Project_url_key" ON "Project"("url");

-- CreateIndex
CREATE INDEX "Project_title_skills_idx" ON "Project"("title", "skills");

-- CreateIndex
CREATE UNIQUE INDEX "User_discordId_key" ON "User"("discordId");

-- CreateIndex
CREATE UNIQUE INDEX "User_url_key" ON "User"("url");

-- CreateIndex
CREATE UNIQUE INDEX "User_pinnedProjectId_key" ON "User"("pinnedProjectId");

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

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_pinnedProjectId_fkey" FOREIGN KEY ("pinnedProjectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
