/*
  Warnings:

  - Made the column `notificationPreferences` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."User" ALTER COLUMN "notificationPreferences" SET NOT NULL;
