/*
  Warnings:

  - You are about to drop the column `sousCategorieId` on the `Produit` table. All the data in the column will be lost.
  - You are about to drop the `SousCategorie` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `categorieId` to the `Produit` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Categorie` DROP FOREIGN KEY `Categorie_Image_fkey`;

-- DropForeignKey
ALTER TABLE `Produit` DROP FOREIGN KEY `Produit_SousCategorie_fkey`;

-- DropForeignKey
ALTER TABLE `SousCategorie` DROP FOREIGN KEY `SousCategorie_Categorie_fkey`;

-- DropForeignKey
ALTER TABLE `SousCategorie` DROP FOREIGN KEY `SousCategorie_Image_fkey`;

-- AlterTable
ALTER TABLE `Categorie` ADD COLUMN `parentId` INTEGER NULL,
    MODIFY `imageId` INTEGER NULL;

-- AlterTable
ALTER TABLE `Produit` DROP COLUMN `sousCategorieId`,
    ADD COLUMN `categorieId` INTEGER NOT NULL;

-- DropTable
DROP TABLE `SousCategorie`;

-- AddForeignKey
ALTER TABLE `Produit` ADD CONSTRAINT `Produit_Categorie_fkey` FOREIGN KEY (`categorieId`) REFERENCES `Categorie`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Categorie` ADD CONSTRAINT `Categorie_Image_fkey` FOREIGN KEY (`imageId`) REFERENCES `Image`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Categorie` ADD CONSTRAINT `Categorie_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `Categorie`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
