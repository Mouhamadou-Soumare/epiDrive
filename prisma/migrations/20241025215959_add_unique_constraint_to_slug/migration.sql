/*
  Warnings:

  - You are about to drop the `Quantite` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Quantite` DROP FOREIGN KEY `Quantite_Commande_fkey`;

-- DropForeignKey
ALTER TABLE `Quantite` DROP FOREIGN KEY `Quantite_Produit_fkey`;

-- DropTable
DROP TABLE `Quantite`;

-- CreateTable
CREATE TABLE `QuantitePanier` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `quantite` INTEGER NOT NULL,
    `prix` DOUBLE NOT NULL,
    `produitId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `QuantiteCommande` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `quantite` INTEGER NOT NULL,
    `prix` DOUBLE NOT NULL,
    `produitId` INTEGER NOT NULL,
    `commandeId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `QuantitePanier` ADD CONSTRAINT `QuantitePanier_Produit_fkey` FOREIGN KEY (`produitId`) REFERENCES `Produit`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `QuantiteCommande` ADD CONSTRAINT `QuantiteCommande_Produit_fkey` FOREIGN KEY (`produitId`) REFERENCES `Produit`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `QuantiteCommande` ADD CONSTRAINT `QuantiteCommande_Commande_fkey` FOREIGN KEY (`commandeId`) REFERENCES `Commande`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
