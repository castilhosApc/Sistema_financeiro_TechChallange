"use client";

import React from 'react';
import PropTypes from 'prop-types';
import Button from '../ui/Button';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { getContactById } from '../../config/contacts';

const TransactionItem = ({ transaction, onEdit }) => {
  // Verificação de segurança
  if (!transaction) {
    return (
      <div className="flex items-center justify-between py-3 px-4 border-b border-gray-100 dark:border-gray-700">
        <div className="text-gray-500 dark:text-gray-400">Transação inválida</div>
      </div>
    );
  }

  const isCredit = transaction.type === 'DEPOSIT';
  const amountClass = isCredit ? 'text-green-600' : 'text-red-600';
  const amountSign = isCredit ? '+' : '-';
  
  const contact = transaction.contactId ? getContactById(transaction.contactId) : null;

  return (
    <div className="flex items-center justify-between py-4 px-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors transaction-item-hover fade-in">
      <div className="flex items-center space-x-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
          isCredit ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'
        }`}>
          <span className={`text-xl ${isCredit ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {isCredit ? '⬆️' : '⬇️'}
          </span>
        </div>
        
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg">
            {isCredit ? 'Depósito' : 'Transferência'}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {contact ? `${contact.name} • ${contact.accountNumber}` : 'Contato não encontrado'}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            {formatDate(transaction.date)}
          </p>
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        <span className={`font-bold text-lg ${amountClass}`}>
          {amountSign} {formatCurrency(transaction.amount)}
        </span>
        
        <Button
          onClick={() => onEdit(transaction)}
          variant="secondary"
          size="sm"
          className="text-xs"
        >
          Editar
        </Button>
      </div>
    </div>
  );
};

TransactionItem.propTypes = {
  transaction: PropTypes.shape({
    id: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['DEPOSIT', 'WITHDRAW']).isRequired,
    amount: PropTypes.number.isRequired,
    date: PropTypes.string.isRequired,
    contactId: PropTypes.string
  }).isRequired,
  onEdit: PropTypes.func.isRequired
};

export default TransactionItem;