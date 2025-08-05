import { NextResponse } from 'next/server';
import { transactionService } from '../../../services/transactionService';

export async function GET(request, { params }) {
  try {
    const { userId } = params;
    
    const stats = await transactionService.getUserStats(userId);
    
    return NextResponse.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 