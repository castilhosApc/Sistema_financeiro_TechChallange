"use client";

import React from 'react';
import { AccountProvider } from '../../contexts/AccountContext';
import { ThemeProvider } from '../../contexts/ThemeContext';

const ClientProviders = ({ children }) => {
  return (
    <ThemeProvider>
      <AccountProvider>
        {children}
      </AccountProvider>
    </ThemeProvider>
  );
};

export default ClientProviders; 