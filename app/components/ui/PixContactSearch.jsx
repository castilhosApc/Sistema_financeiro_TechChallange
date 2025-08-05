"use client";

import React, { useState } from 'react';
import Button from './Button';
import { findContactByPixKey, createContact } from '../../actions/contacts';
import { useNotification } from '../providers/NotificationProvider';

const PixContactSearch = ({ onContactSelect, onCancel }) => {
  const [pixKey, setPixKey] = useState('');
  const [pixKeyType, setPixKeyType] = useState('EMAIL');
  const [loading, setLoading] = useState(false);
  const [foundContact, setFoundContact] = useState(null);
  const [showNewContactForm, setShowNewContactForm] = useState(false);
  const { showNotification } = useNotification();

  const pixKeyTypes = [
    { value: 'EMAIL', label: 'E-mail' },
    { value: 'CPF', label: 'CPF' },
    { value: 'CNPJ', label: 'CNPJ' },
    { value: 'PHONE', label: 'Telefone' },
    { value: 'RANDOM', label: 'Chave Aleatória' }
  ];

  const handleSearch = async () => {
    if (!pixKey.trim()) {
      showNotification('Digite uma chave PIX', 'error');
      return;
    }

    setLoading(true);
    try {
      const contact = await findContactByPixKey(pixKey.trim());
      if (contact) {
        setFoundContact(contact);
        setShowNewContactForm(false);
      } else {
        setFoundContact(null);
        setShowNewContactForm(true);
      }
    } catch (error) {
      showNotification('Erro ao buscar contato: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
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

  const handleSelectContact = () => {
    onContactSelect(foundContact);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Buscar por Chave PIX
        </label>
        <div className="flex space-x-2">
          <select
            value={pixKeyType}
            onChange={(e) => setPixKeyType(e.target.value)}
            className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50"
          >
            {pixKeyTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={pixKey}
            onChange={(e) => setPixKey(e.target.value)}
            placeholder="Digite a chave PIX"
            className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
          />
          <Button
            onClick={handleSearch}
            disabled={loading}
            variant="primary"
            size="sm"
          >
            {loading ? 'Buscando...' : 'Buscar'}
          </Button>
        </div>
      </div>

      {foundContact && (
        <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
          <h3 className="font-semibold text-green-400 mb-2">Contato Encontrado</h3>
          <div className="flex items-center space-x-3">
            <img
              src={foundContact.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'}
              alt={foundContact.name}
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1">
              <p className="font-medium text-white">{foundContact.name}</p>
              <p className="text-sm text-gray-300">
                {foundContact.pixKeyType}: {foundContact.pixKey}
              </p>
            </div>
            <Button
              onClick={handleSelectContact}
              variant="primary"
              size="sm"
            >
              Selecionar
            </Button>
          </div>
        </div>
      )}

      {showNewContactForm && !foundContact && (
        <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
          <h3 className="font-semibold text-blue-400 mb-2">Contato não encontrado</h3>
          <p className="text-sm text-gray-300 mb-3">
            Deseja cadastrar um novo contato com esta chave PIX?
          </p>
          <NewContactForm
            pixKey={pixKey}
            pixKeyType={pixKeyType}
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

const NewContactForm = ({ pixKey, pixKeyType, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    pixKey,
    pixKeyType
  });

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

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
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

      <div className="flex space-x-2">
        <Button
          type="submit"
          variant="primary"
          size="sm"
          className="flex-1"
        >
          Cadastrar
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
    </form>
  );
};

export default PixContactSearch; 