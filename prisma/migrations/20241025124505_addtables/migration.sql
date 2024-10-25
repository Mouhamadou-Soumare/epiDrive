/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Categorie` table. All the data in the column will be lost.
  - You are about to drop the column `parentId` on the `Categorie` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Categorie` table. All the data in the column will be lost.
  - You are about to drop the column `categorieId` on the `Produit` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Produit` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Produit` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `Produit` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Produit` table. All the data in the column will be lost.
  - Added the required column `imageId` to the `Categorie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `prix` to the `Produit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sousCategorieId` to the `Produit` table without a default value. This is not possible if the table is not empty.
  - Made the column `description` on table `Produit` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `Categorie` DROP FOREIGN KEY `Categorie_parentId_fkey`;

-- DropForeignKey
ALTER TABLE `Produit` DROP FOREIGN KEY `Produit_categorieId_fkey`;

-- DropIndex
DROP INDEX `Produit_slug_key` ON `Produit`;

-- AlterTable
ALTER TABLE `Categorie` DROP COLUMN `createdAt`,
    DROP COLUMN `parentId`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `imageId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Produit` DROP COLUMN `categorieId`,
    DROP COLUMN `createdAt`,
    DROP COLUMN `price`,
    DROP COLUMN `slug`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `imageid` INTEGER NULL,
    ADD COLUMN `prix` DOUBLE NOT NULL,
    ADD COLUMN `sousCategorieId` INTEGER NOT NULL,
    MODIFY `description` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
    `imageId` INTEGER NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Recette` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `instructions` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NULL,
    `userId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Commande` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `status` VARCHAR(191) NOT NULL,
    `paymentId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `userId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Quantite` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `quantite` INTEGER NOT NULL,
    `produitId` INTEGER NOT NULL,
    `commandeId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Image` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `path` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SousCategorie` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `categorieId` INTEGER NOT NULL,
    `imageId` INTEGER NULL,

    UNIQUE INDEX `SousCategorie_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_RecetteProduit` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_RecetteProduit_AB_unique`(`A`, `B`),
    INDEX `_RecetteProduit_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_Image_fkey` FOREIGN KEY (`imageId`) REFERENCES `Image`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Recette` ADD CONSTRAINT `Recette_User_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Commande` ADD CONSTRAINT `Commande_User_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Produit` ADD CONSTRAINT `Produit_Image_fkey` FOREIGN KEY (`imageid`) REFERENCES `Image`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Produit` ADD CONSTRAINT `Produit_SousCategorie_fkey` FOREIGN KEY (`sousCategorieId`) REFERENCES `SousCategorie`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Quantite` ADD CONSTRAINT `Quantite_Produit_fkey` FOREIGN KEY (`produitId`) REFERENCES `Produit`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Quantite` ADD CONSTRAINT `Quantite_Commande_fkey` FOREIGN KEY (`commandeId`) REFERENCES `Commande`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SousCategorie` ADD CONSTRAINT `SousCategorie_Categorie_fkey` FOREIGN KEY (`categorieId`) REFERENCES `Categorie`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SousCategorie` ADD CONSTRAINT `SousCategorie_Image_fkey` FOREIGN KEY (`imageId`) REFERENCES `Image`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Categorie` ADD CONSTRAINT `Categorie_Image_fkey` FOREIGN KEY (`imageId`) REFERENCES `Image`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_RecetteProduit` ADD CONSTRAINT `_RecetteProduit_A_fkey` FOREIGN KEY (`A`) REFERENCES `Produit`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_RecetteProduit` ADD CONSTRAINT `_RecetteProduit_B_fkey` FOREIGN KEY (`B`) REFERENCES `Recette`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
