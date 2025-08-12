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

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    // Verificar se a conta está inativa
    if (!user.isActive) {
      // Verificar se a senha está correta para permitir reativação
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw new Error('Senha incorreta');
      }
      
      // Retornar erro específico para conta inativa
      throw new Error('CONTA_INATIVA');
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

// Reativar conta inativa
export async function reactivateAccount(formData) {
  try {
    const email = formData.get('email');
    const password = formData.get('password');

    if (!email || !password) {
      throw new Error('Email e senha são obrigatórios');
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    if (user.isActive) {
      throw new Error('Conta já está ativa');
    }

    // Verificar senha
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('Senha incorreta');
    }

    // Reativar conta
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { isActive: true }
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
    return { 
      success: true, 
      message: 'Conta reativada com sucesso!',
      user: { id: user.id, name: user.name, email: user.email, role: user.role } 
    };
  } catch (error) {
    console.error('Erro ao reativar conta:', error);
    throw new Error(error.message || 'Falha ao reativar conta');
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

    // Validações mais robustas de senha
    if (password.length < 8) {
      throw new Error('A senha deve ter pelo menos 8 caracteres');
    }
    
    if (!/[A-Z]/.test(password)) {
      throw new Error('A senha deve conter pelo menos uma letra maiúscula');
    }
    
    if (!/[a-z]/.test(password)) {
      throw new Error('A senha deve conter pelo menos uma letra minúscula');
    }
    
    if (!/\d/.test(password)) {
      throw new Error('A senha deve conter pelo menos um número');
    }
    
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      throw new Error('A senha deve conter pelo menos um caractere especial (!@#$%^&*()_+-=[]{}|;:,.<>?)');
    }

    // Verificar se o email já existe
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existingUser && existingUser.isActive) {
      throw new Error('Este email já está cadastrado');
    }

    // Se o usuário existe mas está inativo, reativar a conta
    if (existingUser && !existingUser.isActive) {
      // Verificar se a senha está correta
      const isValidPassword = await bcrypt.compare(password, existingUser.password);
      if (!isValidPassword) {
        throw new Error('Este email já está cadastrado com uma senha diferente');
      }

      // Reativar conta existente
      const updatedUser = await prisma.user.update({
        where: { id: existingUser.id },
        data: { 
          isActive: true,
          name: name // Atualizar nome se mudou
        }
      });

      // Criar sessão automaticamente
      const token = generateToken();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);

      await prisma.session.create({
        data: {
          token,
          userId: updatedUser.id,
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
      return { 
        success: true, 
        message: 'Conta reativada com sucesso!',
        user: { id: updatedUser.id, name: updatedUser.name, email: updatedUser.email, role: updatedUser.role } 
      };
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