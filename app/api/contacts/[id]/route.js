import { NextResponse } from 'next/server';
import { contactService } from '../../../services/contactService';

// GET - Buscar contato específico
export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    const contact = await contactService.getContact(id);
    
    return NextResponse.json({
      success: true,
      data: contact
    });
  } catch (error) {
    console.error('Erro ao buscar contato:', error);
    return NextResponse.json(
      { error: 'Contato não encontrado' },
      { status: 404 }
    );
  }
}

// PUT - Atualizar contato
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    
    const updatedContact = await contactService.updateContact(id, body);
    
    return NextResponse.json({
      success: true,
      data: updatedContact
    });
  } catch (error) {
    console.error('Erro ao atualizar contato:', error);
    return NextResponse.json(
      { error: error.message || 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// DELETE - Deletar contato
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    await contactService.deleteContact(id);
    
    return NextResponse.json({
      success: true,
      message: 'Contato deletado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao deletar contato:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 