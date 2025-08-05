import prisma from '../lib/database';

export const contactService = {
  // Buscar todos os contatos de um usuário
  async getUserContacts(userId) {
    try {
      const contacts = await prisma.contact.findMany({
        where: { userId },
        orderBy: { name: 'asc' }
      });
      
      return contacts;
    } catch (error) {
      console.error('Erro ao buscar contatos:', error);
      throw new Error('Falha ao carregar contatos');
    }
  },

  // Buscar contato específico
  async getContact(contactId) {
    try {
      const contact = await prisma.contact.findUnique({
        where: { id: contactId },
        include: {
          transactions: {
            orderBy: { createdAt: 'desc' },
            take: 10
          }
        }
      });
      
      if (!contact) {
        throw new Error('Contato não encontrado');
      }
      
      return contact;
    } catch (error) {
      console.error('Erro ao buscar contato:', error);
      throw new Error('Falha ao buscar contato');
    }
  },

  // Criar novo contato
  async createContact(contactData) {
    try {
      const contact = await prisma.contact.create({
        data: {
          name: contactData.name,
          email: contactData.email || null,
          phone: contactData.phone || null,
          avatar: contactData.avatar || null,
          userId: contactData.userId
        }
      });
      
      return contact;
    } catch (error) {
      console.error('Erro ao criar contato:', error);
      if (error.code === 'P2002') {
        throw new Error('Já existe um contato com este nome');
      }
      throw new Error('Falha ao criar contato');
    }
  },

  // Atualizar contato
  async updateContact(contactId, contactData) {
    try {
      const contact = await prisma.contact.update({
        where: { id: contactId },
        data: {
          name: contactData.name,
          email: contactData.email || null,
          phone: contactData.phone || null,
          avatar: contactData.avatar || null
        }
      });
      
      return contact;
    } catch (error) {
      console.error('Erro ao atualizar contato:', error);
      if (error.code === 'P2002') {
        throw new Error('Já existe um contato com este nome');
      }
      throw new Error('Falha ao atualizar contato');
    }
  },

  // Deletar contato
  async deleteContact(contactId) {
    try {
      await prisma.contact.delete({
        where: { id: contactId }
      });
      
      return { success: true };
    } catch (error) {
      console.error('Erro ao deletar contato:', error);
      throw new Error('Falha ao deletar contato');
    }
  },

  // Buscar contatos por nome (busca)
  async searchContacts(userId, searchTerm) {
    try {
      const contacts = await prisma.contact.findMany({
        where: {
          userId,
          OR: [
            { name: { contains: searchTerm, mode: 'insensitive' } },
            { email: { contains: searchTerm, mode: 'insensitive' } }
          ]
        },
        orderBy: { name: 'asc' }
      });
      
      return contacts;
    } catch (error) {
      console.error('Erro ao buscar contatos:', error);
      throw new Error('Falha ao buscar contatos');
    }
  }
}; 