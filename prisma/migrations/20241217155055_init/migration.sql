/*
  Warnings:

  - You are about to drop the column `userId` on the `Commande` table. All the data in the column will be lost.
  - You are about to alter the column `status` on the `Commande` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(1))`.
  - You are about to drop the column `userId` on the `Panier` table. All the data in the column will be lost.
  - You are about to drop the column `commandeId` on the `QuantiteCommande` table. All the data in the column will be lost.
  - You are about to drop the column `produitId` on the `QuantiteCommande` table. All the data in the column will be lost.
  - You are about to drop the column `panierId` on the `QuantitePanier` table. All the data in the column will be lost.
  - You are about to drop the column `produitId` on the `QuantitePanier` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Recette` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[fk_userId]` on the table `Panier` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[fk_commande,fk_produit]` on the table `QuantiteCommande` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[fk_panier,fk_produit]` on the table `QuantitePanier` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fk_userId` to the `Commande` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fk_commande` to the `QuantiteCommande` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fk_produit` to the `QuantiteCommande` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fk_panier` to the `QuantitePanier` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fk_produit` to the `QuantitePanier` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fk_userId` to the `Recette` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Commande` DROP FOREIGN KEY `Commande_User_fkey`;

-- DropForeignKey
ALTER TABLE `Panier` DROP FOREIGN KEY `Panier_User_fkey`;

-- DropForeignKey
ALTER TABLE `QuantiteCommande` DROP FOREIGN KEY `QuantiteCommande_Commande_fkey`;

-- DropForeignKey
ALTER TABLE `QuantiteCommande` DROP FOREIGN KEY `QuantiteCommande_Produit_fkey`;

-- DropForeignKey
ALTER TABLE `QuantitePanier` DROP FOREIGN KEY `QuantitePanier_Panier_fkey`;

-- DropForeignKey
ALTER TABLE `QuantitePanier` DROP FOREIGN KEY `QuantitePanier_Produit_fkey`;

-- DropForeignKey
ALTER TABLE `Recette` DROP FOREIGN KEY `Recette_User_fkey`;

-- DropIndex
DROP INDEX `Panier_userId_key` ON `Panier`;

-- DropIndex
DROP INDEX `PanierProduit_unique` ON `QuantitePanier`;

-- AlterTable
ALTER TABLE `Commande` DROP COLUMN `userId`,
    ADD COLUMN `fk_userId` INTEGER NOT NULL,
    MODIFY `status` ENUM('EN_ATTENTE', 'EN_PREPARATION', 'EXPEDIEE', 'LIVREE', 'ANNULEE') NOT NULL DEFAULT 'EN_ATTENTE';

-- AlterTable
ALTER TABLE `Panier` DROP COLUMN `userId`,
    ADD COLUMN `fk_userId` INTEGER NULL;

-- AlterTable
ALTER TABLE `QuantiteCommande` DROP COLUMN `commandeId`,
    DROP COLUMN `produitId`,
    ADD COLUMN `fk_commande` INTEGER NOT NULL,
    ADD COLUMN `fk_produit` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `QuantitePanier` DROP COLUMN `panierId`,
    DROP COLUMN `produitId`,
    ADD COLUMN `fk_panier` INTEGER NOT NULL,
    ADD COLUMN `fk_produit` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Recette` DROP COLUMN `userId`,
    ADD COLUMN `fk_userId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `User` MODIFY `role` ENUM('USER', 'ADMIN', 'MAGASINIER') NOT NULL DEFAULT 'USER';

-- CreateTable
CREATE TABLE `Ingredient` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `prix` DOUBLE NOT NULL,
    `categorie` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Livraison` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `adresse` VARCHAR(191) NOT NULL,
    `ville` VARCHAR(191) NOT NULL,
    `codePostal` VARCHAR(191) NOT NULL,
    `pays` VARCHAR(191) NOT NULL,
    `fk_userId` INTEGER NULL,
    `fk_commande` INTEGER NULL,
    `fk_panier` INTEGER NULL,

    UNIQUE INDEX `Livraison_fk_commande_key`(`fk_commande`),
    UNIQUE INDEX `Livraison_fk_panier_key`(`fk_panier`),
    INDEX `Livraison_Index`(`fk_userId`, `fk_commande`, `fk_panier`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Log` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `action` VARCHAR(191) NOT NULL,
    `metadata` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fk_userId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Panier_fk_userId_key` ON `Panier`(`fk_userId`);

-- CreateIndex
CREATE UNIQUE INDEX `CommandeProduit_unique` ON `QuantiteCommande`(`fk_commande`, `fk_produit`);

-- CreateIndex
CREATE UNIQUE INDEX `PanierProduit_unique` ON `QuantitePanier`(`fk_panier`, `fk_produit`);

-- AddForeignKey
ALTER TABLE `Panier` ADD CONSTRAINT `Panier_User_fkey` FOREIGN KEY (`fk_userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Recette` ADD CONSTRAINT `Recette_User_fkey` FOREIGN KEY (`fk_userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Commande` ADD CONSTRAINT `Commande_User_fkey` FOREIGN KEY (`fk_userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `QuantitePanier` ADD CONSTRAINT `QuantitePanier_Produit_fkey` FOREIGN KEY (`fk_produit`) REFERENCES `Produit`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `QuantitePanier` ADD CONSTRAINT `QuantitePanier_Panier_fkey` FOREIGN KEY (`fk_panier`) REFERENCES `Panier`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `QuantiteCommande` ADD CONSTRAINT `QuantiteCommande_Produit_fkey` FOREIGN KEY (`fk_produit`) REFERENCES `Produit`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `QuantiteCommande` ADD CONSTRAINT `QuantiteCommande_Commande_fkey` FOREIGN KEY (`fk_commande`) REFERENCES `Commande`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Livraison` ADD CONSTRAINT `Livraison_User_fkey` FOREIGN KEY (`fk_userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Livraison` ADD CONSTRAINT `Livraison_fk_commande_fkey` FOREIGN KEY (`fk_commande`) REFERENCES `Commande`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Livraison` ADD CONSTRAINT `Livraison_fk_panier_fkey` FOREIGN KEY (`fk_panier`) REFERENCES `Panier`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Log` ADD CONSTRAINT `Log_fk_userId_fkey` FOREIGN KEY (`fk_userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
