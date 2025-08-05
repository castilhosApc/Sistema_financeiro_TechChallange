const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Criar usuário admin
  const adminPassword = await bcrypt.hash('admin@123', 12);
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@admin.com' },
    update: {},
    create: {
      name: 'Administrador',
      email: 'admin@admin.com',
      password: adminPassword,
      role: 'admin',
      isActive: true
    }
  });

  console.log('✅ Usuário admin criado:', adminUser.name);

  // Criar contatos de exemplo com informações bancárias completas
  const contacts = await Promise.all([
    prisma.contact.upsert({
      where: { userId_name: { userId: adminUser.id, name: 'Maria Santos' } },
      update: {},
      create: {
        name: 'Maria Santos',
        email: 'maria.santos@email.com',
        phone: '(11) 99999-8888',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        pixKey: 'maria.santos@email.com',
        pixKeyType: 'EMAIL',
        bankName: 'Banco do Brasil',
        accountType: 'PESSOA_FISICA',
        accountNumber: '12345-6',
        userId: adminUser.id
      }
    }),
    prisma.contact.upsert({
      where: { userId_name: { userId: adminUser.id, name: 'Pedro Oliveira' } },
      update: {},
      create: {
        name: 'Pedro Oliveira',
        email: 'pedro.oliveira@email.com',
        phone: '(11) 88888-7777',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        pixKey: '123.456.789-00',
        pixKeyType: 'CPF',
        bankName: 'Itaú',
        accountType: 'PESSOA_FISICA',
        accountNumber: '98765-4',
        userId: adminUser.id
      }
    }),
    prisma.contact.upsert({
      where: { userId_name: { userId: adminUser.id, name: 'Ana Costa' } },
      update: {},
      create: {
        name: 'Ana Costa',
        email: 'ana.costa@email.com',
        phone: '(11) 77777-6666',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        pixKey: '(11) 77777-6666',
        pixKeyType: 'PHONE',
        bankName: 'Santander',
        accountType: 'PESSOA_FISICA',
        accountNumber: '54321-0',
        userId: adminUser.id
      }
    })
  ]);

  console.log('✅ Contatos criados:', contacts.length);

  // Criar transações de exemplo
  const transactions = await Promise.all([
    prisma.transaction.upsert({
      where: { id: '1' },
      update: {},
      create: {
        id: '1',
        type: 'DEPOSIT',
        amount: 5000.00,
        description: 'Salário',
        category: 'Renda',
        date: new Date('2024-01-15'),
        userId: adminUser.id,
        contactId: contacts[0].id
      }
    }),
    prisma.transaction.upsert({
      where: { id: '2' },
      update: {},
      create: {
        id: '2',
        type: 'WITHDRAW',
        amount: 250.50,
        description: 'Supermercado',
        category: 'Alimentação',
        date: new Date('2024-01-14'),
        userId: adminUser.id,
        contactId: contacts[1].id
      }
    }),
    prisma.transaction.upsert({
      where: { id: '3' },
      update: {},
      create: {
        id: '3',
        type: 'TRANSFER',
        amount: 1000.00,
        description: 'Transferência para Maria',
        category: 'Transferência',
        date: new Date('2024-01-13'),
        userId: adminUser.id,
        contactId: contacts[0].id
      }
    }),
    prisma.transaction.upsert({
      where: { id: '4' },
      update: {},
      create: {
        id: '4',
        type: 'DEPOSIT',
        amount: 1500.00,
        description: 'Freelance',
        category: 'Renda',
        date: new Date('2024-01-12'),
        userId: adminUser.id,
        contactId: contacts[2].id
      }
    }),
    prisma.transaction.upsert({
      where: { id: '5' },
      update: {},
      create: {
        id: '5',
        type: 'WITHDRAW',
        amount: 120.00,
        description: 'Combustível',
        category: 'Transporte',
        date: new Date('2024-01-11'),
        userId: adminUser.id
      }
    })
  ]);

  console.log('✅ Transações criadas:', transactions.length);
  console.log('🎉 Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 