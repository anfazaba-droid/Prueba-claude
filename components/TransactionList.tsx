'use client';

import { useState, useMemo } from 'react';
import { Transaction } from '@/types';
import TransactionItem from './TransactionItem';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

type SortBy = 'fecha' | 'monto' | 'categoria';
type FilterBy = 'todas' | 'ingreso' | 'gasto';
type ViewMode = 'lista' | 'agrupado';

export default function TransactionList({ transactions, onDelete }: TransactionListProps) {
  const [sortBy, setSortBy] = useState<SortBy>('fecha');
  const [filterBy, setFilterBy] = useState<FilterBy>('todas');
  const [viewMode, setViewMode] = useState<ViewMode>('lista');

  const filteredAndSorted = useMemo(() => {
    let filtered = transactions;

    if (filterBy !== 'todas') {
      filtered = transactions.filter(t => t.tipo === filterBy);
    }

    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'fecha':
          return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
        case 'monto':
          return b.monto - a.monto;
        case 'categoria':
          return a.categoria.localeCompare(b.categoria);
        default:
          return 0;
      }
    });

    return sorted;
  }, [transactions, sortBy, filterBy]);

  const groupedTransactions = useMemo(() => {
    const grouped: { [key: string]: Transaction[] } = {};

    filteredAndSorted.forEach(transaction => {
      const key = transaction.categoria;
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(transaction);
    });

    return grouped;
  }, [filteredAndSorted]);

  const renderGrouped = () => {
    const categories = Object.keys(groupedTransactions).sort();

    return categories.map(categoria => {
      const categoryTransactions = groupedTransactions[categoria];
      const total = categoryTransactions.reduce((sum, t) => sum + t.monto, 0);

      return (
        <div key={categoria} className="mb-6">
          <div className="bg-gray-100 p-3 rounded-t-lg flex justify-between items-center">
            <h3 className="font-bold text-lg">{categoria}</h3>
            <span className="text-sm text-gray-600">
              {categoryTransactions.length} transacción(es) - Total: {formatCurrency(total)}
            </span>
          </div>
          <div className="space-y-2 p-2 bg-gray-50 rounded-b-lg">
            {categoryTransactions.map(transaction => (
              <TransactionItem
                key={transaction.id}
                transaction={transaction}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      );
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-xl">No hay transacciones registradas</p>
        <p className="text-sm mt-2">Agrega tu primera transacción usando el formulario</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="mb-6">
        <div className="flex flex-wrap gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">Ordenar por:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortBy)}
              className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="fecha">Fecha</option>
              <option value="monto">Monto</option>
              <option value="categoria">Categoría</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Filtrar por:</label>
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value as FilterBy)}
              className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="todas">Todas</option>
              <option value="ingreso">Ingresos</option>
              <option value="gasto">Gastos</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Vista:</label>
            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value as ViewMode)}
              className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="lista">Lista</option>
              <option value="agrupado">Agrupado por categoría</option>
            </select>
          </div>
        </div>

        <p className="text-sm text-gray-600">
          Mostrando {filteredAndSorted.length} de {transactions.length} transacciones
        </p>
      </div>

      {viewMode === 'lista' ? (
        <div className="space-y-3">
          {filteredAndSorted.map(transaction => (
            <TransactionItem
              key={transaction.id}
              transaction={transaction}
              onDelete={onDelete}
            />
          ))}
        </div>
      ) : (
        renderGrouped()
      )}
    </div>
  );
}
