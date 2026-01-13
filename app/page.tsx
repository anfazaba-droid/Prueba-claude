'use client';

import { useTransactions } from '@/hooks/useTransactions';
import TransactionForm from '@/components/TransactionForm';
import TransactionList from '@/components/TransactionList';
import Summary from '@/components/Summary';

export default function Home() {
  const { transactions, addTransaction, deleteTransaction, getSummary, isLoaded, error, storageMode } = useTransactions();

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
          <div className="mt-2 flex items-center justify-center gap-2">
            <span className={`text-xs px-2 py-1 rounded ${
              storageMode === 'prisma'
                ? 'bg-blue-100 text-blue-800'
                : storageMode === 'supabase'
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {storageMode === 'prisma' && '🗄️ Prisma + PostgreSQL'}
              {storageMode === 'supabase' && '☁️ Supabase Cloud'}
              {storageMode === 'local' && '💾 Almacenamiento Local'}
            </span>
          </div>
        </header>

        {error && (
          <div className="mb-6 bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
            <p className="text-orange-800 text-sm">{error}</p>
          </div>
        )}

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
