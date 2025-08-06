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
  type = "danger"
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
    >
      <div className="p-6">
        <div className="text-center">
          <div className="text-6xl mb-4">
            {type === 'danger' ? '⚠️' : '❓'}
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
            >
              {cancelText}
            </Button>
            
            <Button
              onClick={handleConfirm}
              variant={type === 'danger' ? 'outline' : 'primary'}
              className={`flex-1 ${type === 'danger' ? 'text-red-700 hover:text-red-800 border-red-700 hover:border-red-800 dark:text-red-400 dark:hover:text-red-300 dark:border-red-400 dark:hover:border-red-300' : ''}`}
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal; 