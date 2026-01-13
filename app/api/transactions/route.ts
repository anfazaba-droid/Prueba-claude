import { NextResponse } from 'next/server';
import { TransactionRepository } from '@/repositories/TransactionRepository';
import { Transaction } from '@/types';

const repository = new TransactionRepository();

/**
 * GET /api/transactions
 * Obtener todas las transacciones
 */
export async function GET() {
  try {
    const transactions = await repository.findAll();
    const data = transactions.map(t => t.toJSON());

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { error: 'Error al obtener las transacciones' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/transactions
 * Crear una nueva transacción
 */
export async function POST(request: Request) {
  try {
    const body: Omit<Transaction, 'id' | 'fecha_creacion'> = await request.json();

    // Validar datos básicos
    if (!body.tipo || !body.monto || !body.categoria || !body.descripcion || !body.fecha) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    if (body.monto <= 0) {
      return NextResponse.json(
        { error: 'El monto debe ser mayor a 0' },
        { status: 400 }
      );
    }

    if (!['gasto', 'ingreso'].includes(body.tipo)) {
      return NextResponse.json(
        { error: 'Tipo inválido' },
        { status: 400 }
      );
    }

    const transaction = await repository.create(body);

    return NextResponse.json(transaction.toJSON(), { status: 201 });
  } catch (error) {
    console.error('Error creating transaction:', error);
    return NextResponse.json(
      { error: 'Error al crear la transacción' },
      { status: 500 }
    );
  }
}
