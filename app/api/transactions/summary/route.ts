import { NextResponse } from 'next/server';
import { TransactionRepository } from '@/repositories/TransactionRepository';

const repository = new TransactionRepository();

/**
 * GET /api/transactions/summary
 * Obtener resumen de ingresos, gastos y balance
 */
export async function GET() {
  try {
    const summary = await repository.getSummary();
    return NextResponse.json(summary);
  } catch (error) {
    console.error('Error fetching summary:', error);
    return NextResponse.json(
      { error: 'Error al obtener el resumen' },
      { status: 500 }
    );
  }
}
