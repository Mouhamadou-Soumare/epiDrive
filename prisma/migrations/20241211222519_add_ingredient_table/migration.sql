/*
  Warnings:

  - A unique constraint covering the columns `[fk_commande,fk_produit]` on the table `QuantiteCommande` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE `Ingredient` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `prix` DOUBLE NOT NULL,
    `categorie` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `CommandeProduit_unique` ON `QuantiteCommande`(`fk_commande`, `fk_produit`);
