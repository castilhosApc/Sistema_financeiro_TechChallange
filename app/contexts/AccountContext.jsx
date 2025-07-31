"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

const AccountContext = createContext();

export const useAccount = () => {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error('useAccount must be used within an AccountProvider');
  }
  return context;
};

export const AccountProvider = ({ children }) => {
  const [accountBalance, setAccountBalance] = useState(5000.00); // Saldo inicial
  const [transactions, setTransactions] = useState([]);

  // Calcular saldo baseado nas transações
  const calculateBalance = (transactions) => {
    const income = transactions
      .filter(t => t.type === 'DEPOSIT')
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = transactions
      .filter(t => t.type === 'WITHDRAW')
      .reduce((sum, t) => sum + t.amount, 0);

    return 5000.00 + income - expenses; // Saldo inicial + transações
  };

  // Atualizar saldo quando transações mudarem
  useEffect(() => {
    const newBalance = calculateBalance(transactions);
    setAccountBalance(newBalance);
  }, [transactions]);

  // Adicionar transação
  const addTransaction = (transaction) => {
    // Verificar se há saldo suficiente para transferências
    if (transaction.type === 'WITHDRAW' && transaction.amount > accountBalance) {
      throw new Error('Saldo insuficiente para realizar esta transferência.');
    }

    const newTransaction = {
      ...transaction,
      id: Date.now().toString()
    };

    setTransactions(prev => [newTransaction, ...prev]);
    return newTransaction;
  };

  // Atualizar transação
  const updateTransaction = (updatedTransaction) => {
    // Verificar se há saldo suficiente para transferências
    if (updatedTransaction.type === 'WITHDRAW') {
      const currentTransaction = transactions.find(t => t.id === updatedTransaction.id);
      const balanceWithoutCurrent = accountBalance + (currentTransaction?.amount || 0);
      
      if (updatedTransaction.amount > balanceWithoutCurrent) {
        throw new Error('Saldo insuficiente para realizar esta transferência.');
      }
    }

    setTransactions(prev => 
      prev.map(t => 
        t.id === updatedTransaction.id ? updatedTransaction : t
      )
    );
    return updatedTransaction;
  };

  // Verificar se há saldo suficiente
  const hasSufficientBalance = (amount) => {
    return accountBalance >= amount;
  };

  // Obter saldo disponível
  const getAvailableBalance = () => {
    return accountBalance;
  };

  const value = {
    accountBalance,
    transactions,
    addTransaction,
    updateTransaction,
    hasSufficientBalance,
    getAvailableBalance
  };

  return (
    <AccountContext.Provider value={value}>
      {children}
    </AccountContext.Provider>
  );
}; 