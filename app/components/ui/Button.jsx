import React from 'react';
import PropTypes from 'prop-types';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className = '',
  ...props 
}) => {
  const baseClasses = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 shadow-sm hover:shadow-md";
  
  const variants = {
    primary: "gradient-primary text-white hover:scale-105 focus:ring-primary-400/50",
    secondary: "bg-secondary-100 text-secondary-700 hover:bg-secondary-200 focus:ring-secondary-400/50 dark:bg-secondary-800 dark:text-secondary-200 dark:hover:bg-secondary-700",
    success: "bg-success-500 text-white hover:bg-success-600 focus:ring-success-400/50",
    danger: "bg-danger-500 text-white hover:bg-danger-600 focus:ring-danger-400/50",
    accent: "bg-accent-500 text-white hover:bg-accent-600 focus:ring-accent-400/50",
  };
  
  const sizes = {
    sm: "py-2 px-4 text-sm",
    md: "py-3 px-6 text-base",
    lg: "py-4 px-8 text-lg",
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  variant: PropTypes.oneOf(['primary', 'secondary', 'success', 'danger', 'accent']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
};

export default Button;