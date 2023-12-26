/*
  Warnings:

  - A unique constraint covering the columns `[provider,providerId]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "provider" TEXT NOT NULL DEFAULT 'local',
ADD COLUMN     "providerId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_provider_providerId_key" ON "users"("provider", "providerId");
