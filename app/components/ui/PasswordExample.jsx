'use client';

import React, { useState } from 'react';

const PasswordExample = ({ className = '' }) => {
  const [showExamples, setShowExamples] = useState(false);

  const examples = [
    {
      type: 'Frase Memorável',
      examples: [
        'MinhaCasa@2024!',
        'Estudar#Sempre2024',
        'Viagem$ParaParis2025'
      ],
      description: 'Use uma frase pessoal com números e símbolos'
    },
    {
      type: 'Palavras Combinadas',
      examples: [
        'GatoAzul#7',
        'CafePreto@9',
        'LivroVerde$5'
      ],
      description: 'Combine palavras não relacionadas com números'
    },
    {
      type: 'Padrão de Teclado',
      examples: [
        'Qw3rty!@#',
        'Asdfgh$%^',
        'Zxcvbn&*('
      ],
      description: 'Use padrões de teclado com variações'
    },
    {
      type: 'Substituições',
      examples: [
        'P@ssw0rd!',
        'S3nh@F0rt3',
        'C0nt@2024#'
      ],
      description: 'Substitua letras por números similares'
    }
  ];

  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => setShowExamples(!showExamples)}
        className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline mb-2"
      >
        {showExamples ? 'Ocultar' : 'Ver'} exemplos de senhas seguras
      </button>

      {showExamples && (
        <div className="space-y-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h4 className="text-sm font-medium text-blue-800 dark:text-blue-400 mb-3">
            🔐 Exemplos de Senhas Seguras:
          </h4>
          
          <div className="grid gap-4">
            {examples.map((category, index) => (
              <div key={index} className="space-y-2">
                <h5 className="text-xs font-semibold text-blue-700 dark:text-blue-300">
                  {category.type}:
                </h5>
                <p className="text-xs text-blue-600 dark:text-blue-400 mb-2">
                  {category.description}
                </p>
                <div className="space-y-1">
                  {category.examples.map((example, exIndex) => (
                    <div key={exIndex} className="flex items-center space-x-2">
                      <code className="text-xs bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded font-mono text-blue-800 dark:text-blue-200">
                        {example}
                      </code>
                      <button
                        type="button"
                        onClick={() => navigator.clipboard.writeText(example)}
                        className="text-xs text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        title="Copiar senha"
                      >
                        📋
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <h5 className="text-xs font-semibold text-yellow-700 dark:text-yellow-300 mb-2">
              ⚠️ Importante:
            </h5>
            <ul className="text-xs text-yellow-600 dark:text-yellow-400 space-y-1">
              <li>• Não use estas senhas exatas - elas são apenas exemplos</li>
              <li>• Crie suas próprias senhas baseadas nestes padrões</li>
              <li>• Nunca compartilhe suas senhas com ninguém</li>
              <li>• Use um gerenciador de senhas para maior segurança</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default PasswordExample;
