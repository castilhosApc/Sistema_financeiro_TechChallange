import React from 'react';

const Input = ({ 
  label, 
  id, 
  type = 'text', 
  error,
  className = '',
  ...props 
}) => {
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
      
      <input
        id={id}
        type={type}
        className={`w-full px-4 py-3 border text-base text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 ${className}`}
        {...props}
      />
      
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};

export default Input;