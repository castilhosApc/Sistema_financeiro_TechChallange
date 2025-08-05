"use client";

import React, { useState, useEffect } from 'react';

const ClientOnly = ({ children, fallback = null }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return fallback;
  }

  return <div suppressHydrationWarning>{children}</div>;
};

export default ClientOnly; 