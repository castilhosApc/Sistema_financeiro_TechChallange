"use client";

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const ModalPortal = ({ children }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) {
    return null;
  }

  // Garantir que o portal seja criado no body com as classes corretas
  const portalContainer = document.body;
  
  return createPortal(
    <div>
      {children}
    </div>,
    portalContainer
  );
};

export default ModalPortal; 