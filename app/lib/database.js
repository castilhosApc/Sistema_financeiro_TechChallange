import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis;

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Testar conexão na inicialização
prisma.$connect()
  .then(() => {
    console.log('✅ Prisma conectado com sucesso');
  })
  .catch((error) => {
    console.error('❌ Erro ao conectar Prisma:', error);
  }); 