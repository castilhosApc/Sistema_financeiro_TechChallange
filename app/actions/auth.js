'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/database';

// Gerar token de sessão
function generateToken() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Verificar se o usuário está logado
export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('session_token')?.value;

    if (!token) {
      return null;
    }

    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: true }
    });

    if (!session || new Date() > session.expiresAt) {
      // Sessão expirada, remover
      await prisma.session.deleteMany({
        where: { token }
      });
      return null;
    }

    return session.user;
  } catch (error) {
    console.error('Erro ao verificar usuário:', error);
    return null;
  }
}

// Login
export async function login(formData) {
  try {
    const email = formData.get('email');
    const password = formData.get('password');

    if (!email || !password) {
      throw new Error('Email e senha são obrigatórios');
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user || !user.isActive) {
      throw new Error('Usuário não encontrado ou inativo');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('Senha incorreta');
    }

    // Criar sessão
    const token = generateToken();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 dias

    await prisma.session.create({
      data: {
        token,
        userId: user.id,
        expiresAt
      }
    });

    // Definir cookie
    const cookieStore = await cookies();
    cookieStore.set('session_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: expiresAt
    });

    revalidatePath('/');
    return { success: true, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
  } catch (error) {
    console.error('Erro no login:', error);
    throw new Error(error.message || 'Falha no login');
  }
}

// Cadastro
export async function register(formData) {
  try {
    const name = formData.get('name');
    const email = formData.get('email');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');

    if (!name || !email || !password) {
      throw new Error('Todos os campos são obrigatórios');
    }

    if (password !== confirmPassword) {
      throw new Error('As senhas não coincidem');
    }

    if (password.length < 6) {
      throw new Error('A senha deve ter pelo menos 6 caracteres');
    }

    // Verificar se o email já existe
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existingUser) {
      throw new Error('Este email já está cadastrado');
    }

    // Criptografar senha
    const hashedPassword = await bcrypt.hash(password, 12);

    // Criar usuário
    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: 'user'
      }
    });

    // Criar sessão automaticamente
    const token = generateToken();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    await prisma.session.create({
      data: {
        token,
        userId: user.id,
        expiresAt
      }
    });

    // Definir cookie
    const cookieStore = await cookies();
    cookieStore.set('session_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: expiresAt
    });

    revalidatePath('/');
    return { success: true, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
  } catch (error) {
    console.error('Erro no cadastro:', error);
    throw new Error(error.message || 'Falha no cadastro');
  }
}

// Logout
export async function logout() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('session_token')?.value;

    if (token) {
      // Remover sessão do banco
      await prisma.session.deleteMany({
        where: { token }
      });
    }

    // Remover cookie
    cookieStore.delete('session_token');

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Erro no logout:', error);
    throw new Error('Falha no logout');
  }
}

// Limpar sessões expiradas
export async function cleanupExpiredSessions() {
  try {
    await prisma.session.deleteMany({
      where: {
        expiresAt: {
          lt: new Date()
        }
      }
    });
  } catch (error) {
    console.error('Erro ao limpar sessões:', error);
  }
} 