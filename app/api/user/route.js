import { NextResponse } from 'next/server';
import { userService } from '../../services/userService';

// GET - Buscar dados do usuário
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const email = searchParams.get('email');
    
    console.log('🔍 Buscando usuário:', { userId, email });
    
    if (!userId && !email) {
      return NextResponse.json(
        { error: 'userId ou email é obrigatório' },
        { status: 400 }
      );
    }

    let userData;
    if (userId) {
      console.log('🔍 Buscando por userId:', userId);
      userData = await userService.getUserData(userId);
    } else if (email) {
      console.log('🔍 Buscando por email:', email);
      userData = await userService.getUserByEmail(email);
    }
    
    if (!userData) {
      console.log('❌ Usuário não encontrado');
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }
    
    console.log('✅ Usuário encontrado:', userData.name);
    return NextResponse.json({
      success: true,
      data: userData
    });
  } catch (error) {
    console.error('❌ Erro ao buscar usuário:', error);
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        details: error.message 
      },
      { status: 500 }
    );
  }
} 