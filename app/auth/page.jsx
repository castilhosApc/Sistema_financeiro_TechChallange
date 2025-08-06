"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import { NotificationProvider } from '../components/providers/NotificationProvider';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  const handleAuthSuccess = (user) => {
    // Redirecionar para a página principal após login/cadastro
    router.push('/');
  };

  return (
    <NotificationProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 dark:from-blue-900 dark:via-purple-900 dark:to-indigo-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white/90 dark:bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-200/50 dark:border-white/20 p-8">
            {isLogin ? (
              <LoginForm
                onSuccess={handleAuthSuccess}
                onSwitchToRegister={() => setIsLogin(false)}
              />
            ) : (
              <RegisterForm
                onSuccess={handleAuthSuccess}
                onSwitchToLogin={() => setIsLogin(true)}
              />
            )}
          </div>
        </div>
      </div>
    </NotificationProvider>
  );
};

export default AuthPage; 