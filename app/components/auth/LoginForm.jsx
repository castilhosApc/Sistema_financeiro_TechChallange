"use client";

import React, { useState } from 'react';
import Button from '../ui/Button';
import { login, reactivateAccount } from '../../actions/auth';
import { useNotification } from '../providers/NotificationProvider';

const LoginForm = ({ onSuccess, onSwitchToRegister }) => {
  const [loading, setLoading] = useState(false);
  const [showReactivate, setShowReactivate] = useState(false);
  const [inactiveEmail, setInactiveEmail] = useState('');
  const { showNotification } = useNotification();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);

    try {
      const result = await login(formData);
      
      if (result.success) {
        showNotification('Login realizado com sucesso!', 'success');
        onSuccess(result.user);
      }
    } catch (error) {
      if (error.message === 'CONTA_INATIVA') {
        // Conta inativa detectada, mostrar opção de reativação
        const email = formData.get('email');
        if (email) {
          setInactiveEmail(email);
          setShowReactivate(true);
          showNotification('Sua conta está inativa. Você pode reativá-la inserindo sua senha novamente.', 'warning');
        } else {
          showNotification('Erro: Email não encontrado no formulário', 'error');
        }
      } else {
        showNotification(error.message, 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReactivate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.target);
      formData.set('email', inactiveEmail); // Garantir que o email está correto
      
      const result = await reactivateAccount(formData);
      
      if (result.success) {
        showNotification('Conta reativada com sucesso!', 'success');
        onSuccess(result.user);
      }
    } catch (error) {
      showNotification(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setShowReactivate(false);
    setInactiveEmail('');
  };

  if (showReactivate && inactiveEmail) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Reativar Conta</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Sua conta está inativa. Digite sua senha para reativá-la.
          </p>
        </div>

        <form onSubmit={handleReactivate} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-800 dark:text-white mb-2">
              E-mail
            </label>
            <input
              type="email"
              value={inactiveEmail}
              disabled
              className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800 dark:text-white mb-2">
              Senha
            </label>
            <input
              type="password"
              name="password"
              required
              className="w-full px-4 py-3 bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-white/50"
              placeholder="••••••••"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Reativando...' : 'Reativar Conta'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={handleBackToLogin}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors font-medium"
          >
            ← Voltar ao Login
          </button>
        </div>

        <div className="mt-6 p-4 bg-yellow-100 dark:bg-yellow-500/20 border border-yellow-200 dark:border-yellow-500/30 rounded-lg">
          <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-400 mb-2">ℹ️ Informação</h3>
          <p className="text-xs text-gray-700 dark:text-gray-300">
            Sua conta foi desativada anteriormente. Ao reativar, você terá acesso completo novamente.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Bem-vindo de volta!</h1>
        <p className="text-gray-600 dark:text-gray-300">Faça login para acessar sua conta</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-800 dark:text-white mb-2">
            E-mail
          </label>
          <input
            type="email"
            name="email"
            required
            className="w-full px-4 py-3 bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-white/50"
            placeholder="seu@email.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-800 dark:text-white mb-2">
            Senha
          </label>
          <input
            type="password"
            name="password"
            required
            className="w-full px-4 py-3 bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-white/50"
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
        <p className="text-gray-600 dark:text-gray-300">
          Não tem uma conta?{' '}
          <button
            onClick={onSwitchToRegister}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors font-medium"
          >
            Cadastre-se
          </button>
        </p>
      </div>

      <div className="mt-8 p-4 bg-blue-100 dark:bg-blue-500/20 border border-blue-200 dark:border-blue-500/30 rounded-lg">
        <h3 className="text-sm font-medium text-blue-800 dark:text-blue-400 mb-2">Conta de Teste</h3>
        <p className="text-xs text-gray-700 dark:text-gray-300">
          <strong>E-mail:</strong> admin@admin.com<br />
          <strong>Senha:</strong> admin@123
        </p>
      </div>
    </div>
  );
};

export default LoginForm; 