"use client";

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '../ui/Button';
import { formatCurrency, formatDate } from '../../utils/formatters';
import TransactionFormWrapper from './TransactionFormWrapper';
import ConfirmModal from '../ui/ConfirmModal';
import ClientOnly from '../ui/ClientOnly';
import { useNotification } from '../providers/NotificationProvider';
import { deleteTransaction } from '../../actions/transactions';

const TransactionItem = ({ transaction, contacts }) => {
  const { showNotification } = useNotification();
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  // Verificação de segurança
  if (!transaction) {
    return (
      <div className="flex items-center justify-between py-3 px-4 border-b border-gray-100 dark:border-secondary-700">
        <div className="text-secondary-custom dark:text-secondary-400">Transação inválida</div>
      </div>
    );
  }

  const isCredit = transaction.type === 'DEPOSIT';
  const amountClass = isCredit ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
  
  const contact = transaction.contactId ? contacts.find(c => c.id === transaction.contactId) : null;

  const handleDelete = async () => {
    try {
      await deleteTransaction(transaction.id);
      showNotification('Transação excluída com sucesso!', 'success');
    } catch (error) {
      showNotification('Erro ao excluir transação: ' + error.message, 'error');
    }
  };

  return (
    <div className="flex items-center justify-between py-4 px-4 border-b border-gray-200 dark:border-secondary-700 hover:bg-gray-50 dark:hover:bg-secondary-700 transition-colors transaction-item-hover fade-in">
      <div className="flex items-center space-x-4 flex-1">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
          isCredit ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'
        }`}>
          <span className={`text-xl ${isCredit ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {isCredit ? '⬆️' : '⬇️'}
          </span>
        </div>
        
        <div className="flex-1">
          <h3 className="font-semibold text-primary-custom dark:text-white text-lg">
            {transaction.description || (isCredit ? 'Depósito' : 'Transferência')}
          </h3>
          <p className="text-sm text-secondary-custom dark:text-secondary-400">
            {contact ? `${contact.name} • ${contact.phone || 'Sem telefone'}` : transaction.category || 'Categoria não definida'}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            {formatDate(transaction.date)}
          </p>
        </div>
      </div>
      
      <div className="flex items-center space-x-3 ml-4">
        <span className={`font-bold text-lg ${amountClass} min-w-[120px] text-right`}>
          {formatCurrency(Math.abs(transaction.amount))}
        </span>
        
        <div className="flex space-x-2">
          <TransactionFormWrapper
            transaction={transaction}
            contacts={contacts}
            trigger={
              <Button
                variant="secondary"
                size="sm"
                className="text-xs"
              >
                Editar
              </Button>
            }
          />
          
          <ClientOnly>
            <Button
              onClick={() => setShowConfirmDelete(true)}
              variant="outline"
              size="sm"
              className="text-xs text-red-600 hover:text-red-700"
            >
              Excluir
            </Button>
          </ClientOnly>
        </div>
      </div>

      <ClientOnly>
        <ConfirmModal
          isOpen={showConfirmDelete}
          onClose={() => setShowConfirmDelete(false)}
          onConfirm={handleDelete}
          title="Excluir Transação"
          message={`Tem certeza que deseja excluir a transação "${transaction.description || 'sem descrição'}"?`}
          confirmText="Excluir"
          cancelText="Cancelar"
          type="danger"
        />
      </ClientOnly>
    </div>
  );
};

TransactionItem.propTypes = {
  transaction: PropTypes.shape({
    id: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['DEPOSIT', 'WITHDRAW', 'TRANSFER']).isRequired,
    amount: PropTypes.number.isRequired,
    description: PropTypes.string,
    category: PropTypes.string,
    date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]).isRequired,
    contactId: PropTypes.string
  }).isRequired,
  contacts: PropTypes.array.isRequired
};

export default TransactionItem;