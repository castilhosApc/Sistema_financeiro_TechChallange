import { NextResponse } from 'next/server';
import { clearAllAccountsExceptAdmin } from '../../../actions/user';

export async function POST(request) {
  try {
    // Verificar se é uma requisição POST
    if (request.method !== 'POST') {
      return NextResponse.json({ error: 'Método não permitido' }, { status: 405 });
    }

    // Executar a limpeza das contas
    const result = await clearAllAccountsExceptAdmin();
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Erro na API de limpeza:', error);
    return NextResponse.json(
      { error: error.message || 'Falha ao limpar contas' }, 
      { status: 500 }
    );
  }
}
