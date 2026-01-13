'use client';

import { useTransactions } from '@/hooks/useTransactions';
import TransactionForm from '@/components/TransactionForm';
import TransactionList from '@/components/TransactionList';
import Summary from '@/components/Summary';

export default function Home() {
  const { transactions, addTransaction, deleteTransaction, getSummary, isLoaded } = useTransactions();

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <p className="text-xl text-gray-600">Cargando...</p>
      </div>
    );
  }

  const summary = getSummary();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Gestor de Gastos e Ingresos
          </h1>
          <p className="text-gray-600">
            Lleva el control de tus finanzas personales
          </p>
        </header>

        <Summary summary={summary} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <TransactionForm onAdd={addTransaction} />
          </div>

          <div className="lg:col-span-2">
            <TransactionList
              transactions={transactions}
              onDelete={deleteTransaction}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
