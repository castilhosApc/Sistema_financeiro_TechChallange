"use client";

import { useState } from 'react';
import { useNotification } from '../components/providers/NotificationProvider';

export const useFormMessages = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { showNotification } = useNotification();

  const showSuccess = (message) => {
    // Só mostra sucesso quando explicitamente chamado
    if (message) {
      showNotification(message, 'success');
    }
  };

  const showError = (error) => {
    if (error?.message) {
      showNotification(error.message, 'error');
    } else if (typeof error === 'string') {
      showNotification(error, 'error');
    } else {
      showNotification('Ocorreu um erro inesperado', 'error');
    }
  };

  const handleAsyncOperation = async (operation, successMessage = null) => {
    setIsLoading(true);
    try {
      const result = await operation();
      
      // Só mostra sucesso se uma mensagem específica for fornecida
      if (successMessage && result?.success) {
        showSuccess(successMessage);
      }
      
      return result;
    } catch (error) {
      showError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    showSuccess,
    showError,
    handleAsyncOperation
  };
};
