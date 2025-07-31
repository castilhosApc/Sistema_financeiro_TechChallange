"use client";

import React, { useState } from 'react';
import BalanceDisplay from '../components/transactions/BalanceDisplay';
import TransactionItem from '../components/transactions/TransactionItem';
import TransactionForm from '../components/transactions/TransactionForm';
import TransactionEditForm from '../components/transactions/TransactionEditForm';
import WelcomeMessage from '../components/ui/WelcomeMessage';
import Header from '../components/layout/Header';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import Notification from '../components/ui/Notification';
import { getContactById } from '../config/contacts';
import { useAccount } from '../contexts/AccountContext';

const Home = () => {
  const { 
    accountBalance, 
    transactions, 
    addTransaction, 
    updateTransaction 
  } = useAccount();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  
  // Estados para notificações
  const [notification, setNotification] = useState({
    isVisible: false,
    message: '',
    type: 'success'
  });

  const showNotification = (message, type = 'success') => {
    setNotification({
      isVisible: true,
      message,
      type
    });
  };

  const hideNotification = () => {
    setNotification(prev => ({
      ...prev,
      isVisible: false
    }));
  };

  const handleAddTransaction = (newTransaction) => {
    try {
      const contact = getContactById(newTransaction.contactId);
      const contactName = contact ? contact.name : 'Contato desconhecido';
      
      addTransaction(newTransaction);
      setIsModalOpen(false);
      
      const message = newTransaction.type === 'DEPOSIT' 
        ? `Depósito de ${formatCurrency(newTransaction.amount)} recebido de ${contactName}! ✅`
        : `Transferência de ${formatCurrency(newTransaction.amount)} enviada para ${contactName}! ✅`;
      
      showNotification(message, 'success');
    } catch (error) {
      showNotification(error.message, 'error');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setIsEditModalOpen(true);
  };

  const handleUpdateTransaction = (updatedTransaction) => {
    try {
      const contact = getContactById(updatedTransaction.contactId);
      const contactName = contact ? contact.name : 'Contato desconhecido';
      
      updateTransaction(updatedTransaction);
      setIsEditModalOpen(false);
      setEditingTransaction(null);
      
      const message = updatedTransaction.type === 'DEPOSIT' 
        ? `Depósito de ${formatCurrency(updatedTransaction.amount)} de ${contactName} atualizado! ✅`
        : `Transferência de ${formatCurrency(updatedTransaction.amount)} para ${contactName} atualizada! ✅`;
      
      showNotification(message, 'success');
    } catch (error) {
      showNotification(error.message, 'error');
    }
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingTransaction(null);
  };

  const handleFormError = (message) => {
    showNotification(message, 'error');
  };

  // Função auxiliar para formatar moeda
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Calcular receitas e despesas
  const income = transactions
    .filter(t => t.type === 'DEPOSIT')
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = transactions
    .filter(t => t.type === 'WITHDRAW')
    .reduce((sum, t) => sum + t.amount, 0);
  
  return (
    <div className="min-h-screen gradient-secondary dark:bg-secondary-900">
      <Header />
      
      <main className="p-8">
        <WelcomeMessage />
        
        <BalanceDisplay 
          balance={accountBalance} 
          income={income} 
          expenses={expenses}
          accountBalance={accountBalance}
        />
        
        <div className="mt-8 bg-white dark:bg-secondary-800 rounded-2xl shadow-xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-secondary-900 dark:text-white">Histórico de Transações</h2>
            <Button
              onClick={() => setIsModalOpen(true)}
              variant="primary"
              size="sm"
            >
              + Nova Transação
            </Button>
          </div>
          
          <div className="divide-y divide-secondary-200 dark:divide-secondary-700">
            {transactions.length > 0 ? (
              transactions.map(transaction => (
                <TransactionItem 
                  key={transaction.id} 
                  transaction={transaction}
                  onEdit={handleEditTransaction}
                />
              ))
            ) : (
              <div className="py-12 text-center text-secondary-500 dark:text-secondary-400">
                <p className="text-lg">Nenhuma transação encontrada</p>
                <p className="text-sm mt-2">Comece adicionando sua primeira transação</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal para adicionar nova transação */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Nova Transação Bancária"
      >
        <TransactionForm
          onSubmit={handleAddTransaction}
          onCancel={handleCloseModal}
          onError={handleFormError}
        />
      </Modal>

      {/* Modal para editar transação */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        title="Editar Transação Bancária"
      >
        <TransactionEditForm
          transaction={editingTransaction}
          onSubmit={handleUpdateTransaction}
          onCancel={handleCloseEditModal}
          onError={handleFormError}
        />
      </Modal>

      {/* Sistema de Notificações */}
      <Notification
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={hideNotification}
        duration={4000}
      />
    </div>
  );
};

export default Home;