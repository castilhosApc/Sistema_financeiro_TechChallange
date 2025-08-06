"use client";

import React, { useState, useEffect } from 'react';

const WelcomeMessage = ({ user }) => {
  const [greeting, setGreeting] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const getGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) return 'Bom dia';
      if (hour < 18) return 'Boa tarde';
      return 'Boa noite';
    };

    const formatDate = () => {
      return new Date().toLocaleDateString('pt-BR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

    setGreeting(getGreeting());
    setCurrentDate(formatDate());
  }, []);

  const userName = user?.name || 'Usuário';

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-800 dark:to-purple-800 text-white rounded-2xl p-8 mb-6 shadow-xl">
      <div className="flex items-center space-x-6 mb-6">
        <div className="bg-white/20 dark:bg-white/10 backdrop-blur-md rounded-2xl w-16 h-16 flex items-center justify-center border border-white/30 dark:border-white/20">
          <span className="text-3xl">👋</span>
        </div>
        <div>
          <h1 className="text-3xl font-bold">
            {greeting || 'Olá'}, {userName}!
          </h1>
          <p className="text-white/90 text-lg">
            {currentDate || 'Carregando...'}
          </p>
        </div>
      </div>
      
      <div className="bg-white/20 dark:bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/30 dark:border-white/20">
        <p className="text-white/90 text-base leading-relaxed">
          Gerencie suas finanças de forma simples e eficiente. 
          Acompanhe seus gastos, receitas e mantenha o controle total do seu dinheiro.
        </p>
      </div>
    </div>
  );
};

export default WelcomeMessage; 