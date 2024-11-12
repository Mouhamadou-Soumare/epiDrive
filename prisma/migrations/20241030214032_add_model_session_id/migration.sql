/*
  Warnings:

  - A unique constraint covering the columns `[sessionId]` on the table `Panier` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `Panier` DROP FOREIGN KEY `Panier_User_fkey`;

-- AlterTable
ALTER TABLE `Panier` ADD COLUMN `sessionId` VARCHAR(191) NULL,
    MODIFY `userId` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Panier_sessionId_key` ON `Panier`(`sessionId`);

-- AddForeignKey
ALTER TABLE `Panier` ADD CONSTRAINT `Panier_User_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
