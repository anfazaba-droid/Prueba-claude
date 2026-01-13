import { prisma } from '@/lib/prisma';
import { TransactionEntity } from '@/entities/TransactionEntity';
import { Transaction, TransactionType, Summary } from '@/types';

export class TransactionRepository {
  /**
   * Obtener todas las transacciones ordenadas por fecha de creación
   */
  async findAll(): Promise<TransactionEntity[]> {
    const transactions = await prisma.transaction.findMany({
      orderBy: { fechaCreacion: 'desc' },
    });

    return transactions.map((t: any) => new TransactionEntity(t));
  }

  /**
   * Buscar una transacción por ID
   */
  async findById(id: string): Promise<TransactionEntity | null> {
    const transaction = await prisma.transaction.findUnique({
      where: { id },
    });

    return transaction ? new TransactionEntity(transaction) : null;
  }

  /**
   * Buscar transacciones por tipo
   */
  async findByType(tipo: TransactionType): Promise<TransactionEntity[]> {
    const transactions = await prisma.transaction.findMany({
      where: { tipo },
      orderBy: { fechaCreacion: 'desc' },
    });

    return transactions.map((t: any) => new TransactionEntity(t));
  }

  /**
   * Buscar transacciones por categoría
   */
  async findByCategory(categoria: string): Promise<TransactionEntity[]> {
    const transactions = await prisma.transaction.findMany({
      where: { categoria },
      orderBy: { fechaCreacion: 'desc' },
    });

    return transactions.map((t: any) => new TransactionEntity(t));
  }

  /**
   * Buscar transacciones en un rango de fechas
   */
  async findByDateRange(startDate: string, endDate: string): Promise<TransactionEntity[]> {
    const transactions = await prisma.transaction.findMany({
      where: {
        fecha: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { fechaCreacion: 'desc' },
    });

    return transactions.map((t: any) => new TransactionEntity(t));
  }

  /**
   * Buscar transacciones del mes actual
   */
  async findCurrentMonth(): Promise<TransactionEntity[]> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      .toISOString()
      .split('T')[0];
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      .toISOString()
      .split('T')[0];

    return this.findByDateRange(startOfMonth, endOfMonth);
  }

  /**
   * Crear una nueva transacción
   */
  async create(data: Omit<Transaction, 'id' | 'fecha_creacion'>): Promise<TransactionEntity> {
    const transaction = await prisma.transaction.create({
      data: {
        id: crypto.randomUUID(),
        tipo: data.tipo,
        monto: data.monto,
        categoria: data.categoria,
        descripcion: data.descripcion,
        fecha: data.fecha,
        fechaCreacion: BigInt(Date.now()),
      },
    });

    return new TransactionEntity(transaction);
  }

  /**
   * Actualizar una transacción existente
   */
  async update(
    id: string,
    data: Partial<Omit<Transaction, 'id' | 'fecha_creacion'>>
  ): Promise<TransactionEntity | null> {
    try {
      const transaction = await prisma.transaction.update({
        where: { id },
        data: {
          ...(data.tipo && { tipo: data.tipo }),
          ...(data.monto !== undefined && { monto: data.monto }),
          ...(data.categoria && { categoria: data.categoria }),
          ...(data.descripcion && { descripcion: data.descripcion }),
          ...(data.fecha && { fecha: data.fecha }),
        },
      });

      return new TransactionEntity(transaction);
    } catch (error) {
      return null;
    }
  }

  /**
   * Eliminar una transacción
   */
  async delete(id: string): Promise<boolean> {
    try {
      await prisma.transaction.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Obtener el total por tipo
   */
  async getTotalByType(tipo: TransactionType): Promise<number> {
    const result = await prisma.transaction.aggregate({
      where: { tipo },
      _sum: {
        monto: true,
      },
    });

    return result._sum.monto || 0;
  }

  /**
   * Obtener resumen de ingresos, gastos y balance
   */
  async getSummary(): Promise<Summary> {
    const totalIngresos = await this.getTotalByType('ingreso');
    const totalGastos = await this.getTotalByType('gasto');

    return {
      totalIngresos,
      totalGastos,
      balance: totalIngresos - totalGastos,
    };
  }

  /**
   * Obtener transacciones agrupadas por categoría
   */
  async getGroupedByCategory(): Promise<Record<string, TransactionEntity[]>> {
    const transactions = await this.findAll();
    const grouped: Record<string, TransactionEntity[]> = {};

    transactions.forEach(transaction => {
      const categoria = transaction.categoria;
      if (!grouped[categoria]) {
        grouped[categoria] = [];
      }
      grouped[categoria].push(transaction);
    });

    return grouped;
  }

  /**
   * Obtener totales por categoría
   */
  async getTotalsByCategory(): Promise<Record<string, number>> {
    const transactions = await prisma.transaction.groupBy({
      by: ['categoria'],
      _sum: {
        monto: true,
      },
    });

    const totals: Record<string, number> = {};
    transactions.forEach((item: any) => {
      totals[item.categoria] = item._sum.monto || 0;
    });

    return totals;
  }

  /**
   * Contar transacciones
   */
  async count(): Promise<number> {
    return await prisma.transaction.count();
  }

  /**
   * Eliminar todas las transacciones (usar con cuidado)
   */
  async deleteAll(): Promise<number> {
    const result = await prisma.transaction.deleteMany();
    return result.count;
  }
}
