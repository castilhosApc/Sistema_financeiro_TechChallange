import React from 'react';
import PropTypes from 'prop-types';
import { formatCurrency } from '../../utils/formatters';

const BalanceDisplay = ({ balance, income, expenses, accountBalance }) => {
  const balanceClass = balance >= 0 ? 'text-success-400' : 'text-danger-400';
  
  return (
    <div className="gradient-primary text-white rounded-2xl p-8 shadow-xl">
      <div className="mb-8">
        <h2 className="text-sm font-medium text-white/90 mb-3">Saldo da Conta</h2>
        <div className={`text-5xl font-bold ${balanceClass}`}>
          {formatCurrency(accountBalance || balance)}
        </div>
     
      </div>
    </div>
  );
};

BalanceDisplay.propTypes = {
  balance: PropTypes.number.isRequired,
  income: PropTypes.number.isRequired,
  expenses: PropTypes.number.isRequired,
  accountBalance: PropTypes.number
};

export default BalanceDisplay;