export type TransactionType = 'ingreso' | 'gasto';

export interface Transaction {
  id: string;
  tipo: TransactionType;
  monto: number;
  categoria: string;
  descripcion: string;
  fecha: string;
  fecha_creacion: number;
}

export const CATEGORIAS_GASTOS = [
  'Alimentación',
  'Transporte',
  'Vivienda',
  'Servicios',
  'Salud',
  'Educación',
  'Entretenimiento',
  'Ropa',
  'Otro',
] as const;

export const CATEGORIAS_INGRESOS = [
  'Salario',
  'Freelance',
  'Inversiones',
  'Ventas',
  'Otro',
] as const;

export type CategoriaGasto = typeof CATEGORIAS_GASTOS[number];
export type CategoriaIngreso = typeof CATEGORIAS_INGRESOS[number];

export interface GroupedTransactions {
  [categoria: string]: Transaction[];
}

export interface Summary {
  totalIngresos: number;
  totalGastos: number;
  balance: number;
}
