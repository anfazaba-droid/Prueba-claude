import { Transaction, TransactionType } from '@/types';

// Tipo para datos de Prisma
interface PrismaTransactionData {
  id: string;
  tipo: string;
  monto: number;
  categoria: string;
  descripcion: string;
  fecha: string;
  fechaCreacion: bigint | number;
}

export class TransactionEntity {
  private data: Transaction;

  constructor(data: PrismaTransactionData | Transaction) {
    // Si ya es Transaction, usarlo directamente
    if ('fecha_creacion' in data) {
      this.data = data as Transaction;
    }
    // Si es de Prisma, convertir
    else {
      this.data = {
        id: data.id,
        tipo: data.tipo as TransactionType,
        monto: data.monto,
        categoria: data.categoria,
        descripcion: data.descripcion,
        fecha: data.fecha,
        fecha_creacion: typeof data.fechaCreacion === 'bigint'
          ? Number(data.fechaCreacion)
          : data.fechaCreacion,
      };
    }
  }

  // Getters
  get id(): string {
    return this.data.id;
  }

  get tipo(): TransactionType {
    return this.data.tipo;
  }

  get monto(): number {
    return this.data.monto;
  }

  get categoria(): string {
    return this.data.categoria;
  }

  get descripcion(): string {
    return this.data.descripcion;
  }

  get fecha(): string {
    return this.data.fecha;
  }

  get fechaCreacion(): number {
    return this.data.fecha_creacion;
  }

  // Métodos de negocio
  isExpense(): boolean {
    return this.data.tipo === 'gasto';
  }

  isIncome(): boolean {
    return this.data.tipo === 'ingreso';
  }

  getFormattedAmount(): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(this.data.monto);
  }

  getFormattedDate(): string {
    const date = new Date(this.data.fecha + 'T00:00:00');
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  getMonthYear(): string {
    const date = new Date(this.data.fecha + 'T00:00:00');
    return date.toLocaleDateString('es-ES', {
      month: 'long',
      year: 'numeric',
    });
  }

  calculatePercentage(total: number): number {
    if (total === 0) return 0;
    return (this.data.monto / total) * 100;
  }

  // Validaciones
  validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (this.data.monto <= 0) {
      errors.push('El monto debe ser mayor a 0');
    }

    if (!this.data.descripcion.trim()) {
      errors.push('La descripción es requerida');
    }

    if (!['gasto', 'ingreso'].includes(this.data.tipo)) {
      errors.push('Tipo inválido (debe ser "gasto" o "ingreso")');
    }

    if (!this.data.categoria.trim()) {
      errors.push('La categoría es requerida');
    }

    if (!this.data.fecha) {
      errors.push('La fecha es requerida');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  // Comparaciones
  isOlderThan(days: number): boolean {
    const transactionDate = new Date(this.data.fecha).getTime();
    const now = Date.now();
    const diffInDays = (now - transactionDate) / (1000 * 60 * 60 * 24);
    return diffInDays > days;
  }

  isSameMonth(date: Date): boolean {
    const transactionDate = new Date(this.data.fecha);
    return (
      transactionDate.getMonth() === date.getMonth() &&
      transactionDate.getFullYear() === date.getFullYear()
    );
  }

  isInDateRange(startDate: Date, endDate: Date): boolean {
    const transactionDate = new Date(this.data.fecha).getTime();
    return (
      transactionDate >= startDate.getTime() &&
      transactionDate <= endDate.getTime()
    );
  }

  // Transformaciones
  toJSON(): Transaction {
    return { ...this.data };
  }

  toPrismaFormat(): Omit<PrismaTransactionData, 'id'> {
    return {
      tipo: this.data.tipo,
      monto: this.data.monto,
      categoria: this.data.categoria,
      descripcion: this.data.descripcion,
      fecha: this.data.fecha,
      fechaCreacion: BigInt(this.data.fecha_creacion),
    };
  }

  toSummary(): string {
    const tipo = this.isExpense() ? 'Gasto' : 'Ingreso';
    return `${tipo} de ${this.getFormattedAmount()} en ${this.data.categoria} - ${this.data.descripcion}`;
  }

  toString(): string {
    return this.toSummary();
  }
}
