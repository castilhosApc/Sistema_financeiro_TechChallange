import React from 'react';

const BalanceDisplay = ({ stats }) => {
  const formatCurrency = (value) => {
    // Verificar se o valor é válido
    if (value === null || value === undefined || isNaN(value)) {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(0);
    }
    
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Extrair valores com fallback para 0
  const balance = stats?.balance || 0;
  const totalIncome = stats?.totalIncome || 0;
  const totalExpenses = stats?.totalExpenses || 0;
  
  const balanceClass = balance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700 text-white rounded-2xl p-8 shadow-xl">
      <div className="mb-8">
        <h2 className="text-sm font-medium text-white/90 mb-3">Saldo da Conta</h2>
        <div className={`text-5xl font-bold ${balanceClass}`}>
          {formatCurrency(balance)}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/20 dark:bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/30 dark:border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm font-medium">Receitas</p>
              <p className="text-2xl font-bold text-green-400">{formatCurrency(totalIncome)}</p>
            </div>
            <div className="text-3xl">📈</div>
          </div>
        </div>
        
        <div className="bg-white/20 dark:bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/30 dark:border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm font-medium">Despesas</p>
              <p className="text-2xl font-bold text-red-400">{formatCurrency(totalExpenses)}</p>
            </div>
            <div className="text-3xl">📉</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalanceDisplay;