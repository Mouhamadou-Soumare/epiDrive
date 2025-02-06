import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined; // ✅ "var" permet d'être modifié dynamiquement
}

export {};
