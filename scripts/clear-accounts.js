const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function clearAllAccountsExceptAdmin() {
  try {
    console.log('🔍 Verificando conta admin...');
    
    // Primeiro, verificar se existe uma conta admin
    const adminUser = await prisma.user.findFirst({
      where: { 
        email: 'admin@admin.com',
        role: 'admin'
      }
    });

    if (!adminUser) {
      console.error('❌ Conta admin não encontrada. Operação cancelada por segurança.');
      return;
    }

    console.log('✅ Conta admin encontrada:', adminUser.email);
    console.log('🗑️ Iniciando limpeza das contas...');

    // Deletar todas as sessões de usuários não-admin
    const deletedSessions = await prisma.session.deleteMany({
      where: {
        userId: {
          not: adminUser.id
        }
      }
    });
    console.log(`📱 ${deletedSessions.count} sessões removidas`);

    // Deletar todas as transações de usuários não-admin
    const deletedTransactions = await prisma.transaction.deleteMany({
      where: {
        userId: {
          not: adminUser.id
        }
      }
    });
    console.log(`💰 ${deletedTransactions.count} transações removidas`);

    // Deletar todos os contatos de usuários não-admin
    const deletedContacts = await prisma.contact.deleteMany({
      where: {
        userId: {
          not: adminUser.id
        }
      }
    });
    console.log(`👥 ${deletedContacts.count} contatos removidos`);

    // Deletar todos os usuários exceto admin
    const deletedUsers = await prisma.user.deleteMany({
      where: {
        id: {
          not: adminUser.id
        }
      }
    });
    console.log(`👤 ${deletedUsers.count} usuários removidos`);

    console.log('✅ Limpeza concluída com sucesso!');
    console.log('📊 Resumo:');
    console.log(`   - Usuários removidos: ${deletedUsers.count}`);
    console.log(`   - Transações removidas: ${deletedTransactions.count}`);
    console.log(`   - Contatos removidos: ${deletedContacts.count}`);
    console.log(`   - Sessões removidas: ${deletedSessions.count}`);
    console.log(`   - Conta admin mantida: ${adminUser.email}`);

  } catch (error) {
    console.error('❌ Erro durante a limpeza:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Executar a função
clearAllAccountsExceptAdmin();
