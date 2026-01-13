'use client';

import { useState, useEffect } from 'react';
import { Transaction, Summary } from '@/types';

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('transactions');
    if (stored) {
      setTransactions(JSON.parse(stored));
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('transactions', JSON.stringify(transactions));
    }
  }, [transactions, isLoaded]);

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'fecha_creacion'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: crypto.randomUUID(),
      fecha_creacion: Date.now(),
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const getSummary = (): Summary => {
    const totalIngresos = transactions
      .filter(t => t.tipo === 'ingreso')
      .reduce((sum, t) => sum + t.monto, 0);

    const totalGastos = transactions
      .filter(t => t.tipo === 'gasto')
      .reduce((sum, t) => sum + t.monto, 0);

    return {
      totalIngresos,
      totalGastos,
      balance: totalIngresos - totalGastos,
    };
  };

  return {
    transactions,
    addTransaction,
    deleteTransaction,
    getSummary,
    isLoaded,
  };
}
