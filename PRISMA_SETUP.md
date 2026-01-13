# Configuración de Prisma con PostgreSQL

Esta guía te ayudará a configurar Prisma con tu base de datos PostgreSQL (Supabase u otra).

## 📋 ¿Qué es Prisma?

Prisma es un ORM (Object-Relational Mapping) moderno para Node.js y TypeScript que:
- ✅ Proporciona type-safety completo desde la base de datos hasta tu código
- ✅ Genera tipos TypeScript automáticamente
- ✅ Maneja migraciones de base de datos
- ✅ Permite trabajar con entidades y clases
- ✅ Funciona con PostgreSQL, MySQL, SQLite, MongoDB, etc.

## 🎯 Arquitectura de la Aplicación

```
Navegador (Cliente)
       ↓
  Fetch API
       ↓
API Routes (Next.js) ← Tu código en el servidor
       ↓
  Prisma Client (ORM)
       ↓
  PostgreSQL (Supabase)
```

## 🚀 Paso 1: Obtener Connection String de Supabase

1. Ve a https://supabase.com/dashboard
2. Selecciona tu proyecto
3. Ve a **Settings** → **Database**
4. Encuentra la sección **Connection String**
5. Selecciona **Transaction Mode** (no Session Mode)
6. Copia la connection string, se ve así:

```
postgresql://postgres:[PASSWORD]@db.xxxxxxxxxxxxx.supabase.co:5432/postgres
```

7. Reemplaza `[PASSWORD]` con tu contraseña de base de datos

## 🔐 Paso 2: Configurar Variables de Entorno

### Desarrollo Local

Crea un archivo `.env.local` en la raíz del proyecto:

```bash
# .env.local
DATABASE_URL="postgresql://postgres:tu-password@db.xxxxx.supabase.co:5432/postgres"
```

### Producción (Vercel)

1. Ve a tu proyecto en Vercel
2. **Settings** → **Environment Variables**
3. Agrega:
   - **Key**: `DATABASE_URL`
   - **Value**: Tu connection string completa
   - **Environments**: Production, Preview, Development

## 🗄️ Paso 3: Crear/Verificar la Tabla

Si ya creaste la tabla con Supabase Client, verifica que exista. Si no, puedes:

### Opción A: Usar Prisma Migrate (Recomendado)

```bash
# Generar migración desde el schema
npx prisma migrate dev --name init

# Esto creará:
# - La tabla en la base de datos
# - Un archivo de migración en prisma/migrations/
```

### Opción B: Usar SQL directo en Supabase

Si la tabla ya existe, solo necesitas:

```bash
# Generar el cliente de Prisma
npx prisma generate
```

Si necesitas crearla, ejecuta en Supabase SQL Editor:

```sql
CREATE TABLE transactions (
  id text PRIMARY KEY,
  tipo text NOT NULL,
  monto double precision NOT NULL,
  categoria text NOT NULL,
  descripcion text NOT NULL,
  fecha text NOT NULL,
  fecha_creacion bigint NOT NULL
);

-- Agregar índices para mejor rendimiento
CREATE INDEX idx_transactions_tipo ON transactions(tipo);
CREATE INDEX idx_transactions_categoria ON transactions(categoria);
CREATE INDEX idx_transactions_fecha ON transactions(fecha);
CREATE INDEX idx_transactions_fecha_creacion ON transactions(fecha_creacion);
```

## 🏗️ Paso 4: Generar Cliente de Prisma

Cada vez que cambies el schema, ejecuta:

```bash
npx prisma generate
```

Esto genera los tipos TypeScript y el cliente de Prisma.

## 🧪 Paso 5: Probar la Conexión

```bash
# Abrir Prisma Studio (interfaz visual)
npx prisma studio
```

Esto abrirá una interfaz web donde puedes ver y editar tus datos.

## 🔄 Cómo Funciona el Código

### 1. Schema de Prisma (`prisma/schema.prisma`)

```prisma
model Transaction {
  id            String   @id @default(uuid())
  tipo          String
  monto         Float
  categoria     String
  descripcion   String
  fecha         String
  fechaCreacion BigInt   @map("fecha_creacion")

  @@map("transactions")
}
```

### 2. Cliente de Prisma (`lib/prisma.ts`)

```typescript
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();
```

### 3. Entidades con Métodos (`entities/TransactionEntity.ts`)

```typescript
export class TransactionEntity {
  constructor(private data: Transaction) {}

  isExpense(): boolean {
    return this.data.tipo === 'gasto';
  }

  getFormattedAmount(): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(this.data.monto);
  }

  // Más métodos...
}
```

### 4. Repository Pattern (`repositories/TransactionRepository.ts`)

```typescript
export class TransactionRepository {
  async findAll(): Promise<TransactionEntity[]> {
    const transactions = await prisma.transaction.findMany();
    return transactions.map(t => new TransactionEntity(t));
  }

  async create(data): Promise<TransactionEntity> {
    const transaction = await prisma.transaction.create({ data });
    return new TransactionEntity(transaction);
  }

  // Más métodos...
}
```

### 5. API Routes (`app/api/transactions/route.ts`)

```typescript
import { TransactionRepository } from '@/repositories/TransactionRepository';

const repository = new TransactionRepository();

export async function GET() {
  const transactions = await repository.findAll();
  return NextResponse.json(transactions.map(t => t.toJSON()));
}

export async function POST(request: Request) {
  const body = await request.json();
  const transaction = await repository.create(body);
  return NextResponse.json(transaction.toJSON());
}
```

### 6. Hook del Cliente (`hooks/useTransactions.ts`)

```typescript
const loadTransactions = async () => {
  const response = await fetch('/api/transactions');
  const data = await response.json();
  setTransactions(data);
};

const addTransaction = async (transaction) => {
  await fetch('/api/transactions', {
    method: 'POST',
    body: JSON.stringify(transaction),
  });
};
```

## 📊 Flujo Completo

### Crear Transacción

```
1. Usuario llena formulario
2. Frontend llama: POST /api/transactions
3. API Route recibe request
4. Repository.create() se ejecuta
5. Prisma ejecuta INSERT en PostgreSQL
6. Supabase guarda en la base de datos
7. Respuesta regresa al cliente
8. UI se actualiza
```

### Leer Transacciones

```
1. Usuario abre la app
2. Frontend llama: GET /api/transactions
3. API Route recibe request
4. Repository.findAll() se ejecuta
5. Prisma ejecuta SELECT en PostgreSQL
6. Datos vienen desde Supabase
7. Se convierten a TransactionEntity
8. Respuesta regresa con JSON
9. UI renderiza la lista
```

## 🔄 Comandos Útiles de Prisma

```bash
# Ver el estado de las migraciones
npx prisma migrate status

# Crear una nueva migración
npx prisma migrate dev --name nombre_descriptivo

# Aplicar migraciones en producción
npx prisma migrate deploy

# Resetear la base de datos (CUIDADO: borra todo)
npx prisma migrate reset

# Abrir Prisma Studio
npx prisma studio

# Generar cliente después de cambios en schema
npx prisma generate

# Formatear el schema
npx prisma format

# Validar el schema
npx prisma validate
```

## 🆚 Prisma vs Supabase Client

| Característica | Prisma | Supabase Client |
|----------------|--------|-----------------|
| **Ubicación** | Servidor (API Routes) | Cliente (Navegador) |
| **Type Safety** | ⭐⭐⭐⭐⭐ Excelente | ⭐⭐⭐ Bueno |
| **Entidades** | ✅ Sí (con clases) | ⚠️ Manual |
| **Migraciones** | ✅ Automáticas | ❌ SQL manual |
| **Validación** | ✅ Servidor | ⚠️ Cliente |
| **Seguridad** | ✅ Backend | ⚠️ RLS |
| **Real-time** | ❌ No | ✅ Sí |
| **Complejidad** | ⭐⭐⭐⭐ Alta | ⭐⭐ Baja |

## 🎓 Ventajas de Prisma

### 1. Type Safety Completo

```typescript
// ❌ Sin Prisma (propenso a errores)
const result = await supabase
  .from('transactionss') // Error de typo no detectado
  .select('monnto'); // Error de typo no detectado

// ✅ Con Prisma (TypeScript te protege)
const result = await prisma.transaction.findMany({
  select: {
    monto: true, // Autocompletado y validación
  },
});
```

### 2. Métodos de Negocio

```typescript
const transaction = new TransactionEntity(data);

// Métodos útiles
if (transaction.isExpense()) {
  console.log(transaction.getFormattedAmount());
  console.log(transaction.calculatePercentage(total));
}

const validation = transaction.validate();
if (!validation.valid) {
  console.error(validation.errors);
}
```

### 3. Migraciones Automáticas

```bash
# Cambias el schema
model Transaction {
  // Agregar nuevo campo
  notas String? // Campo opcional
}

# Prisma genera la migración
npx prisma migrate dev --name agregar_notas

# Se actualiza la base de datos automáticamente
```

### 4. Relaciones Fáciles

```prisma
model User {
  id           String        @id @default(uuid())
  email        String        @unique
  transactions Transaction[]
}

model Transaction {
  id     String @id
  user   User   @relation(fields: [userId], references: [id])
  userId String
}
```

```typescript
// Obtener usuario con sus transacciones
const user = await prisma.user.findUnique({
  where: { id: userId },
  include: {
    transactions: true,
  },
});
```

## 🛠️ Solución de Problemas

### Error: Can't reach database server

```bash
# Verifica la connection string
echo $DATABASE_URL

# Prueba la conexión
npx prisma db pull
```

### Error: Table doesn't exist

```bash
# Crear la tabla con Prisma
npx prisma migrate dev

# O usar el SQL de Supabase
```

### Error: Environment variable not found

```bash
# Verifica que existe .env.local
cat .env.local

# Reinicia el servidor de desarrollo
npm run dev
```

### Cambios en schema no se reflejan

```bash
# Regenerar el cliente
npx prisma generate

# Reiniciar el servidor
npm run dev
```

## 📚 Recursos

- [Documentación oficial de Prisma](https://www.prisma.io/docs)
- [Prisma con Next.js](https://www.prisma.io/nextjs)
- [Prisma con Supabase](https://www.prisma.io/docs/guides/database/supabase)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)

## 🎯 Próximos Pasos

1. **Agregar autenticación**: Integrar usuarios con Supabase Auth
2. **Categorías personalizadas**: Permitir crear categorías propias
3. **Presupuestos**: Agregar límites mensuales
4. **Reportes**: Gráficos y estadísticas
5. **Adjuntos**: Subir fotos de facturas

Consulta la documentación para implementar estas características.
