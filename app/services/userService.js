import prisma from '../lib/database';

export const userService = {
  // Buscar dados do usuário
  async getUserData(userId) {
    try {
      console.log('🔍 getUserData - userId:', userId);
      
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          transactions: {
            orderBy: { createdAt: 'desc' },
            take: 10
          },
          contacts: {
            orderBy: { createdAt: 'desc' }
          }
        }
      });
      
      console.log('🔍 getUserData - resultado:', user ? 'encontrado' : 'não encontrado');
      return user;
    } catch (error) {
      console.error('❌ Erro em getUserData:', error);
      throw new Error('Falha ao carregar dados do usuário');
    }
  },

  // Buscar usuário por email
  async getUserByEmail(email) {
    try {
      console.log('🔍 getUserByEmail - email:', email);
      
      const user = await prisma.user.findUnique({
        where: { email }
      });
      
      console.log('🔍 getUserByEmail - resultado:', user ? 'encontrado' : 'não encontrado');
      return user;
    } catch (error) {
      console.error('❌ Erro em getUserByEmail:', error);
      throw new Error('Falha ao buscar usuário');
    }
  },

  // Atualizar dados do usuário
  async updateUserData(userId, userData) {
    try {
      const user = await prisma.user.update({
        where: { id: userId },
        data: {
          name: userData.name,
          email: userData.email,
          avatar: userData.avatar,
          role: userData.role
        }
      });
      
      return user;
    } catch (error) {
      console.error('Erro ao atualizar dados do usuário:', error);
      throw new Error('Falha ao atualizar dados do usuário');
    }
  },

  // Criar novo usuário
  async createUser(userData) {
    try {
      const user = await prisma.user.create({
        data: {
          name: userData.name,
          email: userData.email,
          avatar: userData.avatar,
          role: userData.role || 'user'
        }
      });
      
      return user;
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      throw new Error('Falha ao criar usuário');
    }
  },

  // Listar todos os usuários
  async getAllUsers() {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true
        },
        orderBy: { createdAt: 'desc' }
      });
      
      return users;
    } catch (error) {
      console.error('Erro ao listar usuários:', error);
      throw new Error('Falha ao listar usuários');
    }
  }
}; 