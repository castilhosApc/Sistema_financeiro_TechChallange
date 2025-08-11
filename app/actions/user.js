'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '../lib/database';
import { getCurrentUser } from './auth';
import bcrypt from 'bcryptjs';

export async function getUser() {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    return user;
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    throw new Error('Falha ao carregar dados do usuário');
  }
}

// Atualizar dados básicos do usuário
export async function updateUserProfile(formData) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    const name = formData.get('name');
    const email = formData.get('email');
    const avatar = formData.get('avatar');

    if (!name || !email) {
      throw new Error('Nome e email são obrigatórios');
    }

    // Verificar se o email já existe para outro usuário
    const existingUser = await prisma.user.findFirst({
      where: {
        email: email.toLowerCase(),
        id: { not: user.id }
      }
    });

    if (existingUser) {
      throw new Error('Este email já está sendo usado por outro usuário');
    }

    // Atualizar usuário
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        name,
        email: email.toLowerCase(),
        avatar: avatar || null
      }
    });

    revalidatePath('/');
    return { 
      success: true, 
      user: { 
        id: updatedUser.id, 
        name: updatedUser.name, 
        email: updatedUser.email, 
        role: updatedUser.role,
        avatar: updatedUser.avatar
      } 
    };
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    throw new Error(error.message || 'Falha ao atualizar perfil');
  }
}

// Alterar senha do usuário
export async function updateUserPassword(formData) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    const currentPassword = formData.get('currentPassword');
    const newPassword = formData.get('newPassword');
    const confirmPassword = formData.get('confirmPassword');

    if (!currentPassword || !newPassword || !confirmPassword) {
      throw new Error('Todos os campos são obrigatórios');
    }

    if (newPassword !== confirmPassword) {
      throw new Error('As novas senhas não coincidem');
    }

    if (newPassword.length < 6) {
      throw new Error('A nova senha deve ter pelo menos 6 caracteres');
    }

    // Verificar senha atual
    const currentUser = await prisma.user.findUnique({
      where: { id: user.id }
    });

    const isValidCurrentPassword = await bcrypt.compare(currentPassword, currentUser.password);
    if (!isValidCurrentPassword) {
      throw new Error('Senha atual incorreta');
    }

    // Criptografar nova senha
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    // Atualizar senha
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedNewPassword }
    });

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Erro ao alterar senha:', error);
    throw new Error(error.message || 'Falha ao alterar senha');
  }
}

// Desativar conta do usuário
export async function deactivateUserAccount(formData) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    const password = formData.get('password');

    if (!password) {
      throw new Error('Senha é obrigatória para desativar a conta');
    }

    // Verificar senha
    const currentUser = await prisma.user.findUnique({
      where: { id: user.id }
    });

    if (!currentUser) {
      throw new Error('Usuário não encontrado no banco de dados');
    }

    const isValidPassword = await bcrypt.compare(password, currentUser.password);

    if (!isValidPassword) {
      throw new Error('Senha incorreta');
    }

    // Desativar usuário
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { isActive: false }
    });

    // Remover todas as sessões do usuário
    const deletedSessions = await prisma.session.deleteMany({
      where: { userId: user.id }
    });

    revalidatePath('/');
    
    return { 
      success: true, 
      message: 'Conta desativada com sucesso',
      userId: user.id 
    };
  } catch (error) {
    throw new Error(error.message || 'Falha ao desativar conta');
  }
}

export async function getStats(transactions) {
  try {
    const totalIncome = transactions
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const balance = totalIncome - totalExpenses;

    const monthlyStats = transactions.reduce((acc, transaction) => {
      const month = new Date(transaction.date).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
      
      if (!acc[month]) {
        acc[month] = { income: 0, expenses: 0, balance: 0 };
      }

      if (transaction.amount > 0) {
        acc[month].income += transaction.amount;
      } else {
        acc[month].expenses += Math.abs(transaction.amount);
      }

      acc[month].balance = acc[month].income - acc[month].expenses;
      return acc;
    }, {});

    return {
      totalIncome,
      totalExpenses,
      balance,
      monthlyStats
    };
  } catch (error) {
    console.error('Erro ao calcular estatísticas:', error);
    return {
      totalIncome: 0,
      totalExpenses: 0,
      balance: 0,
      monthlyStats: {}
    };
  }
}

// Limpar todas as contas exceto a admin (função administrativa)
export async function clearAllAccountsExceptAdmin() {
  try {
    // Primeiro, verificar se existe uma conta admin
    const adminUser = await prisma.user.findFirst({
      where: { 
        email: 'admin@admin.com',
        role: 'admin'
      }
    });

    if (!adminUser) {
      throw new Error('Conta admin não encontrada. Operação cancelada por segurança.');
    }

    // Deletar todas as sessões de usuários não-admin
    await prisma.session.deleteMany({
      where: {
        userId: {
          not: adminUser.id
        }
      }
    });

    // Deletar todas as transações de usuários não-admin
    await prisma.transaction.deleteMany({
      where: {
        userId: {
          not: adminUser.id
        }
      }
    });

    // Deletar todos os contatos de usuários não-admin
    await prisma.contact.deleteMany({
      where: {
        userId: {
          not: adminUser.id
        }
      }
    });

    // Deletar todos os usuários exceto admin
    const deletedUsers = await prisma.user.deleteMany({
      where: {
        id: {
          not: adminUser.id
        }
      }
    });

    revalidatePath('/');
    
    return { 
      success: true, 
      message: `Todas as contas foram removidas com sucesso. ${deletedUsers.count} usuários removidos.`,
      adminUser: {
        id: adminUser.id,
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role
      }
    };
  } catch (error) {
    console.error('Erro ao limpar contas:', error);
    throw new Error(error.message || 'Falha ao limpar contas');
  }
} 