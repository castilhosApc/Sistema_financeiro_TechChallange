'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '../lib/database';
import { getCurrentUser } from './auth';

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