"use client";

import React, { useState, useEffect } from 'react';

const SuccessAlert = ({ 
  message, 
  context = 'GENERAL', 
  className = '', 
  onClose,
  showCloseButton = true,
  autoHide = true,
  autoHideDelay = 5000
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoHide && autoHideDelay > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) onClose();
      }, autoHideDelay);

      return () => clearTimeout(timer);
    }
  }, [autoHide, autoHideDelay, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  const getSuccessMessage = (message, context) => {
    if (message) return message;

    const SUCCESS_MESSAGES = {
      PASSWORD: '✅ Senha alterada com sucesso!',
      PROFILE: '✅ Perfil atualizado com sucesso!',
      TRANSACTION: '✅ Transação salva com sucesso!',
      CONTACT: '✅ Contato salvo com sucesso!',
      ACCOUNT: '✅ Operação realizada com sucesso!',
      AUTHENTICATION: '✅ Login realizado com sucesso!',
      REGISTRATION: '✅ Cadastro realizado com sucesso!',
      GENERAL: '✅ Operação realizada com sucesso!'
    };

    return SUCCESS_MESSAGES[context] || SUCCESS_MESSAGES.GENERAL;
  };

  const successMessage = getSuccessMessage(message, context);

  if (!isVisible) return null;

  return (
    <div className={`bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 ${className}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm text-green-800 dark:text-green-200 font-medium">
            {successMessage}
          </p>
        </div>
        {showCloseButton && (
          <div className="ml-auto pl-3">
            <button
              onClick={handleClose}
              className="inline-flex rounded-md p-1.5 text-green-500 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
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

export default SuccessAlert;
