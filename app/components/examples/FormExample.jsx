"use client";

import React from 'react';
import { useFormMessages } from '../../hooks/useFormMessages';
import ErrorAlert from '../ui/ErrorAlert';
import SuccessAlert from '../ui/SuccessAlert';
import Button from '../ui/Button';
import Input from '../ui/Input';

// Exemplo de uso do sistema de tratamento de erros
export default function FormExample() {
  const { 
    message, 
    isLoading, 
    handleAsyncOperation, 
    clearMessage 
  } = useFormMessages('EXAMPLE');

  // Simular uma operação assíncrona
  const handleSubmit = async (formData) => {
    await handleAsyncOperation(async () => {
      // Simular delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simular erro ou sucesso
      const shouldError = Math.random() > 0.5;
      
      if (shouldError) {
        throw new Error('Exemplo de erro simulado');
      }
      
      return { success: true, data: 'Operação realizada com sucesso!' };
    });
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Exemplo de Formulário
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Demonstra o sistema de tratamento de erros
        </p>
      </div>

      {/* Exibir mensagens de erro ou sucesso */}
      {message.type === 'error' && (
        <ErrorAlert 
          error={{ message: message.text }} 
          context="EXAMPLE"
          onClose={clearMessage}
        />
      )}

      {message.type === 'success' && (
        <SuccessAlert 
          message={message.text}
          context="EXAMPLE"
          onClose={clearMessage}
        />
      )}

      {/* Formulário de exemplo */}
      <form action={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Nome
          </label>
          <Input
            type="text"
            name="name"
            required
            className="w-full"
            placeholder="Digite seu nome"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email
          </label>
          <Input
            type="email"
            name="email"
            required
            className="w-full"
            placeholder="Digite seu email"
          />
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Processando...' : 'Enviar'}
        </Button>
      </form>

      {/* Informações sobre o sistema */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
          💡 Como funciona:
        </h3>
        <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
          <li>• Use o hook <code>useFormMessages</code> para gerenciar estado</li>
          <li>• Use <code>handleAsyncOperation</code> para operações assíncronas</li>
          <li>• Mensagens de erro são padronizadas automaticamente</li>
          <li>• Suporte a diferentes contextos (PASSWORD, PROFILE, etc.)</li>
        </ul>
      </div>
    </div>
  );
}
