"use client";

import React, { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import ContactSelect from '../ui/ContactSelect';
import { useAccount } from '../../contexts/AccountContext';
import { formatCurrency } from '../../utils/formatters';

const TransactionForm = ({ onSubmit, onCancel, onError }) => {
  const { accountBalance, hasSufficientBalance } = useAccount();
  
  const [formData, setFormData] = useState({
    type: 'DEPOSIT',
    amount: '',
    contactId: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Valor deve ser maior que zero';
    } else if (formData.type === 'WITHDRAW') {
      const amount = parseFloat(formData.amount);
      if (!hasSufficientBalance(amount)) {
        newErrors.amount = `Saldo insuficiente. Saldo disponível: ${formatCurrency(accountBalance)}`;
      }
    }
    
    if (!formData.contactId) {
      newErrors.contactId = 'Selecione um contato';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const transaction = {
        id: Date.now().toString(),
        ...formData,
        amount: parseFloat(formData.amount)
      };
      
      onSubmit(transaction);
    } else {
      // Mostrar notificação de erro se houver problemas de validação
      if (onError) {
        const errorMessage = Object.values(errors).join(', ');
        onError(errorMessage);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="mb-6">
        <label className="block text-lg font-semibold text-gray-900 mb-3">
          Tipo de Transação
        </label>
        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="type"
              value="DEPOSIT"
              checked={formData.type === 'DEPOSIT'}
              onChange={handleChange}
              className="mr-2 w-4 h-4"
            />
            <span className="text-base font-medium text-gray-900">Depósito</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="type"
              value="WITHDRAW"
              checked={formData.type === 'WITHDRAW'}
              onChange={handleChange}
              className="mr-2 w-4 h-4"
            />
            <span className="text-base font-medium text-gray-900">Transferência</span>
          </label>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-blue-800">Saldo Disponível:</span>
          <span className="text-lg font-bold text-blue-900">{formatCurrency(accountBalance)}</span>
        </div>
      </div>

      <Input
        label="Valor"
        id="amount"
        name="amount"
        type="number"
        step="0.01"
        min="0"
        value={formData.amount}
        onChange={handleChange}
        placeholder="0,00"
        error={errors.amount}
      />

      <ContactSelect
        label={formData.type === 'DEPOSIT' ? 'Remetente' : 'Destinatário'}
        id="contactId"
        name="contactId"
        value={formData.contactId}
        onChange={handleChange}
        error={errors.contactId}
        placeholder={formData.type === 'DEPOSIT' ? 'Selecione o remetente...' : 'Selecione o destinatário...'}
      />

      <Input
        label="Data"
        id="date"
        name="date"
        type="date"
        value={formData.date}
        onChange={handleChange}
      />

      <div className="flex gap-4 pt-6">
        <Button
          type="submit"
          variant="primary"
          className="flex-1 text-base font-semibold py-3"
        >
          {formData.type === 'DEPOSIT' ? 'Receber Depósito' : 'Enviar Transferência'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          className="flex-1 text-base font-semibold py-3"
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
};

export default TransactionForm; 