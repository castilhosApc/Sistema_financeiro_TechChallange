'use client';

import { useState } from 'react';
import { updateUserProfile, updateUserPassword, deactivateUserAccount } from '../../actions/user';
import { useRouter } from 'next/navigation';
import { logout } from '../../actions/auth';
import Link from 'next/link';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Card from '../ui/Card';
import ConfirmModal from '../ui/ConfirmModal';

export default function UserProfileForm({ user }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  const handleProfileUpdate = async (formData) => {
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const result = await updateUserProfile(formData);
      
      if (result.success) {
        setMessage({ 
          type: 'success', 
          text: '✅ Perfil atualizado com sucesso!' 
        });
        
        // Limpar mensagem após 3 segundos
        setTimeout(() => {
          setMessage({ type: '', text: '' });
        }, 3000);
      }
    } catch (error) {
      console.error('❌ Erro na atualização do perfil:', error);
      
      let errorMessage = 'Erro ao atualizar perfil';
      
      if (error.message.includes('email já está sendo usado')) {
        errorMessage = '❌ Este email já está sendo usado por outro usuário.';
      } else if (error.message.includes('Nome e email são obrigatórios')) {
        errorMessage = '❌ Nome e email são obrigatórios.';
      } else if (error.message.includes('Usuário não autenticado')) {
        errorMessage = '❌ Sessão expirada. Faça login novamente.';
      } else {
        errorMessage = `❌ ${error.message}`;
      }
      
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordUpdate = async (formData) => {
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const result = await updateUserPassword(formData);
      
      if (result.success) {
        setMessage({ 
          type: 'success', 
          text: '✅ Senha alterada com sucesso!' 
        });
        
        setShowPasswordModal(false);
        
        // Limpar mensagem após 3 segundos
        setTimeout(() => {
          setMessage({ type: '', text: '' });
        }, 3000);
      }
    } catch (error) {
      console.error('❌ Erro na alteração de senha:', error);
      
      let errorMessage = 'Erro ao alterar senha';
      
      if (error.message.includes('Senha atual incorreta')) {
        errorMessage = '❌ Senha atual incorreta. Tente novamente.';
      } else if (error.message.includes('As novas senhas não coincidem')) {
        errorMessage = '❌ As novas senhas não coincidem.';
      } else if (error.message.includes('pelo menos 6 caracteres')) {
        errorMessage = '❌ A nova senha deve ter pelo menos 6 caracteres.';
      } else if (error.message.includes('Todos os campos são obrigatórios')) {
        errorMessage = '❌ Todos os campos são obrigatórios.';
      } else if (error.message.includes('Usuário não autenticado')) {
        errorMessage = '❌ Sessão expirada. Faça login novamente.';
      } else {
        errorMessage = `❌ ${error.message}`;
      }
      
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeactivateAccount = async (formData) => {
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const result = await deactivateUserAccount(formData);
      
      if (result.success) {
        setMessage({ 
          type: 'success', 
          text: 'Conta desativada com sucesso! Redirecionando...' 
        });
        
        // Aguardar um pouco para mostrar a mensagem de sucesso
        setTimeout(async () => {
          try {
            await logout();
            router.push('/');
          } catch (logoutError) {
            console.error('Erro no logout:', logoutError);
            router.push('/');
          }
        }, 2000);
      }
    } catch (error) {
      // Mensagens de erro específicas
      let errorMessage = 'Erro ao desativar conta';
      
      if (error.message.includes('Senha incorreta')) {
        errorMessage = '❌ Senha incorreta. Tente novamente.';
      } else if (error.message.includes('Senha é obrigatória')) {
        errorMessage = '❌ Digite sua senha para confirmar a desativação.';
      } else if (error.message.includes('Usuário não autenticado')) {
        errorMessage = '❌ Sessão expirada. Faça login novamente.';
      } else if (error.message.includes('Usuário não encontrado')) {
        errorMessage = '❌ Usuário não encontrado no sistema.';
      } else {
        errorMessage = `❌ ${error.message}`;
      }
      
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header com botão de voltar */}
      <div className="mb-6 bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <Link 
            href="/" 
            className="flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Voltar ao Início
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Configurações da Conta
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Gerencie suas informações pessoais e configurações de segurança
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'profile'
              ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          Perfil
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'security'
              ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          Segurança
        </button>
      </div>

      {/* Message */}
      {message.text && (
        <div className={`mb-6 p-4 rounded-lg border-l-4 shadow-lg ${
          message.type === 'success' 
            ? 'bg-green-50 border-green-400 text-green-800 dark:bg-green-900/20 dark:border-green-500 dark:text-green-200'
            : 'bg-red-50 border-red-400 text-red-800 dark:bg-red-900/20 dark:border-red-500 dark:text-red-200'
        }`}>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              {message.type === 'success' ? (
                <svg className="w-5 h-5 text-green-400 dark:text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-red-400 dark:text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">
                {message.text}
              </p>
            </div>
            <div className="ml-auto pl-3">
              <button
                onClick={() => setMessage({ type: '', text: '' })}
                className={`inline-flex rounded-md p-1.5 ${
                  message.type === 'success'
                    ? 'text-green-500 hover:bg-green-100 dark:hover:bg-green-900/30'
                    : 'text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30'
                }`}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <Card className="mb-6">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Informações Pessoais
            </h2>
            
            <form action={handleProfileUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nome Completo
                </label>
                <Input
                  type="text"
                  name="name"
                  defaultValue={user?.name || ''}
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <Input
                  type="email"
                  name="email"
                  defaultValue={user?.email || ''}
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Avatar URL (opcional)
                </label>
                <Input
                  type="url"
                  name="avatar"
                  defaultValue={user?.avatar || ''}
                  placeholder="https://exemplo.com/avatar.jpg"
                  className="w-full"
                />
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full sm:w-auto"
                >
                  {isLoading ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </div>
            </form>
          </div>
        </Card>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          {/* Change Password */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Alterar Senha
              </h2>
              
              <Button
                onClick={() => setShowPasswordModal(true)}
                variant="outline"
                className="w-full sm:w-auto"
              >
                Alterar Senha
              </Button>
            </div>
          </Card>

          {/* Deactivate Account */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Desativar Conta
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Esta ação irá desativar sua conta permanentemente. Todas as suas sessões serão encerradas.
              </p>
              
              <Button
                onClick={() => setShowDeactivateModal(true)}
                variant="destructive"
                className="w-full sm:w-auto"
              >
                Desativar Conta
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Password Change Modal */}
      {showPasswordModal && (
        <ConfirmModal
          isOpen={showPasswordModal}
          onClose={() => setShowPasswordModal(false)}
          title="Alterar Senha"
          confirmText="Alterar Senha"
          onConfirm={handlePasswordUpdate}
          isLoading={isLoading}
        >
          <form id="passwordForm" className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Senha Atual
              </label>
              <Input
                type="password"
                name="currentPassword"
                required
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nova Senha
              </label>
              <Input
                type="password"
                name="newPassword"
                required
                minLength={6}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Confirmar Nova Senha
              </label>
              <Input
                type="password"
                name="confirmPassword"
                required
                minLength={6}
                className="w-full"
              />
            </div>
          </form>
        </ConfirmModal>
      )}

      {/* Deactivate Account Modal */}
      {showDeactivateModal && (
        <ConfirmModal
          isOpen={showDeactivateModal}
          onClose={() => setShowDeactivateModal(false)}
          title="Desativar Conta"
          confirmText="Desativar Conta"
          variant="destructive"
          onConfirm={handleDeactivateAccount}
          isLoading={isLoading}
        >
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-400">
              Esta ação é irreversível. Sua conta será desativada e você será desconectado imediatamente.
            </p>
            
            <form id="deactivateForm" className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Digite sua senha para confirmar
                </label>
                <Input
                  type="password"
                  name="password"
                  required
                  className="w-full"
                />
              </div>
            </form>
          </div>
        </ConfirmModal>
      )}
    </div>
  );
}
