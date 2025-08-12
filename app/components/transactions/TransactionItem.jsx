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
import { getErrorMessage, getSuccessMessage } from '../../utils/errorMessages';

const TransactionItem = ({ transaction, contacts }) => {
  const { showNotification } = useNotification();
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  // Verificação de segurança
  if (!transaction) {
    return (
      <div className="flex items-center justify-between py-3 px-4 border-b border-gray-200 dark:border-gray-700">
        <div className="text-gray-600 dark:text-gray-300">Transação inválida</div>
      </div>
    );
  }

  const isCredit = transaction.type === 'DEPOSIT';
  const amountClass = isCredit ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
  
  const contact = transaction.contactId ? contacts.find(c => c.id === transaction.contactId) : null;

  const handleDelete = async () => {
    try {
      await deleteTransaction(transaction.id);
      showNotification(getSuccessMessage('TRANSACTION_DELETE'), 'success');
    } catch (error) {
      const errorMessage = getErrorMessage(error, 'TRANSACTIONS');
      showNotification(errorMessage, 'error');
    }
  };

  return (
    <>
      <div className="flex items-center justify-between py-3 px-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
        <div className="flex items-center space-x-3 flex-1">
          {/* Ícone do tipo de transação */}
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isCredit ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'
          }`}>
            <span className={`text-lg ${isCredit ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {isCredit ? '📥' : '📤'}
            </span>
          </div>

          {/* Informações da transação */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white truncate">
                  {transaction.description || (isCredit ? 'Depósito' : 'Saque')}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {contact ? contact.name : 'Contato não encontrado'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatDate(transaction.date)}
                </p>
              </div>
              <div className="text-right ml-4">
                <p className={`font-semibold text-lg ${amountClass}`}>
                  {formatCurrency(Math.abs(transaction.amount))}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                  {transaction.type === 'DEPOSIT' ? 'Entrada' : 'Saída'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Botões de ação */}
        <div className="flex items-center space-x-2 ml-4">
          <TransactionFormWrapper
            transaction={transaction}
            contacts={contacts}
            trigger={
              <Button variant="outline" size="sm">
                ✏️ Editar
              </Button>
            }
          />
          
          <Button
            onClick={() => setShowConfirmDelete(true)}
            variant="outline"
            size="sm"
            className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            🗑️ Excluir
          </Button>
        </div>
      </div>

      {/* Modal de confirmação de exclusão */}
      <ClientOnly>
        <ConfirmModal
          isOpen={showConfirmDelete}
          onClose={() => setShowConfirmDelete(false)}
          onConfirm={handleDelete}
          title="Confirmar Exclusão"
          message={`Tem certeza que deseja excluir esta transação de ${formatCurrency(Math.abs(transaction.amount))}?`}
          confirmText="Excluir"
          cancelText="Cancelar"
          variant="danger"
        />
      </ClientOnly>
    </>
  );
};

TransactionItem.propTypes = {
  transaction: PropTypes.shape({
    id: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['DEPOSIT', 'WITHDRAW']).isRequired,
    amount: PropTypes.number.isRequired,
    description: PropTypes.string,
    date: PropTypes.string.isRequired,
    contactId: PropTypes.string,
    createdAt: PropTypes.string,
    updatedAt: PropTypes.string
  }).isRequired,
  contacts: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string,
    phone: PropTypes.string,
    avatar: PropTypes.string
  })).isRequired
};

export default TransactionItem;