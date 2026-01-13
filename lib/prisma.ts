// Importación condicional de Prisma Client
// Solo se usa si DATABASE_URL está configurado

let PrismaClient: any;
let prismaInstance: any = null;

try {
  // Intentar importar PrismaClient
  const prismaModule = require('@prisma/client');
  PrismaClient = prismaModule.PrismaClient;

  // Solo crear instancia si hay DATABASE_URL
  if (process.env.DATABASE_URL) {
    const globalForPrisma = global as unknown as { prisma: any };

    prismaInstance =
      globalForPrisma.prisma ||
      new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
      });

    if (process.env.NODE_ENV !== 'production') {
      globalForPrisma.prisma = prismaInstance;
    }
  }
} catch (error) {
  // Prisma Client no está generado aún, o no hay DATABASE_URL
  console.warn('Prisma Client no disponible. Ejecuta "npx prisma generate" si quieres usar Prisma.');
}

export const prisma = prismaInstance;
