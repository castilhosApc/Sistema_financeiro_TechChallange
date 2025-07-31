"use client";

import React, { useState } from 'react';
import { contacts } from '../../config/contacts';

const ContactSelect = ({ 
  label, 
  id, 
  value, 
  onChange, 
  error,
  className = '',
  placeholder = "Selecione um contato..."
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.accountNumber.includes(searchTerm)
  );

  const selectedContact = contacts.find(contact => contact.id === value);

  const handleSelect = (contactId) => {
    onChange({ target: { name: id, value: contactId } });
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="mb-4">
      {label && (
        <label 
          htmlFor={id} 
          className="block text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2"
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full px-4 py-3 border text-base text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 ${className}`}
        >
          {selectedContact ? (
            <div className="text-left">
              <div className="font-medium">{selectedContact.name}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {selectedContact.accountNumber} • {selectedContact.bank}
              </div>
            </div>
          ) : (
            <span className="text-gray-500 dark:text-gray-400">{placeholder}</span>
          )}
        </button>
        
        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto">
            <div className="p-2 border-b border-gray-200 dark:border-gray-600">
              <input
                type="text"
                placeholder="Buscar contato..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400"
                autoFocus
              />
            </div>
            
            <div className="py-1">
              {filteredContacts.length > 0 ? (
                filteredContacts.map(contact => (
                  <button
                    key={contact.id}
                    type="button"
                    onClick={() => handleSelect(contact.id)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-600 focus:bg-gray-50 dark:focus:bg-gray-600 focus:outline-none"
                  >
                    <div className="font-medium text-gray-900 dark:text-gray-100">{contact.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {contact.accountNumber} • {contact.bank} • {contact.type}
                    </div>
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                  Nenhum contato encontrado
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};

export default ContactSelect; 