-- DropForeignKey
ALTER TABLE `comentarios` DROP FOREIGN KEY `comentarios_equipamento_fkey`;

-- DropIndex
DROP INDEX `comentarios_equipamento_fkey` ON `comentarios`;

-- AddForeignKey
ALTER TABLE `comentarios` ADD CONSTRAINT `comentarios_equipamento_fkey` FOREIGN KEY (`equipamento`) REFERENCES `equipamentos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
