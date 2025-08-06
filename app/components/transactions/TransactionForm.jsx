"use client";

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from '../ui/Button';
import CustomSelect from '../ui/CustomSelect';
import ClientOnly from '../ui/ClientOnly';
import ContactSearch from '../ui/ContactSearch';

const TransactionForm = ({ transaction, onSubmit, onCancel, contacts = [] }) => {
  const [formData, setFormData] = useState({
    type: 'WITHDRAW',
    amount: '',
    date: '',
    contactId: '',
    description: ''
  });

  const [errors, setErrors] = useState({});
  const [showContactSearch, setShowContactSearch] = useState(false);

  useEffect(() => {
    // Set default date only on client side
    const defaultDate = new Date().toISOString().split('T')[0];
    
    if (transaction) {
      setFormData({
        type: transaction.type || 'WITHDRAW',
        amount: transaction.amount ? Math.abs(transaction.amount).toString() : '',
        date: transaction.date ? new Date(transaction.date).toISOString().split('T')[0] : defaultDate,
        contactId: transaction.contactId || '',
        description: transaction.description || ''
      });
    } else {
      setFormData(prev => ({
        ...prev,
        date: defaultDate
      }));
    }
  }, [transaction]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Valor deve ser maior que zero';
    }

    if (!formData.date) {
      newErrors.date = 'Data é obrigatória';
    }

    if (!formData.contactId) {
      newErrors.contactId = 'Contato é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const amount = parseFloat(formData.amount);
    // Sempre enviar valor positivo, o sinal será tratado pela lógica de negócio
    const finalAmount = formData.type === 'WITHDRAW' ? -Math.abs(amount) : Math.abs(amount);

    onSubmit({
      ...formData,
      amount: finalAmount
    });
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleContactSelect = (contact) => {
    setFormData(prev => ({ ...prev, contactId: contact.id }));
    setShowContactSearch(false);
  };

  // Preparar opções para o CustomSelect
  const contactOptions = contacts.map(contact => ({
    value: contact.id,
    label: `${contact.name} - ${contact.pixKey || contact.phone || 'Sem PIX'}`
  }));

  return (
    <ClientOnly fallback={
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    }>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tipo de Transação */}
        <div>
          <label className="block text-sm font-medium text-gray-800 dark:text-white mb-2">
            Tipo de Transação
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleInputChange('type', 'WITHDRAW')}
              className={`p-3 rounded-lg border-2 transition-all ${
                formData.type === 'WITHDRAW'
                  ? 'border-red-500 bg-red-500/20 text-red-600 dark:text-red-400'
                  : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500'
              }`}
            >
              <div className="text-center">
                <div className="text-2xl mb-1">⬇️</div>
                <div className="text-sm font-medium">Transferência</div>
              </div>
            </button>
            
            <button
              type="button"
              onClick={() => handleInputChange('type', 'DEPOSIT')}
              className={`p-3 rounded-lg border-2 transition-all ${
                formData.type === 'DEPOSIT'
                  ? 'border-green-500 bg-green-500/20 text-green-600 dark:text-green-400'
                  : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500'
              }`}
            >
              <div className="text-center">
                <div className="text-2xl mb-1">⬆️</div>
                <div className="text-sm font-medium">Depósito</div>
              </div>
            </button>
          </div>
        </div>

        {/* Valor */}
        <div>
          <label className="block text-sm font-medium text-gray-800 dark:text-white mb-2">
            Valor
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
              R$
            </span>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={(e) => handleInputChange('amount', e.target.value)}
              className={`w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 ${
                errors.amount ? 'border-red-500 dark:border-red-400' : ''
              }`}
              placeholder="0,00"
            />
          </div>
          {errors.amount && (
            <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.amount}</p>
            )}
        </div>

        {/* Data */}
        <div>
          <label className="block text-sm font-medium text-gray-800 dark:text-white mb-2">
            Data
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => handleInputChange('date', e.target.value)}
            className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 ${
              errors.date ? 'border-red-500 dark:border-red-400' : ''
            }`}
          />
          {errors.date && (
            <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.date}</p>
          )}
        </div>

        {/* Contato */}
        <div>
          <label className="block text-sm font-medium text-gray-800 dark:text-white mb-2">
            Contato
          </label>
          
          {showContactSearch ? (
            <ContactSearch
              onContactSelect={handleContactSelect}
              onCancel={() => setShowContactSearch(false)}
            />
          ) : (
            <div className="space-y-2">
              <CustomSelect
                value={formData.contactId}
                onChange={(e) => handleInputChange('contactId', e.target.value)}
                options={contactOptions}
                placeholder="Selecione um contato"
                error={errors.contactId}
              />
              
              <Button
                type="button"
                onClick={() => setShowContactSearch(true)}
                variant="outline"
                size="sm"
                className="w-full"
              >
                🔍 Buscar ou Cadastrar Contato
              </Button>
            </div>
          )}
        </div>

        {/* Descrição */}
        <div>
          <label className="block text-sm font-medium text-gray-800 dark:text-white mb-2">
            Descrição (opcional)
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={3}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            placeholder="Descrição da transação..."
          />
        </div>

        {/* Botões */}
        <div className="flex space-x-3 pt-4">
          <Button
            type="submit"
            variant="primary"
            className="flex-1"
          >
            {transaction ? 'Atualizar' : 'Criar'} Transação
          </Button>
          
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1"
          >
            Cancelar
          </Button>
        </div>
      </form>
    </ClientOnly>
  );
};

TransactionForm.propTypes = {
  transaction: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  contacts: PropTypes.array
};

export default TransactionForm; 