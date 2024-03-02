/*
  Warnings:

  - You are about to drop the column `pickup_address` on the `Agency` table. All the data in the column will be lost.
  - Added the required column `pickupAddress` to the `Agency` table without a default value. This is not possible if the table is not empty.
  - Made the column `shopName` on table `Agency` required. This step will fail if there are existing NULL values in that column.
  - Made the column `taxCode` on table `Agency` required. This step will fail if there are existing NULL values in that column.
  - Made the column `citizenId` on table `Agency` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Agency" DROP COLUMN "pickup_address",
ADD COLUMN     "pickupAddress" TEXT NOT NULL,
ALTER COLUMN "shopName" SET NOT NULL,
ALTER COLUMN "taxCode" SET NOT NULL,
ALTER COLUMN "citizenId" SET NOT NULL;
