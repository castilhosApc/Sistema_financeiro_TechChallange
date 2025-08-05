"use client";

import React, { useState } from 'react';
import Button from '../ui/Button';
import { login } from '../../actions/auth';
import { useNotification } from '../providers/NotificationProvider';

const LoginForm = ({ onSuccess, onSwitchToRegister }) => {
  const [loading, setLoading] = useState(false);
  const { showNotification } = useNotification();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.target);
      const result = await login(formData);
      
      if (result.success) {
        showNotification('Login realizado com sucesso!', 'success');
        onSuccess(result.user);
      }
    } catch (error) {
      showNotification(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Bem-vindo de volta!</h1>
        <p className="text-gray-300">Faça login para acessar sua conta</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            E-mail
          </label>
          <input
            type="email"
            name="email"
            required
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
            placeholder="seu@email.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Senha
          </label>
          <input
            type="password"
            name="password"
            required
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
            placeholder="••••••••"
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          disabled={loading}
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-300">
          Não tem uma conta?{' '}
          <button
            onClick={onSwitchToRegister}
            className="text-white hover:text-blue-400 transition-colors font-medium"
          >
            Cadastre-se
          </button>
        </p>
      </div>

      <div className="mt-8 p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg">
        <h3 className="text-sm font-medium text-blue-400 mb-2">Conta de Teste</h3>
        <p className="text-xs text-gray-300">
          <strong>E-mail:</strong> admin@admin.com<br />
          <strong>Senha:</strong> admin@123
        </p>
      </div>
    </div>
  );
};

export default LoginForm; 