"use client";

import React from 'react';

const ErrorAlert = ({ 
  error, 
  context = 'GENERAL', 
  className = '', 
  onClose,
  showCloseButton = true 
}) => {
  if (!error) return null;

  const getErrorMessage = (error, context) => {
    if (!error || !error.message) {
      return '❌ Ocorreu um erro inesperado. Tente novamente.';
    }

    const message = error.message.toLowerCase();
    
    // Verificar mensagens específicas por contexto
    switch (context) {
      case 'PASSWORD':
        if (message.includes('senha atual incorreta')) {
          return '❌ Senha atual incorreta. Tente novamente.';
        }
        if (message.includes('não coincidem')) {
          return '❌ As novas senhas não coincidem.';
        }
        if (message.includes('6 caracteres')) {
          return '❌ A nova senha deve ter pelo menos 6 caracteres.';
        }
        if (message.includes('obrigatórios')) {
          return '❌ Todos os campos são obrigatórios.';
        }
        if (message.includes('falha ao alterar senha')) {
          return '❌ Falha ao alterar senha.';
        }
        break;

      case 'AUTHENTICATION':
        if (message.includes('não autenticado')) {
          return '❌ Sessão expirada. Faça login novamente.';
        }
        if (message.includes('não encontrado')) {
          return '❌ Usuário não encontrado no sistema.';
        }
        if (message.includes('incorreta')) {
          return '❌ Email ou senha incorretos.';
        }
        if (message.includes('inativa')) {
          return '❌ Sua conta está inativa. Entre em contato com o suporte.';
        }
        break;

      case 'PROFILE':
        if (message.includes('email já está sendo usado')) {
          return '❌ Este email já está sendo usado por outro usuário.';
        }
        if (message.includes('nome e email são obrigatórios')) {
          return '❌ Nome e email são obrigatórios.';
        }
        if (message.includes('falha ao atualizar perfil')) {
          return '❌ Erro ao atualizar perfil.';
        }
        break;

      case 'TRANSACTIONS':
        if (message.includes('falha ao criar transação')) {
          return '❌ Erro ao criar transação.';
        }
        if (message.includes('falha ao atualizar transação')) {
          return '❌ Erro ao atualizar transação.';
        }
        if (message.includes('valor deve ser maior que zero')) {
          return '❌ Valor deve ser maior que zero.';
        }
        break;

      case 'CONTACTS':
        if (message.includes('falha ao criar contato')) {
          return '❌ Erro ao criar contato.';
        }
        if (message.includes('falha ao atualizar contato')) {
          return '❌ Erro ao atualizar contato.';
        }
        break;

      case 'ACCOUNT':
        if (message.includes('falha ao desativar conta')) {
          return '❌ Erro ao desativar conta.';
        }
        if (message.includes('senha incorreta')) {
          return '❌ Senha incorreta. Tente novamente.';
        }
        if (message.includes('senha é obrigatória')) {
          return '❌ Senha é obrigatória.';
        }
        break;

      default:
        // Para mensagens não categorizadas, retornar a mensagem original
        return `❌ ${error.message}`;
    }

    // Se não encontrou uma mensagem específica, retornar a original
    return `❌ ${error.message}`;
  };

  const errorMessage = getErrorMessage(error, context);

  return (
    <div className={`bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 ${className}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm text-red-800 dark:text-red-200 font-medium">
            {errorMessage}
          </p>
        </div>
        {showCloseButton && onClose && (
          <div className="ml-auto pl-3">
            <button
              onClick={onClose}
              className="inline-flex rounded-md p-1.5 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorAlert;
