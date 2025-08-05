'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '../lib/database';
import { getCurrentUser } from './auth';

export async function getContacts() {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      throw new Error('Usuário não autenticado');
    }
    
    const contacts = await prisma.contact.findMany({
      where: { userId: user.id },
      orderBy: {
        name: 'asc'
      }
    });

    return contacts;
  } catch (error) {
    console.error('Erro ao buscar contatos:', error);
    throw new Error('Falha ao carregar contatos');
  }
}

export async function searchContacts(searchTerm) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      throw new Error('Usuário não autenticado');
    }
    
    const contacts = await prisma.contact.findMany({
      where: {
        userId: user.id,
        OR: [
          { name: { contains: searchTerm } },
          { pixKey: { contains: searchTerm } },
          { email: { contains: searchTerm } },
          { phone: { contains: searchTerm } }
        ]
      },
      orderBy: {
        name: 'asc'
      }
    });

    return contacts;
  } catch (error) {
    console.error('Erro ao buscar contatos:', error);
    throw new Error('Falha ao buscar contatos');
  }
}

export async function findContactByPixKey(pixKey) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      throw new Error('Usuário não autenticado');
    }
    
    const contact = await prisma.contact.findFirst({
      where: { 
        pixKey,
        userId: user.id
      }
    });

    return contact;
  } catch (error) {
    console.error('Erro ao buscar contato por PIX:', error);
    throw new Error('Falha ao buscar contato');
  }
}

export async function createContact(formData) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      throw new Error('Usuário não autenticado');
    }
    
    const contactData = {
      name: formData.get('name'),
      email: formData.get('email') || null,
      phone: formData.get('phone') || null,
      avatar: formData.get('avatar') || null,
      pixKey: formData.get('pixKey') || null,
      pixKeyType: formData.get('pixKeyType') || null,
      bankName: formData.get('bankName') || null,
      accountType: formData.get('accountType') || null,
      accountNumber: formData.get('accountNumber') || null,
      userId: user.id
    };

    const contact = await prisma.contact.create({
      data: contactData
    });

    revalidatePath('/');
    
    return { success: true, contact };
  } catch (error) {
    console.error('Erro ao criar contato:', error);
    throw new Error('Falha ao criar contato');
  }
}

export async function updateContact(id, formData) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      throw new Error('Usuário não autenticado');
    }
    
    const contactData = {
      name: formData.get('name'),
      email: formData.get('email') || null,
      phone: formData.get('phone') || null,
      avatar: formData.get('avatar') || null,
      pixKey: formData.get('pixKey') || null,
      pixKeyType: formData.get('pixKeyType') || null,
      bankName: formData.get('bankName') || null,
      accountType: formData.get('accountType') || null,
      accountNumber: formData.get('accountNumber') || null
    };

    const contact = await prisma.contact.update({
      where: { id },
      data: contactData
    });

    revalidatePath('/');
    return { success: true, contact };
  } catch (error) {
    console.error('Erro ao atualizar contato:', error);
    throw new Error('Falha ao atualizar contato');
  }
}

export async function deleteContact(id) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      throw new Error('Usuário não autenticado');
    }
    
    await prisma.contact.delete({
      where: { id }
    });

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Erro ao excluir contato:', error);
    throw new Error('Falha ao excluir contato');
  }
} 