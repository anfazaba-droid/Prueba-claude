import { NextResponse } from 'next/server';
import { TransactionRepository } from '@/repositories/TransactionRepository';

const repository = new TransactionRepository();

/**
 * GET /api/transactions/[id]
 * Obtener una transacción por ID
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const transaction = await repository.findById(id);

    if (!transaction) {
      return NextResponse.json(
        { error: 'Transacción no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(transaction.toJSON());
  } catch (error) {
    console.error('Error fetching transaction:', error);
    return NextResponse.json(
      { error: 'Error al obtener la transacción' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/transactions/[id]
 * Eliminar una transacción
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const success = await repository.delete(id);

    if (!success) {
      return NextResponse.json(
        { error: 'Transacción no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Transacción eliminada exitosamente' });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    return NextResponse.json(
      { error: 'Error al eliminar la transacción' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/transactions/[id]
 * Actualizar una transacción
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const transaction = await repository.update(id, body);

    if (!transaction) {
      return NextResponse.json(
        { error: 'Transacción no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(transaction.toJSON());
  } catch (error) {
    console.error('Error updating transaction:', error);
    return NextResponse.json(
      { error: 'Error al actualizar la transacción' },
      { status: 500 }
    );
  }
}
