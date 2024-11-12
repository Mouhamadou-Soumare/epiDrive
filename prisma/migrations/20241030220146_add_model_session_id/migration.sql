/*
  Warnings:

  - A unique constraint covering the columns `[panierId,produitId]` on the table `QuantitePanier` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `PanierProduit_unique` ON `QuantitePanier`(`panierId`, `produitId`);
