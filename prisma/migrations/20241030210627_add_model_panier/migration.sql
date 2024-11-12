/*
  Warnings:

  - Added the required column `panierId` to the `QuantitePanier` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `QuantitePanier` ADD COLUMN `panierId` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `Panier` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,

    UNIQUE INDEX `Panier_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Panier` ADD CONSTRAINT `Panier_User_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `QuantitePanier` ADD CONSTRAINT `QuantitePanier_Panier_fkey` FOREIGN KEY (`panierId`) REFERENCES `Panier`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
