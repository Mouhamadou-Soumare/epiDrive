/*
  Warnings:

  - A unique constraint covering the columns `[fk_commande,fk_produit]` on the table `QuantiteCommande` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `CommandeProduit_unique` ON `QuantiteCommande`(`fk_commande`, `fk_produit`);
