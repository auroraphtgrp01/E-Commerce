/*
  Warnings:

  - You are about to drop the column `roleId` on the `Permission` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Permission" DROP CONSTRAINT "Permission_roleId_fkey";

-- AlterTable
ALTER TABLE "Permission" DROP COLUMN "roleId";

-- CreateTable
CREATE TABLE "IncludePermission" (
    "id" UUID NOT NULL,
    "roleId" UUID NOT NULL,
    "permissionId" UUID NOT NULL,

    CONSTRAINT "IncludePermission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "IncludePermission_roleId_key" ON "IncludePermission"("roleId");

-- CreateIndex
CREATE UNIQUE INDEX "IncludePermission_permissionId_key" ON "IncludePermission"("permissionId");

-- AddForeignKey
ALTER TABLE "IncludePermission" ADD CONSTRAINT "IncludePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncludePermission" ADD CONSTRAINT "IncludePermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
