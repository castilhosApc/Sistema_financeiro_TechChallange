"use client";

import React, { useState } from 'react';
import Button from './Button';
import Input from './Input';
import { findContactByPixKey, createContact } from '../../actions/contacts';
import { useFormMessages } from '../../hooks/useFormMessages';
import ErrorAlert from './ErrorAlert';
import SuccessAlert from './SuccessAlert';

const PixContactSearch = ({ onContactSelect, onCancel }) => {
  const [pixKey, setPixKey] = useState('');
  const [pixKeyType, setPixKeyType] = useState('EMAIL');
  const [foundContact, setFoundContact] = useState(null);
  const [showNewContactForm, setShowNewContactForm] = useState(false);
  
  const { message, isLoading, handleAsyncOperation, clearMessage } = useFormMessages('CONTACTS');

  const pixKeyTypes = [
    { value: 'EMAIL', label: 'E-mail' },
    { value: 'CPF', label: 'CPF' },
    { value: 'CNPJ', label: 'CNPJ' },
    { value: 'PHONE', label: 'Telefone' },
    { value: 'RANDOM', label: 'Chave Aleatória' }
  ];

  const handleSearch = async () => {
    if (!pixKey.trim()) {
      return;
    }

    await handleAsyncOperation(async () => {
      const contact = await findContactByPixKey(pixKey.trim());
      if (contact) {
        setFoundContact(contact);
        setShowNewContactForm(false);
      } else {
        setFoundContact(null);
        setShowNewContactForm(true);
      }
      return { success: true, contact };
    });
  };

  const handleCreateNewContact = async (formData) => {
    await handleAsyncOperation(async () => {
      const newContact = await createContact(formData);
      onContactSelect(newContact.contact);
      return { success: true, contact: newContact.contact };
    });
  };

  const handleSelectContact = () => {
    onContactSelect(foundContact);
  };

  return (
    <div className="space-y-6">
      {/* Mensagens de erro ou sucesso */}
      {message.type === 'error' && (
        <ErrorAlert 
          error={{ message: message.text }} 
          context="CONTACTS"
          onClose={clearMessage}
        />
      )}

      {message.type === 'success' && (
        <SuccessAlert 
          message={message.text}
          context="CONTACTS"
          onClose={clearMessage}
        />
      )}

      {/* Busca por chave PIX */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-800 dark:text-white mb-2">
            Tipo de Chave PIX
          </label>
          <select
            value={pixKeyType}
            onChange={(e) => setPixKeyType(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          >
            {pixKeyTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-800 dark:text-white mb-2">
            Chave PIX
          </label>
          <div className="flex space-x-3">
            <Input
              id="pixKey"
              name="pixKey"
              type="text"
              value={pixKey}
              onChange={(e) => setPixKey(e.target.value)}
              placeholder={`Digite a ${pixKeyType.toLowerCase()}`}
              className="flex-1"
            />
            <Button
              onClick={handleSearch}
              disabled={isLoading || !pixKey.trim()}
              className="px-6 py-3"
            >
              {isLoading ? '🔍' : '🔍'}
            </Button>
          </div>
        </div>
      </div>

      {/* Contato encontrado */}
      {foundContact && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
          <h3 className="font-medium text-green-800 dark:text-green-200 mb-3">
            Contato Encontrado
          </h3>
          <div className="text-sm text-green-700 dark:text-green-300 mb-4">
            <p><strong>Nome:</strong> {foundContact.name}</p>
            {foundContact.email && <p><strong>E-mail:</strong> {foundContact.email}</p>}
            {foundContact.phone && <p><strong>Telefone:</strong> {foundContact.phone}</p>}
            {foundContact.pixKey && <p><strong>Chave PIX:</strong> {foundContact.pixKey}</p>}
          </div>
          <div className="flex space-x-3">
            <Button
              onClick={handleSelectContact}
              variant="primary"
              size="sm"
            >
              Selecionar Contato
            </Button>
            <Button
              onClick={() => setFoundContact(null)}
              variant="outline"
              size="sm"
            >
              Buscar Outro
            </Button>
          </div>
        </div>
      )}

      {/* Formulário para novo contato */}
      {showNewContactForm && !foundContact && (
        <NewContactForm
          pixKey={pixKey}
          pixKeyType={pixKeyType}
          onSubmit={handleCreateNewContact}
          onCancel={() => setShowNewContactForm(false)}
        />
      )}

      {/* Botão cancelar */}
      <div className="flex justify-end pt-4">
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

const NewContactForm = ({ pixKey, pixKeyType, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    pixKey,
    pixKeyType
  });

  const [errors, setErrors] = useState({});

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
           <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
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

export default PixContactSearch; 