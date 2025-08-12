"use client";

import React, { useState, useEffect } from 'react';
import Button from './Button';
import Input from './Input';
import { searchContacts, createContact } from '../../actions/contacts';
import { useFormMessages } from '../../hooks/useFormMessages';

const ContactSearch = ({ onContactSelect, onCancel }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showNewContactForm, setShowNewContactForm] = useState(false);
  
  const { isLoading, handleAsyncOperation } = useFormMessages();

  // Debounce para busca
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm && searchTerm.trim().length >= 2) {
        performSearch();
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const performSearch = async () => {
    if (!searchTerm || typeof searchTerm !== 'string') {
      setSearchResults([]);
      return;
    }
    
    await handleAsyncOperation(async () => {
      const results = await searchContacts(searchTerm.trim());
      setSearchResults(results);
      return { success: true, results };
    });
  };

  const handleContactSelect = (contact) => {
    onContactSelect(contact);
  };

  const handleCreateNewContact = async (formData) => {
    await handleAsyncOperation(async () => {
      const newContact = await createContact(formData);
      onContactSelect(newContact.contact);
      return { success: true, contact: newContact.contact };
    });
  };

  return (
    <div className="space-y-4">
      {/* Mensagens de erro ou sucesso são tratadas pelo useFormMessages */}

      {/* Campo de busca */}
      <div>
        <label className="block text-sm font-medium text-gray-800 dark:text-white mb-2">
          Buscar Contatos
        </label>
        <input
          type="text"
          value={searchTerm || ''}
          onChange={(e) => setSearchTerm(e.target.value || '')}
          placeholder="Digite o nome, e-mail ou telefone..."
          className="w-full px-3 py-2 bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-white/50"
        />
      </div>

      {/* Resultados da busca */}
      {isLoading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Buscando contatos...</p>
        </div>
      )}

      {searchResults.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-800 dark:text-white">
            Contatos Encontrados ({searchResults.length})
          </h3>
          {searchResults.map(contact => (
            <div
              key={contact.id}
              onClick={() => handleContactSelect(contact)}
              className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            >
              <img
                src={contact.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'}
                alt={contact.name}
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-white">{contact.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {contact.email || contact.phone || 'Sem informações de contato'}
                </p>
              </div>
              <Button
                variant="primary"
                size="sm"
              >
                Selecionar
              </Button>
            </div>
          ))}
        </div>
      )}

      {searchResults.length === 0 && !isLoading && searchTerm && searchTerm.trim().length >= 2 && (
        <div className="text-center py-4">
          <p className="text-gray-600 dark:text-gray-300 mb-4">Nenhum contato encontrado</p>
          <Button
            onClick={() => setShowNewContactForm(true)}
            variant="primary"
            size="sm"
          >
            Cadastrar Novo Contato
          </Button>
        </div>
      )}

      {showNewContactForm && (
        <NewContactForm
          searchTerm={searchTerm || ''}
          onSubmit={handleCreateNewContact}
          onCancel={() => setShowNewContactForm(false)}
        />
      )}
    </div>
  );
};

const NewContactForm = ({ searchTerm = '', onSubmit, onCancel }) => {
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

  const [errors, setErrors] = useState({});

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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }

    if (formData.phone && !/^\(\d{2}\) \d{5}-\d{4}$/.test(formData.phone)) {
      newErrors.phone = 'Telefone deve estar no formato (11) 99999-9999';
    }

    if (formData.pixKey && !formData.pixKey.trim()) {
      newErrors.pixKey = 'Chave PIX é obrigatória se o tipo for selecionado';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value.trim()) {
        data.append(key, value.trim());
      }
    });
    onSubmit(data);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const formatPhone = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      const match = numbers.match(/^(\d{2})(\d{5})(\d{4})$/);
      if (match) {
        return `(${match[1]}) ${match[2]}-${match[3]}`;
      }
    }
    return value;
  };

  const handlePhoneChange = (value) => {
    const formatted = formatPhone(value);
    handleChange('phone', formatted);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
        Cadastrar Novo Contato
      </h3>

      <div className="space-y-4">
        <Input
          label="Nome *"
          id="name"
          name="name"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          required
          placeholder="Nome completo do contato"
          error={errors.name}
        />

        <Input
          label="E-mail"
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          placeholder="email@exemplo.com"
          error={errors.email}
        />

        <Input
          label="Telefone"
          id="phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => handlePhoneChange(e.target.value)}
          placeholder="(11) 99999-9999"
          error={errors.phone}
        />

        <div>
          <label className="block text-sm font-medium text-gray-800 dark:text-white mb-2">
            Tipo de Pessoa
          </label>
          <select
            value={formData.accountType}
            onChange={(e) => handleChange('accountType', e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          >
            {accountTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-800 dark:text-white mb-2">
            Banco
          </label>
          <select
            value={formData.bankName}
            onChange={(e) => handleChange('bankName', e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          >
            <option value="">Selecione um banco</option>
            {banks.map(bank => (
              <option key={bank} value={bank}>
                {bank}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Número da Conta"
          id="accountNumber"
          name="accountNumber"
          value={formData.accountNumber}
          onChange={(e) => handleChange('accountNumber', e.target.value)}
          placeholder="Número da conta bancária"
        />

        <div>
          <label className="block text-sm font-medium text-gray-800 dark:text-white mb-2">
            Chave PIX
          </label>
          <div className="grid grid-cols-2 gap-3">
            <select
              value={formData.pixKeyType}
              onChange={(e) => handleChange('pixKeyType', e.target.value)}
              className="px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            >
              {pixKeyTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            <Input
              id="pixKey"
              name="pixKey"
              value={formData.pixKey}
              onChange={(e) => handleChange('pixKey', e.target.value)}
              placeholder="Chave PIX"
              error={errors.pixKey}
            />
          </div>
        </div>

        <div className="flex space-x-3 pt-4">
          <Button
            type="button"
            onClick={handleSubmit}
            variant="primary"
            size="sm"
            className="flex-1"
          >
            Criar Contato
          </Button>
          <Button
            type="button"
            onClick={onCancel}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ContactSearch; 