import prisma from '../lib/database';

export const transactionService = {
  // Buscar todas as transações de um usuário
  async getUserTransactions(userId) {
    try {
      const transactions = await prisma.transaction.findMany({
        where: { userId },
        include: {
          contact: true,
          user: {
            select: {
              name: true,
              email: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
      
      return transactions;
    } catch (error) {
      console.error('Erro ao buscar transações:', error);
      throw new Error('Falha ao carregar transações');
    }
  },

  // Adicionar nova transação
  async addTransaction(transactionData) {
    try {
      const transaction = await prisma.transaction.create({
        data: {
          type: transactionData.type,
          amount: transactionData.amount,
          description: transactionData.description || '',
          category: transactionData.category || 'Outros',
          date: new Date(transactionData.date || Date.now()),
          userId: transactionData.userId,
          contactId: transactionData.contactId || null
        },
        include: {
          contact: true,
          user: {
            select: {
              name: true,
              email: true
            }
          }
        }
      });
      
      return transaction;
    } catch (error) {
      console.error('Erro ao adicionar transação:', error);
      throw new Error('Falha ao adicionar transação');
    }
  },

  // Atualizar transação
  async updateTransaction(transactionId, updateData) {
    try {
      const transaction = await prisma.transaction.update({
        where: { id: transactionId },
        data: {
          type: updateData.type,
          amount: updateData.amount,
          description: updateData.description,
          category: updateData.category,
          date: new Date(updateData.date || Date.now()),
          contactId: updateData.contactId || null
        },
        include: {
          contact: true,
          user: {
            select: {
              name: true,
              email: true
            }
          }
        }
      });
      
      return transaction;
    } catch (error) {
      console.error('Erro ao atualizar transação:', error);
      throw new Error('Falha ao atualizar transação');
    }
  },

  // Deletar transação
  async deleteTransaction(transactionId) {
    try {
      await prisma.transaction.delete({
        where: { id: transactionId }
      });
      
      return { success: true };
    } catch (error) {
      console.error('Erro ao deletar transação:', error);
      throw new Error('Falha ao deletar transação');
    }
  },

  // Buscar transação específica
  async getTransaction(transactionId) {
    try {
      const transaction = await prisma.transaction.findUnique({
        where: { id: transactionId },
        include: {
          contact: true,
          user: {
            select: {
              name: true,
              email: true
            }
          }
        }
      });
      
      if (!transaction) {
        throw new Error('Transação não encontrada');
      }
      
      return transaction;
    } catch (error) {
      console.error('Erro ao buscar transação:', error);
      throw new Error('Falha ao buscar transação');
    }
  },

  // Calcular estatísticas do usuário
  async getUserStats(userId) {
    try {
      const transactions = await prisma.transaction.findMany({
        where: { userId }
      });
      
      const income = transactions
        .filter(t => t.type === 'DEPOSIT')
        .reduce((sum, t) => sum + t.amount, 0);
        
      const expenses = transactions
        .filter(t => t.type === 'WITHDRAW')
        .reduce((sum, t) => sum + t.amount, 0);
        
      const balance = income - expenses;
      
      return {
        balance,
        income,
        expenses,
        totalTransactions: transactions.length
      };
    } catch (error) {
      console.error('Erro ao calcular estatísticas:', error);
      throw new Error('Falha ao calcular estatísticas');
    }
  }
};