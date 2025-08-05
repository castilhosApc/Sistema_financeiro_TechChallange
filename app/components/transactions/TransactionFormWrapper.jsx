"use client";

import React, { useState } from 'react';
import Modal from '../ui/Modal';
import TransactionForm from './TransactionForm';
import ClientOnly from '../ui/ClientOnly';
import { useNotification } from '../providers/NotificationProvider';
import { createTransaction, updateTransaction } from '../../actions/transactions';

export default function TransactionFormWrapper({ 
  transaction, 
  contacts, 
  trigger,
  title = transaction ? "Editar Transação" : "Nova Transação"
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { showNotification } = useNotification();

  const handleSubmit = async (transactionData) => {
    try {
      // Converter objeto JavaScript para FormData
      const formData = new FormData();
      formData.append('type', transactionData.type);
      formData.append('amount', transactionData.amount.toString());
      formData.append('description', transactionData.description || '');
      formData.append('category', transactionData.category || '');
      formData.append('date', transactionData.date);
      formData.append('contactId', transactionData.contactId || '');

      if (transaction) {
        await updateTransaction(transaction.id, formData);
        showNotification('Transação atualizada com sucesso!', 'success');
      } else {
        await createTransaction(formData);
        showNotification('Transação criada com sucesso!', 'success');
      }
      setIsOpen(false);
    } catch (error) {
      showNotification('Erro ao salvar transação: ' + error.message, 'error');
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  return (
    <ClientOnly fallback={<div className="cursor-pointer">{trigger}</div>}>
      <div onClick={() => setIsOpen(true)} className="cursor-pointer">
        {trigger}
      </div>
      
      <Modal
        isOpen={isOpen}
        onClose={handleCancel}
        title={title}
        size="lg"
      >
        <TransactionForm
          transaction={transaction}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          contacts={contacts}
        />
      </Modal>
    </ClientOnly>
  );
} 