/*
  Warnings:

  - Added the required column `updatedAt` to the `Commande` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Commande` ADD COLUMN `notes` TEXT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `Produit` ADD COLUMN `stock` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `preferences` JSON NULL;
