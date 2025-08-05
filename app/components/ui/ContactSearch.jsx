"use client";

import React, { useState, useEffect } from 'react';
import Button from './Button';
import { searchContacts, createContact } from '../../actions/contacts';
import { useNotification } from '../providers/NotificationProvider';

const ContactSearch = ({ onContactSelect, onCancel }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showNewContactForm, setShowNewContactForm] = useState(false);
  const { showNotification } = useNotification();

  // Debounce para busca
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.trim().length >= 2) {
        performSearch();
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const performSearch = async () => {
    setLoading(true);
    try {
      const results = await searchContacts(searchTerm.trim());
      setSearchResults(results);
    } catch (error) {
      showNotification('Erro ao buscar contatos: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleContactSelect = (contact) => {
    onContactSelect(contact);
  };

  const handleCreateNewContact = async (formData) => {
    try {
      const newContact = await createContact(formData);
      showNotification('Contato criado com sucesso!', 'success');
      onContactSelect(newContact.contact);
    } catch (error) {
      showNotification('Erro ao criar contato: ' + error.message, 'error');
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Buscar Contato
        </label>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Digite nome, PIX, email ou telefone..."
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
        />
      </div>

      {loading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
          <p className="text-white/70 mt-2">Buscando...</p>
        </div>
      )}

      {searchResults.length > 0 && !loading && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-white/70">Contatos Encontrados</h3>
          {searchResults.map(contact => (
            <div
              key={contact.id}
              className="bg-white/10 border border-white/20 rounded-lg p-3 hover:bg-white/20 transition-colors cursor-pointer"
              onClick={() => handleContactSelect(contact)}
            >
              <div className="flex items-center space-x-3">
                <img
                  src={contact.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'}
                  alt={contact.name}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                  <p className="font-medium text-white">{contact.name}</p>
                  <p className="text-sm text-gray-300">
                    {contact.pixKey && `${contact.pixKeyType}: ${contact.pixKey}`}
                    {!contact.pixKey && contact.phone && `Tel: ${contact.phone}`}
                    {!contact.pixKey && !contact.phone && contact.email && `Email: ${contact.email}`}
                  </p>
                  {contact.bankName && (
                    <p className="text-xs text-gray-400">
                      {contact.bankName} - {contact.accountNumber}
                    </p>
                  )}
                </div>
                <Button
                  variant="primary"
                  size="sm"
                >
                  Selecionar
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {searchTerm.trim().length >= 2 && searchResults.length === 0 && !loading && (
        <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
          <h3 className="font-semibold text-blue-400 mb-2">Contato não encontrado</h3>
          <p className="text-sm text-gray-300 mb-3">
            Deseja cadastrar um novo contato?
          </p>
          <NewContactForm
            searchTerm={searchTerm}
            onSubmit={handleCreateNewContact}
            onCancel={() => setShowNewContactForm(false)}
          />
        </div>
      )}

      <div className="flex space-x-2">
        <Button
          onClick={onCancel}
          variant="outline"
          size="sm"
        >
          Cancelar
        </Button>
      </div>
    </div>
  );
};

const NewContactForm = ({ searchTerm, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    pixKey: '',
    pixKeyType: 'EMAIL',
    bankName: '',
    accountType: 'PESSOA_FISICA',
    accountNumber: ''
  });

  const pixKeyTypes = [
    { value: 'EMAIL', label: 'E-mail' },
    { value: 'CPF', label: 'CPF' },
    { value: 'CNPJ', label: 'CNPJ' },
    { value: 'PHONE', label: 'Telefone' },
    { value: 'RANDOM', label: 'Chave Aleatória' }
  ];

  const banks = [
    'Banco do Brasil',
    'Itaú',
    'Santander',
    'Bradesco',
    'Caixa Econômica Federal',
    'Nubank',
    'Inter',
    'C6 Bank',
    'Banco Safra',
    'Banco Votorantim',
    'Outro'
  ];

  const accountTypes = [
    { value: 'PESSOA_FISICA', label: 'Pessoa Física' },
    { value: 'PESSOA_JURIDICA', label: 'Pessoa Jurídica' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });
    onSubmit(data);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Tentar preencher automaticamente baseado no searchTerm
  useEffect(() => {
    if (searchTerm) {
      // Se parece ser um email
      if (searchTerm.includes('@')) {
        setFormData(prev => ({
          ...prev,
          email: searchTerm,
          pixKey: searchTerm,
          pixKeyType: 'EMAIL'
        }));
      }
      // Se parece ser um CPF
      else if (searchTerm.replace(/\D/g, '').length === 11) {
        setFormData(prev => ({
          ...prev,
          pixKey: searchTerm,
          pixKeyType: 'CPF'
        }));
      }
      // Se parece ser um telefone
      else if (searchTerm.replace(/\D/g, '').length >= 10) {
        setFormData(prev => ({
          ...prev,
          phone: searchTerm,
          pixKey: searchTerm,
          pixKeyType: 'PHONE'
        }));
      }
      // Se não parece ser nenhum dos acima, pode ser um nome
      else {
        setFormData(prev => ({
          ...prev,
          name: searchTerm
        }));
      }
    }
  }, [searchTerm]);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-white mb-1">
          Nome *
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          required
          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
          placeholder="Nome do contato"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-1">
          E-mail
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
          placeholder="email@exemplo.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-1">
          Telefone
        </label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
          placeholder="(11) 99999-9999"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-1">
          Tipo de Pessoa
        </label>
        <select
          value={formData.accountType}
          onChange={(e) => handleChange('accountType', e.target.value)}
          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50"
        >
          {accountTypes.map(type => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-1">
          Banco
        </label>
        <select
          value={formData.bankName}
          onChange={(e) => handleChange('bankName', e.target.value)}
          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50"
        >
          <option value="">Selecione um banco</option>
          {banks.map(bank => (
            <option key={bank} value={bank}>
              {bank}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-1">
          Número da Conta
        </label>
        <input
          type="text"
          value={formData.accountNumber}
          onChange={(e) => handleChange('accountNumber', e.target.value)}
          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
          placeholder="12345-6"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-1">
          Tipo de Chave PIX
        </label>
        <select
          value={formData.pixKeyType}
          onChange={(e) => handleChange('pixKeyType', e.target.value)}
          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50"
        >
          {pixKeyTypes.map(type => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-1">
          Chave PIX
        </label>
        <input
          type="text"
          value={formData.pixKey}
          onChange={(e) => handleChange('pixKey', e.target.value)}
          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
          placeholder="Digite a chave PIX"
        />
      </div>

      <div className="flex space-x-2">
        <Button
          onClick={handleSubmit}
          variant="primary"
          size="sm"
          className="flex-1"
        >
          Cadastrar
        </Button>
        <Button
          onClick={onCancel}
          variant="outline"
          size="sm"
          className="flex-1"
        >
          Cancelar
        </Button>
      </div>
    </div>
  );
};

export default ContactSearch; 