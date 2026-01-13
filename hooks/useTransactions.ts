'use client';

import { useState, useEffect } from 'react';
import { Transaction, Summary } from '@/types';
import { supabase } from '@/lib/supabase';

const SUPABASE_ENABLED = !!(
  supabase &&
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    if (SUPABASE_ENABLED && supabase) {
      try {
        const { data, error } = await supabase
          .from('transactions')
          .select('*')
          .order('fecha_creacion', { ascending: false });

        if (error) throw error;

        if (data) {
          setTransactions(data as Transaction[]);
          localStorage.setItem('transactions', JSON.stringify(data));
        }
      } catch (err) {
        console.error('Error loading from Supabase:', err);
        setError('Error al cargar desde la base de datos. Usando datos locales.');
        loadFromLocalStorage();
      }
    } else {
      loadFromLocalStorage();
    }
    setIsLoaded(true);
  };

  const loadFromLocalStorage = () => {
    const stored = localStorage.getItem('transactions');
    if (stored) {
      setTransactions(JSON.parse(stored));
    }
  };

  useEffect(() => {
    if (isLoaded && !SUPABASE_ENABLED) {
      localStorage.setItem('transactions', JSON.stringify(transactions));
    }
  }, [transactions, isLoaded]);

  const addTransaction = async (transaction: Omit<Transaction, 'id' | 'fecha_creacion'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: crypto.randomUUID(),
      fecha_creacion: Date.now(),
    };

    if (SUPABASE_ENABLED && supabase) {
      try {
        const { error } = await supabase
          .from('transactions')
          .insert([newTransaction]);

        if (error) throw error;

        setTransactions(prev => [newTransaction, ...prev]);
        setError(null);
      } catch (err) {
        console.error('Error adding to Supabase:', err);
        setError('Error al guardar. Los cambios solo se guardarán localmente.');
        setTransactions(prev => [newTransaction, ...prev]);
        localStorage.setItem('transactions', JSON.stringify([newTransaction, ...transactions]));
      }
    } else {
      setTransactions(prev => [newTransaction, ...prev]);
    }
  };

  const deleteTransaction = async (id: string) => {
    if (SUPABASE_ENABLED && supabase) {
      try {
        const { error } = await supabase
          .from('transactions')
          .delete()
          .eq('id', id);

        if (error) throw error;

        setTransactions(prev => prev.filter(t => t.id !== id));
        setError(null);
      } catch (err) {
        console.error('Error deleting from Supabase:', err);
        setError('Error al eliminar de la base de datos.');
      }
    } else {
      setTransactions(prev => prev.filter(t => t.id !== id));
    }
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
    error,
    usingSupabase: SUPABASE_ENABLED,
  };
}
