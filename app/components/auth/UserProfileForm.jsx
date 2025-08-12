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
import PasswordStrengthMeter from '../ui/PasswordStrengthMeter';
import PasswordExample from '../ui/PasswordExample';
import { validatePasswordChangeComplete, generatePasswordSuggestions } from '../../utils/passwordValidation';

export default function UserProfileForm({ user }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [passwordError, setPasswordError] = useState('');
  const [showPasswordSuccess, setShowPasswordSuccess] = useState(false);
  const [showProfileSuccess, setShowProfileSuccess] = useState(false);
  const [passwordFields, setPasswordFields] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordValidation, setPasswordValidation] = useState(null);

  // Função para fechar alertas de sucesso
  const closePasswordSuccess = () => setShowPasswordSuccess(false);
  const closeProfileSuccess = () => setShowProfileSuccess(false);

  const handleProfileUpdate = async (formData) => {
    try {
      setIsLoading(true);
      await updateUserProfile(formData);
      
      // Mostrar alerta de sucesso para atualização de perfil
      setShowProfileSuccess(true);
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordUpdate = async (formData) => {
    const currentPassword = formData.get('currentPassword');
    const newPassword = formData.get('newPassword');
    const confirmPassword = formData.get('confirmPassword');

    // Validação completa usando o novo sistema
    const validation = validatePasswordChangeComplete(currentPassword, newPassword, confirmPassword);
    
    if (!validation.isValid) {
      setPasswordError(validation.errors[0]);
      return;
    }

    setPasswordError('');

    try {
      setIsLoading(true);
      await updateUserPassword(formData);
      
      // Mostrar alerta de sucesso para alteração de senha
      setShowPasswordSuccess(true);
      
      // Limpar campos e fechar modal apenas em caso de sucesso
      setPasswordFields({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setPasswordValidation(null);
      closePasswordModal();
    } catch (error) {
      console.error('Erro ao atualizar senha:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const closePasswordModal = () => {
    setShowPasswordModal(false);
    setPasswordFields({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setPasswordError('');
    setPasswordValidation(null);
  };

  const validatePasswords = () => {
    const { currentPassword, newPassword, confirmPassword } = passwordFields;
    
    if (newPassword && confirmPassword && currentPassword) {
      const validation = validatePasswordChangeComplete(currentPassword, newPassword, confirmPassword);
      setPasswordValidation(validation);
      
      if (!validation.isValid) {
        setPasswordError(validation.errors[0]);
        return false;
      }
    }
    
    setPasswordError('');
    return true;
  };

  const handlePasswordFieldChange = (field, value) => {
    setPasswordFields(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpar erro anterior quando o usuário digita
    setPasswordError('');
    
    // Validar em tempo real se ambos os campos estão preenchidos
    if (field === 'newPassword' || field === 'confirmPassword') {
      setTimeout(() => {
        // Usar o valor atualizado do campo que acabou de ser alterado
        const updatedFields = {
          ...passwordFields,
          [field]: value
        };
        
        if (updatedFields.newPassword && updatedFields.confirmPassword && updatedFields.currentPassword) {
          const validation = validatePasswordChangeComplete(
            updatedFields.currentPassword, 
            updatedFields.newPassword, 
            updatedFields.confirmPassword
          );
          setPasswordValidation(validation);
          
          if (!validation.isValid) {
            setPasswordError(validation.errors[0]);
          } else {
            setPasswordError('');
          }
        }
      }, 100);
    }
  };

  const handleDeactivateAccount = async (formData) => {
    try {
      setIsLoading(true);
      await deactivateUserAccount(formData);
      
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
    } catch (error) {
      console.error('Erro ao desativar conta:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header com botão de voltar */}
        <div className="mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
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

        {/* Alertas de sucesso */}
        {showPasswordSuccess && (
          <div className="mb-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm text-green-800 dark:text-green-200 font-medium">
                  ✅ Senha alterada com sucesso!
                </p>
              </div>
              <div className="ml-auto pl-3">
                <button
                  onClick={closePasswordSuccess}
                  className="inline-flex rounded-md p-1.5 text-green-500 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
        {showProfileSuccess && (
          <div className="mb-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm text-green-800 dark:text-green-200 font-medium">
                  ✅ Perfil atualizado com sucesso!
                </p>
              </div>
              <div className="ml-auto pl-3">
                <button
                  onClick={closeProfileSuccess}
                  className="inline-flex rounded-md p-1.5 text-green-500 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

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
            onClose={closePasswordModal}
            title="Alterar Senha"
            confirmText="Alterar Senha"
            variant="primary"
            onConfirm={handlePasswordUpdate}
            isLoading={isLoading}
            disabled={!passwordFields.currentPassword || 
                     !passwordFields.newPassword || 
                     !passwordFields.confirmPassword || 
                     passwordFields.newPassword !== passwordFields.confirmPassword ||
                     (passwordValidation && !passwordValidation.isValid)}
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
                  className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                  onChange={(e) => handlePasswordFieldChange('currentPassword', e.target.value)}
                  value={passwordFields.currentPassword}
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
                  minLength={8}
                  className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                  onChange={(e) => handlePasswordFieldChange('newPassword', e.target.value)}
                  value={passwordFields.newPassword}
                />
                
                {/* Medidor de força da senha */}
                {passwordFields.newPassword && (
                  <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <PasswordStrengthMeter 
                      password={passwordFields.newPassword} 
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Confirmar Nova Senha
                </label>
                <Input
                  type="password"
                  name="confirmPassword"
                  required
                  minLength={8}
                  className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                  onChange={(e) => handlePasswordFieldChange('confirmPassword', e.target.value)}
                  value={passwordFields.confirmPassword}
                />
                
                {/* Validação de coincidência - apenas quando não há erro de validação */}
                {passwordFields.newPassword && passwordFields.confirmPassword && !passwordError && (
                  <div className="mt-2 p-2 rounded-lg border ${
                    passwordFields.newPassword === passwordFields.confirmPassword 
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                      : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                  }">
                    <div className="flex items-center space-x-2">
                      {passwordFields.newPassword === passwordFields.confirmPassword ? (
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
                    className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                  />
                </div>
              </form>
            </div>
          </ConfirmModal>
        )}
      </div>
    </div>
  );
}
