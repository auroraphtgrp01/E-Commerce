/*
  Warnings:

  - The `updatedBy` column on the `Role` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Role" DROP COLUMN "updatedBy",
ADD COLUMN     "updatedBy" JSONB;
