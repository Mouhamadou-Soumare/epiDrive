/*
  Warnings:

  - Added the required column `slug` to the `Produit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Produit` ADD COLUMN `slug` VARCHAR(191) NOT NULL;
