import { NextResponse } from 'next/server';
import { transactionService } from '../../../services/transactionService';

// GET - Buscar transação específica
export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    const transaction = await transactionService.getTransaction(id);
    
    return NextResponse.json({
      success: true,
      data: transaction
    });
  } catch (error) {
    console.error('Erro ao buscar transação:', error);
    return NextResponse.json(
      { error: 'Transação não encontrada' },
      { status: 404 }
    );
  }
}

// PUT - Atualizar transação
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    
    const updatedTransaction = await transactionService.updateTransaction(id, body);
    
    return NextResponse.json({
      success: true,
      data: updatedTransaction
    });
  } catch (error) {
    console.error('Erro ao atualizar transação:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// DELETE - Deletar transação
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    await transactionService.deleteTransaction(id);
    
    return NextResponse.json({
      success: true,
      message: 'Transação deletada com sucesso'
    });
  } catch (error) {
    console.error('Erro ao deletar transação:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 