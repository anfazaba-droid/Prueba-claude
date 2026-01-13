'use client';

import { useState, FormEvent } from 'react';
import { TransactionType, CATEGORIAS_GASTOS, CATEGORIAS_INGRESOS } from '@/types';

interface TransactionFormProps {
  onAdd: (transaction: {
    tipo: TransactionType;
    monto: number;
    categoria: string;
    descripcion: string;
    fecha: string;
  }) => void;
}

export default function TransactionForm({ onAdd }: TransactionFormProps) {
  const [tipo, setTipo] = useState<TransactionType>('gasto');
  const [monto, setMonto] = useState('');
  const [categoria, setCategoria] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fecha, setFecha] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  const categorias = tipo === 'gasto' ? CATEGORIAS_GASTOS : CATEGORIAS_INGRESOS;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!monto || !categoria || !descripcion || !fecha) {
      alert('Por favor completa todos los campos');
      return;
    }

    onAdd({
      tipo,
      monto: parseFloat(monto),
      categoria,
      descripcion,
      fecha,
    });

    setMonto('');
    setCategoria('');
    setDescripcion('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Nueva Transacción</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Tipo</label>
        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              value="gasto"
              checked={tipo === 'gasto'}
              onChange={(e) => {
                setTipo(e.target.value as TransactionType);
                setCategoria('');
              }}
              className="mr-2"
            />
            Gasto
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="ingreso"
              checked={tipo === 'ingreso'}
              onChange={(e) => {
                setTipo(e.target.value as TransactionType);
                setCategoria('');
              }}
              className="mr-2"
            />
            Ingreso
          </label>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Monto</label>
        <input
          type="number"
          step="0.01"
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="0.00"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Categoría</label>
        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Selecciona una categoría</option>
          {categorias.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Descripción</label>
        <input
          type="text"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ej: Compra de supermercado"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Fecha</label>
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        className={`w-full py-2 px-4 rounded-md text-white font-medium ${
          tipo === 'gasto'
            ? 'bg-red-500 hover:bg-red-600'
            : 'bg-green-500 hover:bg-green-600'
        }`}
      >
        Agregar {tipo === 'gasto' ? 'Gasto' : 'Ingreso'}
      </button>
    </form>
  );
}
