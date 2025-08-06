import React, { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from './actions/auth';
import { getTransactions } from './actions/transactions';
import { getContacts } from './actions/contacts';
import { getUser, getStats } from './actions/user';
import Header from './components/layout/Header';
import BalanceDisplay from './components/transactions/BalanceDisplay';
import TransactionItem from './components/transactions/TransactionItem';
import WelcomeMessage from './components/ui/WelcomeMessage';
import TransactionFormWrapper from './components/transactions/TransactionFormWrapper';

// Componente de loading
function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 dark:from-blue-900 dark:via-purple-900 dark:to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-white/10 rounded mb-4"></div>
          <div className="h-32 bg-gray-200 dark:bg-white/10 rounded mb-8"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 dark:bg-white/10 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente wrapper para o trigger
function TriggerButton() {
  return (
    <button className="bg-primary-custom hover:bg-primary-custom/90 text-white shadow-lg hover:shadow-xl font-medium rounded-lg transition-all duration-200 px-3 py-1.5 text-sm">
      + Nova Transação
    </button>
  );
}

// Componente principal da página
async function HomePageContent() {
  // Verificar se o usuário está logado
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/auth');
  }

  const [transactions, contacts] = await Promise.all([
    getTransactions(),
    getContacts()
  ]);
  
  const stats = await getStats(transactions);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 dark:from-blue-900 dark:via-purple-900 dark:to-indigo-900">
      <Header user={user} />
      
      <div className="container mx-auto px-4 py-8">
        <WelcomeMessage user={user} />
        
        <BalanceDisplay stats={stats} />
        
        <div className="mt-8 bg-white/80 dark:bg-white/10 backdrop-blur-lg rounded-2xl border border-gray-200/50 dark:border-white/20 p-6 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Histórico de Transações</h2>
            <TransactionFormWrapper
              transaction={undefined}
              contacts={contacts}
              trigger={<TriggerButton />}
            />
          </div>
          
          <div className="space-y-4">
            {transactions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600 dark:text-gray-300">Nenhuma transação encontrada.</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Crie sua primeira transação!</p>
              </div>
            ) : (
              transactions.map(transaction => (
                <TransactionItem
                  key={transaction.id}
                  transaction={transaction}
                  contacts={contacts}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Página principal com Suspense
export default function HomePage() {
  return (
    <Suspense fallback={<Loading />}>
      <HomePageContent />
    </Suspense>
  );
}