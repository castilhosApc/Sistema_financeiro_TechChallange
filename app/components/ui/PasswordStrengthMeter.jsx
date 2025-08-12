'use client';

import React from 'react';
import { validatePasswordStrength } from '../../utils/passwordValidation';

const PasswordStrengthMeter = ({ password, showRequirements = true, className = '' }) => {
  if (!password) return null;

  const validation = validatePasswordStrength(password);
  const { strength, score, requirements, suggestions } = validation;

  const getStrengthColor = () => {
    switch (strength) {
      case 'forte':
        return 'bg-green-500';
      case 'média':
        return 'bg-yellow-500';
      case 'fraca':
        return 'bg-red-500';
      default:
        return 'bg-gray-300';
    }
  };

  const getStrengthText = () => {
    switch (strength) {
      case 'forte':
        return 'Senha Forte';
      case 'média':
        return 'Senha Média';
      case 'fraca':
        return 'Senha Fraca';
      default:
        return 'Senha Inválida';
    }
  };

  const getScoreColor = () => {
    if (score >= 4) return 'text-green-600 dark:text-green-400';
    if (score >= 2) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Barra de força da senha */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Força da Senha:
          </span>
          <span className={`text-sm font-semibold ${getScoreColor()}`}>
            {getStrengthText()}
          </span>
        </div>
        
        {/* Barra de progresso */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor()}`}
            style={{
              width: `${Math.max(0, Math.min(100, (score + 2) * 20))}%`
            }}
          />
        </div>
        
        {/* Score numérico */}
        <div className="text-right">
          <span className={`text-xs font-medium ${getScoreColor()}`}>
            Score: {score}/5
          </span>
        </div>
      </div>

      {/* Requisitos da senha */}
      {showRequirements && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Requisitos:
          </h4>
          
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${requirements.length ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className={requirements.length ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                Mínimo 8 caracteres
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${requirements.uppercase ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className={requirements.uppercase ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                Uma maiúscula
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${requirements.lowercase ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className={requirements.lowercase ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                Uma minúscula
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${requirements.numbers ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className={requirements.numbers ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                Um número
              </span>
            </div>
            
            <div className="flex items-center space-x-2 col-span-2">
              <div className={`w-2 h-2 rounded-full ${requirements.specialChars ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className={requirements.specialChars ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                Um caractere especial (!@#$%^&*)
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Sugestões */}
      {suggestions.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Sugestões:
          </h4>
          
          <div className="space-y-1">
            {suggestions.map((suggestion, index) => (
              <div key={index} className="flex items-start space-x-2">
                <span className="text-blue-500 text-xs mt-0.5">💡</span>
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  {suggestion}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Comprimento da senha */}
      <div className="text-center">
        <span className={`text-xs font-medium ${
          password.length >= 8 ? 'text-green-600 dark:text-green-400' : 
          password.length >= 6 ? 'text-yellow-600 dark:text-yellow-400' : 
          'text-red-600 dark:text-red-400'
        }`}>
          {password.length} caracteres
        </span>
      </div>
    </div>
  );
};

export default PasswordStrengthMeter;
