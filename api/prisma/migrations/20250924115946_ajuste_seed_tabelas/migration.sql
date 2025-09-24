CREATE TABLE `perfis` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `perfil` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `usuarios` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `senha` VARCHAR(255) NOT NULL,
    `perfil` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `equipamentos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `equipamento` VARCHAR(500) NOT NULL,
    `imagem` VARCHAR(255) NULL,
    `descricao` TEXT NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `data` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `comentarios` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `comentario` TEXT NOT NULL,
    `equipamento` INTEGER NOT NULL,
    `usuario` INTEGER NOT NULL,
    `data` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `usuarios` ADD CONSTRAINT `usuarios_perfil_fkey` FOREIGN KEY (`perfil`) REFERENCES `perfis`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `comentarios` ADD CONSTRAINT `comentarios_equipamento_fkey` FOREIGN KEY (`equipamento`) REFERENCES `equipamentos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `comentarios` ADD CONSTRAINT `comentarios_usuario_fkey` FOREIGN KEY (`usuario`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
