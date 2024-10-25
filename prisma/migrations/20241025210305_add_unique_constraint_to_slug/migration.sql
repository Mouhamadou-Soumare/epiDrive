/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Produit` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Produit_slug_key` ON `Produit`(`slug`);
