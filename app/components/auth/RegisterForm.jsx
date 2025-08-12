"use client";

import React, { useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { register } from '../../actions/auth';
import { useNotification } from '../providers/NotificationProvider';
import { getErrorMessage } from '../../utils/errorMessages';
import PasswordStrengthMeter from '../ui/PasswordStrengthMeter';
import PasswordExample from '../ui/PasswordExample';

const RegisterForm = ({ onSuccess, onSwitchToLogin }) => {
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const { showNotification } = useNotification();

  const handlePasswordChange = (value) => {
    setPassword(value);
    setPasswordError(''); // Limpar erro quando o usuário digita
  };

  const handleConfirmPasswordChange = (value) => {
    setConfirmPassword(value);
    setPasswordError(''); // Limpar erro quando o usuário digita
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validação final antes do envio
    if (password !== confirmPassword) {
      setPasswordError('As senhas não coincidem');
      return;
    }
    
    // Verificar se a senha atende aos requisitos mínimos
    if (password.length < 8) {
      setPasswordError('A senha deve ter pelo menos 8 caracteres');
      return;
    }
    
    setLoading(true);

    try {
      const formData = new FormData(e.target);
      const result = await register(formData);
      
      if (result.success) {
        if (result.message && result.message.includes('reativada')) {
          showNotification('Conta reativada com sucesso!', 'success');
        } else {
          showNotification('Cadastro realizado com sucesso!', 'success');
        }
        onSuccess(result.user);
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error, 'AUTHENTICATION');
      showNotification(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Criar Conta</h1>
        <p className="text-gray-600 dark:text-gray-300">Cadastre-se para começar a usar o sistema</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-800 dark:text-white mb-2">
            Nome Completo
          </label>
          <input
            type="text"
            name="name"
            required
            className="w-full px-4 py-3 bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-white/50"
            placeholder="Seu nome completo"
          />
        </div>

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
          <Input
            type="password"
            name="password"
            required
            minLength={8}
            className="w-full bg-gray-50 dark:bg-white/10 border-gray-300 dark:border-white/20 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-white/50 focus:ring-blue-500 dark:focus:ring-white/50"
            placeholder="••••••••"
            value={password}
            onChange={(e) => handlePasswordChange(e.target.value)}
          />
          
          {/* Medidor de força da senha */}
          {password && (
            <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <PasswordStrengthMeter 
                password={password} 
                showRequirements={true}
              />
            </div>
          )}
          
          {/* Exemplos de senhas seguras */}
          <div className="mt-2">
            <PasswordExample />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-800 dark:text-white mb-2">
            Confirmar Senha
          </label>
          <Input
            type="password"
            name="confirmPassword"
            required
            minLength={8}
            className="w-full bg-gray-50 dark:bg-white/10 border-gray-300 dark:border-white/20 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-white/50 focus:ring-blue-500 dark:focus:ring-white/50"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => handleConfirmPasswordChange(e.target.value)}
          />
          
          {/* Validação de coincidência - apenas quando não há erro de validação */}
          {password && confirmPassword && !passwordError && (
            <div className="mt-2 p-2 rounded-lg border ${
              password === confirmPassword 
                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
            }">
              <div className="flex items-center space-x-2">
                {password === confirmPassword ? (
                  <>
                    <span className="text-green-500 text-sm">✓</span>
                    <span className="text-green-700 dark:text-green-300 text-sm font-medium">
                      Senhas coincidem
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-red-500 text-sm">✗</span>
                    <span className="text-red-700 dark:text-red-300 text-sm font-medium">
                      Senhas não coincidem
                    </span>
                  </>
                )}
              </div>
            </div>
          )}
          
          {/* Mensagem de erro única - prioridade sobre a validação de coincidência */}
          {passwordError && (
            <div className="mt-2 p-2 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
              <div className="flex items-center space-x-2">
                <span className="text-red-500 text-sm">✗</span>
                <span className="text-red-700 dark:text-red-300 text-sm font-medium">
                  {passwordError}
                </span>
              </div>
            </div>
          )}
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          disabled={loading || !password || !confirmPassword || password !== confirmPassword || password.length < 8}
        >
          {loading ? 'Cadastrando...' : 'Cadastrar'}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600 dark:text-gray-300">
          Já tem uma conta?{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors font-medium"
          >
            Faça login
          </button>
        </p>
      </div>

      <div className="mt-6 p-4 bg-blue-100 dark:bg-blue-500/20 border border-blue-200 dark:border-blue-500/30 rounded-lg">
        <h3 className="text-sm font-medium text-blue-800 dark:text-blue-400 mb-2">ℹ️ Informação</h3>
        <p className="text-xs text-gray-700 dark:text-gray-300">
          Se você já possui uma conta que foi desativada, pode reativá-la usando o mesmo email e senha durante o cadastro.
        </p>
      </div>
    </div>
  );
};

export default RegisterForm; 