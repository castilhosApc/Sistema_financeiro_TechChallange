"use client";

import React from 'react';
import Modal from './Modal';
import Button from './Button';

const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirmar Exclusão",
  message = "Tem certeza que deseja excluir este item?",
  confirmText = "Excluir",
  cancelText = "Cancelar",
  variant = "danger",
  isLoading = false,
  disabled = false,
  children
}) => {
  const handleConfirm = async () => {
    if (children) {
      // Se há children (formulário), coletar os dados do formulário
      // Buscar especificamente o formulário dentro deste modal
      const modalContent = document.querySelector('[data-modal-content]');
      let form = null;
      
      if (modalContent) {
        // Buscar por ID específico primeiro
        form = modalContent.querySelector('#deactivateForm') || 
               modalContent.querySelector('#passwordForm');
        
        // Se não encontrar por ID, buscar qualquer formulário
        if (!form) {
          form = modalContent.querySelector('form');
        }
      }
      
      if (form) {
        // Validar se o formulário tem dados válidos
        const formData = new FormData(form);
        const hasData = Array.from(formData.entries()).some(([key, value]) => value && value.trim() !== '');
        
        if (!hasData) {
          console.error('Formulário sem dados válidos');
          return;
        }
        
        await onConfirm(formData);
      } else {
        console.error('Formulário não encontrado no modal');
        // Tentar executar sem FormData
        await onConfirm();
      }
    } else {
      // Confirmação simples sem formulário
      await onConfirm();
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'destructive':
        return 'text-red-700 hover:text-red-800 border-red-700 hover:border-red-800 dark:text-red-400 dark:hover:text-red-300 dark:border-red-400 dark:hover:border-red-300 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30';
      case 'danger':
        return 'text-red-700 hover:text-red-800 border-red-700 hover:border-red-800 dark:text-red-400 dark:hover:text-red-300 dark:border-red-400 dark:hover:border-red-300';
      default:
        return '';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
    >
      <div className="bg-white dark:bg-gray-800">
        {children ? (
          // Render children if provided (for forms)
          <div className="bg-white dark:bg-gray-800 p-6" data-modal-content>
            {children}
            <div className="flex space-x-3 mt-6">
              <Button
                onClick={onClose}
                variant="outline"
                className="flex-1"
                disabled={isLoading}
              >
                {cancelText}
              </Button>
              
              <Button
                onClick={handleConfirm}
                variant={variant === 'destructive' ? 'destructive' : 'primary'}
                className={`flex-1 ${getVariantStyles()}`}
                disabled={isLoading || disabled}
              >
                {isLoading ? 'Processando...' : confirmText}
              </Button>
            </div>
          </div>
        ) : (
          // Default confirmation dialog
          <div className="text-center bg-white dark:bg-gray-800" data-modal-content>
            <div className="text-6xl mb-4">
              {variant === 'destructive' ? '⚠️' : '❓'}
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              {title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {message}
            </p>
            
            <div className="flex space-x-3">
              <Button
                onClick={onClose}
                variant="outline"
                className="flex-1"
                disabled={isLoading}
              >
                {cancelText}
              </Button>
              
              <Button
                onClick={handleConfirm}
                variant={variant === 'destructive' ? 'destructive' : 'primary'}
                className={`flex-1 ${getVariantStyles()}`}
                disabled={isLoading || disabled}
              >
                {isLoading ? 'Processando...' : confirmText}
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ConfirmModal; 