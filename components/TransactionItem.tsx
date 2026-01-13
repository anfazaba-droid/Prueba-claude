'use client';

import { Transaction } from '@/types';

interface TransactionItemProps {
  transaction: Transaction;
  onDelete: (id: string) => void;
}

export default function TransactionItem({ transaction, onDelete }: TransactionItemProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div className={`p-4 rounded-lg border-l-4 ${
      transaction.tipo === 'ingreso'
        ? 'bg-green-50 border-green-500'
        : 'bg-red-50 border-red-500'
    }`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-lg">{transaction.descripcion}</h3>
            <span className={`text-xs px-2 py-1 rounded ${
              transaction.tipo === 'ingreso'
                ? 'bg-green-200 text-green-800'
                : 'bg-red-200 text-red-800'
            }`}>
              {transaction.categoria}
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            {formatDate(transaction.fecha)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <p className={`text-xl font-bold ${
            transaction.tipo === 'ingreso' ? 'text-green-700' : 'text-red-700'
          }`}>
            {transaction.tipo === 'ingreso' ? '+' : '-'}{formatCurrency(transaction.monto)}
          </p>
          <button
            onClick={() => onDelete(transaction.id)}
            className="text-gray-400 hover:text-red-600 transition-colors"
            aria-label="Eliminar transacción"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
