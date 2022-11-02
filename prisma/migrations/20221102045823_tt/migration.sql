-- CreateEnum
CREATE TYPE "Team" AS ENUM ('Marketing', 'Engineering', 'Design', 'Operations', 'Product', 'Leadership', 'Data');

-- CreateEnum
CREATE TYPE "Position" AS ENUM ('Frontend', 'Backend', 'Fullstack', 'Designer', 'Product_Manager', 'Data_Scientist', 'Engineer_Manager', 'Design_Manager', 'Engineer');

-- CreateEnum
CREATE TYPE "SoftSkill" AS ENUM ('Teamwork', 'Leader', 'Writing', 'Proactive', 'Time_Management', 'Communication', 'Critical_Thinking', 'Motivation', 'Independent', 'Responsible', 'Reliable', 'Mentor', 'Initiative', 'Adaptable', 'Perseverance', 'Meticulous');

-- CreateEnum
CREATE TYPE "TechSkill" AS ENUM ('JavaScript', 'Python', 'React', 'TensorFlow', 'Pytorch', 'Google_Cloud', 'AWS', 'GraphQL', 'Java', 'Golang', 'Docker', 'PHP', 'Tailwind', 'SQL', 'NoSQL', 'Angular', 'Svelte', 'Vue', 'Node', 'Rust', 'CSharp', 'CPP', 'C', 'Figma', 'Bash', 'Deno', 'Prisma', 'Ruby', 'Vercel', 'Next', 'Vite', 'WebAssembly', 'Flutter', 'Dart', 'Kotlin', 'Swift', 'Blockchain', 'Kubernetes', 'DevOps', 'CICD', 'Nuxt', 'Git', 'Elixir', 'Perl', 'Firebase', 'Unity', 'DigitalOcean', 'Linux', 'Nginx', 'Heroku', 'MongoDB', 'Postgres', 'Redis', 'Django', 'Flask', 'Express', 'Remix', 'Astro', 'Qwik', 'Surreal', 'Cassandra', 'Fresh', 'Bun', 'Redwood', 'Tauri', 'Electron', 'LaTeX', 'Lua', 'Haskell', 'Assembly', 'R', 'SupaBase', 'Fly', 'Railway');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('Admin', 'Lead', 'User');

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
    "images" TEXT[],
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

-- CreateTable
CREATE TABLE "Endorsement" (
    "id" SERIAL NOT NULL,
    "techSkill" "TechSkill",
    "softSkill" "SoftSkill",
    "toId" TEXT NOT NULL,
    "fromId" TEXT NOT NULL,

    CONSTRAINT "Endorsement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Project_url_key" ON "Project"("url");

-- CreateIndex
CREATE INDEX "Project_title_skills_idx" ON "Project"("title", "skills");

-- CreateIndex
CREATE UNIQUE INDEX "User_url_key" ON "User"("url");

-- CreateIndex
CREATE UNIQUE INDEX "User_pinnedProjectId_key" ON "User"("pinnedProjectId");

-- CreateIndex
CREATE INDEX "User_name_softSkills_techSkills_positions_url_idx" ON "User"("name", "softSkills", "techSkills", "positions", "url");

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

-- AddForeignKey
ALTER TABLE "Endorsement" ADD CONSTRAINT "Endorsement_toId_fkey" FOREIGN KEY ("toId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Endorsement" ADD CONSTRAINT "Endorsement_fromId_fkey" FOREIGN KEY ("fromId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
