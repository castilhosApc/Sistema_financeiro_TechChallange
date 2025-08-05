import { NextResponse } from 'next/server';
import { transactionService } from '../../services/transactionService';

// GET - Buscar transações
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'userId é obrigatório' },
        { status: 400 }
      );
    }

    const transactions = await transactionService.getUserTransactions(userId);
    
    return NextResponse.json({
      success: true,
      data: transactions
    });
  } catch (error) {
    console.error('Erro na API de transações:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// POST - Criar nova transação
export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, type, amount, description, category, contactId } = body;
    
    if (!userId || !type || !amount) {
      return NextResponse.json(
        { error: 'Dados obrigatórios não fornecidos' },
        { status: 400 }
      );
    }

    const transactionData = {
      userId,
      type,
      amount: parseFloat(amount),
      description: description || '',
      category: category || 'Outros',
      contactId: contactId || null,
      date: new Date().toISOString()
    };

    const newTransaction = await transactionService.addTransaction(transactionData);
    
    return NextResponse.json({
      success: true,
      data: newTransaction
    }, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar transação:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 