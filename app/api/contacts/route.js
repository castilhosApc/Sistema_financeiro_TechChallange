import { NextResponse } from 'next/server';
import { contactService } from '../../services/contactService';

// GET - Buscar contatos
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const search = searchParams.get('search');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'userId é obrigatório' },
        { status: 400 }
      );
    }

    let contacts;
    if (search) {
      contacts = await contactService.searchContacts(userId, search);
    } else {
      contacts = await contactService.getUserContacts(userId);
    }
    
    return NextResponse.json({
      success: true,
      data: contacts
    });
  } catch (error) {
    console.error('Erro na API de contatos:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// POST - Criar novo contato
export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, name, email, phone, avatar } = body;
    
    if (!userId || !name) {
      return NextResponse.json(
        { error: 'userId e name são obrigatórios' },
        { status: 400 }
      );
    }

    const contactData = {
      userId,
      name,
      email: email || null,
      phone: phone || null,
      avatar: avatar || null
    };

    const newContact = await contactService.createContact(contactData);
    
    return NextResponse.json({
      success: true,
      data: newContact
    }, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar contato:', error);
    return NextResponse.json(
      { error: error.message || 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 