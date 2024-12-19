-- CreateTable
CREATE TABLE `_RecetteIngredient` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_RecetteIngredient_AB_unique`(`A`, `B`),
    INDEX `_RecetteIngredient_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_RecetteIngredient` ADD CONSTRAINT `_RecetteIngredient_A_fkey` FOREIGN KEY (`A`) REFERENCES `Ingredient`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_RecetteIngredient` ADD CONSTRAINT `_RecetteIngredient_B_fkey` FOREIGN KEY (`B`) REFERENCES `Recette`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
