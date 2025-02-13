-- AlterTable
ALTER TABLE `User` ADD COLUMN `blockedUntil` DATETIME(3) NULL,
    ADD COLUMN `loginAttempts` INTEGER NOT NULL DEFAULT 0;
