'use client';

import { Summary as SummaryType } from '@/types';

interface SummaryProps {
  summary: SummaryType;
}

export default function Summary({ summary }: SummaryProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-green-50 p-6 rounded-lg shadow-md border-l-4 border-green-500">
        <h3 className="text-sm font-medium text-green-800 mb-1">Ingresos</h3>
        <p className="text-2xl font-bold text-green-900">
          {formatCurrency(summary.totalIngresos)}
        </p>
      </div>

      <div className="bg-red-50 p-6 rounded-lg shadow-md border-l-4 border-red-500">
        <h3 className="text-sm font-medium text-red-800 mb-1">Gastos</h3>
        <p className="text-2xl font-bold text-red-900">
          {formatCurrency(summary.totalGastos)}
        </p>
      </div>

      <div className={`p-6 rounded-lg shadow-md border-l-4 ${
        summary.balance >= 0
          ? 'bg-blue-50 border-blue-500'
          : 'bg-orange-50 border-orange-500'
      }`}>
        <h3 className={`text-sm font-medium mb-1 ${
          summary.balance >= 0 ? 'text-blue-800' : 'text-orange-800'
        }`}>
          Balance
        </h3>
        <p className={`text-2xl font-bold ${
          summary.balance >= 0 ? 'text-blue-900' : 'text-orange-900'
        }`}>
          {formatCurrency(summary.balance)}
        </p>
      </div>
    </div>
  );
}
