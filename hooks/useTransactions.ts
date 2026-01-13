'use client';

import { useState, useEffect } from 'react';
import { Transaction, Summary } from '@/types';
import { supabase } from '@/lib/supabase';

// Detectar qué modo usar
const SUPABASE_ENABLED = !!(
  supabase &&
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Si no hay Supabase, asumimos que usaremos Prisma vía API Routes
const USE_API = !SUPABASE_ENABLED;

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    // Modo 1: Usar API Routes con Prisma
    if (USE_API) {
      try {
        const response = await fetch('/api/transactions');
        if (!response.ok) throw new Error('Error al cargar transacciones');

        const data = await response.json();
        setTransactions(data);
        localStorage.setItem('transactions', JSON.stringify(data));
      } catch (err) {
        console.error('Error loading from API:', err);
        setError('Error al cargar desde la base de datos. Usando datos locales.');
        loadFromLocalStorage();
      }
    }
    // Modo 2: Usar Supabase directamente
    else if (SUPABASE_ENABLED && supabase) {
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
    }
    // Modo 3: Solo localStorage
    else {
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
    if (isLoaded && !SUPABASE_ENABLED && !USE_API) {
      localStorage.setItem('transactions', JSON.stringify(transactions));
    }
  }, [transactions, isLoaded]);

  const addTransaction = async (transaction: Omit<Transaction, 'id' | 'fecha_creacion'>) => {
    // Modo 1: Usar API Routes con Prisma
    if (USE_API) {
      try {
        const response = await fetch('/api/transactions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(transaction),
        });

        if (!response.ok) throw new Error('Error al crear transacción');

        const newTransaction = await response.json();
        setTransactions(prev => [newTransaction, ...prev]);
        setError(null);
      } catch (err) {
        console.error('Error adding via API:', err);
        setError('Error al guardar. Los cambios solo se guardarán localmente.');

        const newTransaction: Transaction = {
          ...transaction,
          id: crypto.randomUUID(),
          fecha_creacion: Date.now(),
        };
        setTransactions(prev => [newTransaction, ...prev]);
        localStorage.setItem('transactions', JSON.stringify([newTransaction, ...transactions]));
      }
    }
    // Modo 2: Usar Supabase directamente
    else if (SUPABASE_ENABLED && supabase) {
      const newTransaction: Transaction = {
        ...transaction,
        id: crypto.randomUUID(),
        fecha_creacion: Date.now(),
      };

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
    }
    // Modo 3: Solo localStorage
    else {
      const newTransaction: Transaction = {
        ...transaction,
        id: crypto.randomUUID(),
        fecha_creacion: Date.now(),
      };
      setTransactions(prev => [newTransaction, ...prev]);
    }
  };

  const deleteTransaction = async (id: string) => {
    // Modo 1: Usar API Routes con Prisma
    if (USE_API) {
      try {
        const response = await fetch(`/api/transactions/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) throw new Error('Error al eliminar transacción');

        setTransactions(prev => prev.filter(t => t.id !== id));
        setError(null);
      } catch (err) {
        console.error('Error deleting via API:', err);
        setError('Error al eliminar de la base de datos.');
      }
    }
    // Modo 2: Usar Supabase directamente
    else if (SUPABASE_ENABLED && supabase) {
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
    }
    // Modo 3: Solo localStorage
    else {
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

  const getStorageMode = (): string => {
    if (USE_API) return 'prisma';
    if (SUPABASE_ENABLED) return 'supabase';
    return 'local';
  };

  return {
    transactions,
    addTransaction,
    deleteTransaction,
    getSummary,
    isLoaded,
    error,
    usingSupabase: SUPABASE_ENABLED,
    storageMode: getStorageMode(),
  };
}
