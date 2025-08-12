"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import Notification from '../components/ui/Notification';
import { getErrorMessage, getSuccessMessage } from '../utils/errorMessages';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp deve ser usado dentro de um AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({
    isVisible: false,
    message: '',
    type: 'info'
  });

  // Dados mockados para funcionamento temporário
  const mockUser = {
    id: 'cmdx6qa8g0000rbm8owfn1237',
    name: 'João Silva',
    email: 'joao.silva@email.com',
    avatar: '',
    role: 'user'
  };

  const mockTransactions = [
    {
      id: '1',
      type: 'DEPOSIT',
      amount: 5000.00,
      description: 'Salário',
      category: 'Renda',
      date: '2024-01-15',
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      type: 'WITHDRAW',
      amount: 250.50,
      description: 'Supermercado',
      category: 'Alimentação',
      date: '2024-01-14',
      createdAt: '2024-01-14'
    },
    {
      id: '3',
      type: 'TRANSFER',
      amount: 1000.00,
      description: 'Transferência para Maria',
      category: 'Transferência',
      date: '2024-01-13',
      createdAt: '2024-01-13'
    },
    {
      id: '4',
      type: 'DEPOSIT',
      amount: 1500.00,
      description: 'Freelance',
      category: 'Renda',
      date: '2024-01-12',
      createdAt: '2024-01-12'
    },
    {
      id: '5',
      type: 'WITHDRAW',
      amount: 120.00,
      description: 'Combustível',
      category: 'Transporte',
      date: '2024-01-11',
      createdAt: '2024-01-11'
    }
  ];

  const mockContacts = [
    {
      id: '1',
      name: 'Maria Santos',
      email: 'maria.santos@email.com',
      phone: '(11) 99999-8888',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      accountNumber: '002345678-9',
      bank: 'Itaú',
      type: 'Pessoa Física'
    },
    {
      id: '2',
      name: 'Pedro Oliveira',
      email: 'pedro.oliveira@email.com',
      phone: '(11) 88888-7777',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      accountNumber: '003456789-0',
      bank: 'Bradesco',
      type: 'Pessoa Física'
    },
    {
      id: '3',
      name: 'Ana Costa',
      email: 'ana.costa@email.com',
      phone: '(11) 77777-6666',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      accountNumber: '004567890-1',
      bank: 'Santander',
      type: 'Pessoa Física'
    },
    {
      id: '4',
      name: 'João Silva',
      email: 'joao.silva@email.com',
      phone: '(11) 66666-5555',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      accountNumber: '001234567-8',
      bank: 'Banco do Brasil',
      type: 'Pessoa Física'
    },
    {
      id: '5',
      name: 'Carlos Ferreira',
      email: 'carlos.ferreira@email.com',
      phone: '(11) 55555-4444',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      accountNumber: '005678901-2',
      bank: 'Caixa Econômica',
      type: 'Pessoa Física'
    }
  ];

  // Carregar dados iniciais
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Usar dados mockados por enquanto
      setUser(mockUser);
      setTransactions(mockTransactions);
      setContacts(mockContacts);

    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setError('Falha ao carregar dados da aplicação');
      showNotification(getErrorMessage(error, 'APP_LOAD'), 'error');
    } finally {
      setLoading(false);
    }
  };

  // Funções para transações
  const addTransaction = async (transactionData) => {
    try {
      const newTransaction = {
        id: Date.now().toString(),
        ...transactionData,
        createdAt: new Date().toISOString().split('T')[0],
        date: new Date(transactionData.date).toISOString().split('T')[0]
      };

      setTransactions(prev => [newTransaction, ...prev]);
      showNotification(getSuccessMessage('TRANSACTION'), 'success');
      return newTransaction;
    } catch (error) {
      const errorMessage = getErrorMessage(error, 'TRANSACTIONS');
      showNotification(errorMessage, 'error');
      throw error;
    }
  };

  const updateTransaction = async (transactionId, updateData) => {
    try {
      const updatedTransaction = {
        ...updateData,
        id: transactionId,
        updatedAt: new Date().toISOString().split('T')[0]
      };

      setTransactions(prev => 
        prev.map(t => t.id === transactionId ? updatedTransaction : t)
      );
      showNotification(getSuccessMessage('TRANSACTION_UPDATE'), 'success');
      return updatedTransaction;
    } catch (error) {
      const errorMessage = getErrorMessage(error, 'TRANSACTIONS');
      showNotification(errorMessage, 'error');
      throw error;
    }
  };

  const deleteTransaction = async (transactionId) => {
    try {
      setTransactions(prev => prev.filter(t => t.id !== transactionId));
      showNotification(getSuccessMessage('TRANSACTION_DELETE'), 'success');
    } catch (error) {
      const errorMessage = getErrorMessage(error, 'TRANSACTIONS');
      showNotification(errorMessage, 'error');
      throw error;
    }
  };

  // Funções para contatos
  const addContact = async (contactData) => {
    try {
      const newContact = {
        id: Date.now().toString(),
        ...contactData
      };

      setContacts(prev => [newContact, ...prev]);
      showNotification(getSuccessMessage('CONTACT'), 'success');
      return newContact;
    } catch (error) {
      const errorMessage = getErrorMessage(error, 'CONTACTS');
      showNotification(errorMessage, 'error');
      throw error;
    }
  };

  const updateContact = async (contactId, updateData) => {
    try {
      const updatedContact = {
        ...updateData,
        id: contactId
      };

      setContacts(prev => 
        prev.map(c => c.id === contactId ? updatedContact : c)
      );
      showNotification(getSuccessMessage('CONTACT_UPDATE'), 'success');
      return updatedContact;
    } catch (error) {
      const errorMessage = getErrorMessage(error, 'CONTACTS');
      showNotification(errorMessage, 'error');
      throw error;
    }
  };

  const deleteContact = async (contactId) => {
    try {
      setContacts(prev => prev.filter(c => c.id !== contactId));
      showNotification(getSuccessMessage('CONTACT_DELETE'), 'success');
    } catch (error) {
      const errorMessage = getErrorMessage(error, 'CONTACTS');
      showNotification(errorMessage, 'error');
      throw error;
    }
  };

  // Funções de notificação
  const showNotification = (message, type = 'info') => {
    setNotification({
      isVisible: true,
      message,
      type
    });

    setTimeout(() => {
      hideNotification();
    }, 5000);
  };

  const hideNotification = () => {
    setNotification(prev => ({
      ...prev,
      isVisible: false
    }));
  };

  // Função para calcular estatísticas
  const getStats = () => {
    const totalIncome = transactions
      .filter(t => t.type === 'DEPOSIT')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter(t => t.type === 'WITHDRAW' || t.type === 'TRANSFER')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const balance = totalIncome - totalExpenses;

    return {
      balance,
      income: totalIncome,
      expenses: totalExpenses,
      transactionCount: transactions.length
    };
  };

  const value = {
    user,
    transactions,
    contacts,
    loading,
    error,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addContact,
    updateContact,
    deleteContact,
    showNotification,
    hideNotification,
    getStats
  };

  return (
    <AppContext.Provider value={value}>
      {children}
      <Notification 
        isVisible={notification.isVisible}
        message={notification.message}
        type={notification.type}
        onClose={hideNotification}
      />
    </AppContext.Provider>
  );
}; 