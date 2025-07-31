import React from 'react';
import { formatDate } from '../../utils/formatters';
import { getUserName } from '../../config/user';

const WelcomeMessage = ({ userName }) => {
  const today = new Date();
  const currentDate = formatDate(today.toISOString());
  
  const getGreeting = () => {
    const hour = today.getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  };

  // Usa o nome do usuário do objeto centralizado se não for passado como prop
  const displayName = userName || getUserName();

  return (
    <div className="gradient-primary text-white rounded-2xl p-8 mb-6 shadow-xl">
      <div className="flex items-center space-x-6 mb-6">
        <div className="glass rounded-2xl w-16 h-16 flex items-center justify-center">
          <span className="text-3xl">👋</span>
        </div>
        <div>
          <h1 className="text-3xl font-bold">
            {getGreeting()}, {displayName}!
          </h1>
          <p className="text-white/90 text-lg">
            Hoje é {currentDate}
          </p>
        </div>
      </div>
      
      <div className="glass rounded-xl p-6">
        <p className="text-white/90 text-base leading-relaxed">
          Gerencie suas finanças de forma simples e eficiente. 
          Acompanhe seus gastos, receitas e mantenha o controle total do seu dinheiro.
        </p>
      </div>
    </div>
  );
};

export default WelcomeMessage; 