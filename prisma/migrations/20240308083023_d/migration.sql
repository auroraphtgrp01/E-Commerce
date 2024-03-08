/*
  Warnings:

  - You are about to drop the column `permissions` on the `Role` table. All the data in the column will be lost.
  - The `updatedBy` column on the `Role` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `roleId` to the `Permission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Permission" ADD COLUMN     "roleId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "Role" DROP COLUMN "permissions",
DROP COLUMN "updatedBy",
ADD COLUMN     "updatedBy" JSONB[];

-- AddForeignKey
ALTER TABLE "Permission" ADD CONSTRAINT "Permission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
