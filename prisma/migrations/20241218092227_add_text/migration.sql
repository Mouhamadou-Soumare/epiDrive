-- AlterTable
ALTER TABLE `Ingredient` MODIFY `description` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `Produit` MODIFY `description` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `Recette` MODIFY `description` TEXT NOT NULL,
    MODIFY `instructions` TEXT NOT NULL;
