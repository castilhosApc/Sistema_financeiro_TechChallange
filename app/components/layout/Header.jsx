"use client";

import React from 'react';
import PropTypes from 'prop-types';
import Button from '../ui/Button';
import ThemeToggle from '../ui/ThemeToggle';
import { logout } from '../../actions/auth';
import { useNotification } from '../providers/NotificationProvider';
import { useRouter } from 'next/navigation';

const Header = ({ user }) => {
  const { showNotification } = useNotification();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      showNotification('Logout realizado com sucesso!', 'success');
      router.push('/auth');
    } catch (error) {
      showNotification('Erro ao fazer logout: ' + error.message, 'error');
    }
  };

  return (
    <header className="bg-white/90 dark:bg-white/10 backdrop-blur-lg border-b border-gray-200/50 dark:border-white/20 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-2xl font-bold text-gray-800 dark:text-white">
              💰 Sistema Bancário
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {user && (
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm text-gray-800 dark:text-white font-medium">{user.name}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-300">{user.email}</p>
                </div>
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
            )}
            
            <ThemeToggle />
            
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 border-red-600 hover:border-red-700 dark:border-red-400 dark:hover:border-red-300"
            >
              Sair
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  user: PropTypes.object.isRequired
};

export default Header;
