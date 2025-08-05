'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '../lib/database';
import { getCurrentUser } from './auth';

export async function getTransactions() {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    const transactions = await prisma.transaction.findMany({
      where: { userId: user.id },
      include: {
        contact: true
      },
      orderBy: {
        date: 'desc'
      }
    });

    return transactions;
  } catch (error) {
    console.error('Erro ao buscar transações:', error);
    throw new Error('Falha ao carregar transações');
  }
}

export async function createTransaction(formData) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    const transactionData = {
      type: formData.get('type'),
      amount: parseFloat(formData.get('amount')),
      description: formData.get('description') || '',
      category: formData.get('category') || 'Outros',
      date: new Date(formData.get('date')),
      userId: user.id,
      contactId: formData.get('contactId') || null
    };

    const transaction = await prisma.transaction.create({
      data: transactionData,
      include: {
        contact: true
      }
    });

    revalidatePath('/');
    return { success: true, transaction };
  } catch (error) {
    console.error('Erro ao criar transação:', error);
    throw new Error('Falha ao criar transação');
  }
}

export async function updateTransaction(id, formData) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    const transactionData = {
      type: formData.get('type'),
      amount: parseFloat(formData.get('amount')),
      description: formData.get('description') || '',
      category: formData.get('category') || 'Outros',
      date: new Date(formData.get('date')),
      contactId: formData.get('contactId') || null
    };

    const transaction = await prisma.transaction.update({
      where: { id },
      data: transactionData,
      include: {
        contact: true
      }
    });

    revalidatePath('/');
    return { success: true, transaction };
  } catch (error) {
    console.error('Erro ao atualizar transação:', error);
    throw new Error('Falha ao atualizar transação');
  }
}

export async function deleteTransaction(id) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    await prisma.transaction.delete({
      where: { id }
    });

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Erro ao excluir transação:', error);
    throw new Error('Falha ao excluir transação');
  }
} 