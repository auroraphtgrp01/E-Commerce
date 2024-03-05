/*
  Warnings:

  - You are about to drop the column `isDeleted` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `Agency` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `Cart` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `CartItem` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `Delivery` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `DeliveryDetail` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `PaymentCard` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `Permission` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `Rating` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `Role` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `Variant` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Address" DROP COLUMN "isDeleted";

-- AlterTable
ALTER TABLE "Agency" DROP COLUMN "isDeleted";

-- AlterTable
ALTER TABLE "Cart" DROP COLUMN "isDeleted";

-- AlterTable
ALTER TABLE "CartItem" DROP COLUMN "isDeleted";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "isDeleted";

-- AlterTable
ALTER TABLE "Customer" DROP COLUMN "isDeleted";

-- AlterTable
ALTER TABLE "Delivery" DROP COLUMN "isDeleted";

-- AlterTable
ALTER TABLE "DeliveryDetail" DROP COLUMN "isDeleted";

-- AlterTable
ALTER TABLE "Image" DROP COLUMN "isDeleted";

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "isDeleted";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "isDeleted";

-- AlterTable
ALTER TABLE "PaymentCard" DROP COLUMN "isDeleted";

-- AlterTable
ALTER TABLE "Permission" DROP COLUMN "isDeleted";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "isDeleted";

-- AlterTable
ALTER TABLE "Rating" DROP COLUMN "isDeleted";

-- AlterTable
ALTER TABLE "Role" DROP COLUMN "isDeleted";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "isDeleted";

-- AlterTable
ALTER TABLE "Variant" DROP COLUMN "isDeleted",
ADD COLUMN     "deletedAt" TIMESTAMP(3);
