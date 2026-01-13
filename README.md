# Gestor de Gastos e Ingresos

Aplicación web para gestionar y controlar tus finanzas personales, llevando registro de gastos e ingresos mensuales.

## Características

- **Formulario de entrada**: Agrega transacciones especificando tipo (gasto/ingreso), monto, categoría, descripción y fecha
- **Categorización automática**: Categorías predefinidas para gastos e ingresos
- **Ordenamiento**: Ordena transacciones por fecha, monto o categoría
- **Filtrado**: Filtra por tipo de transacción (todas, ingresos, gastos)
- **Vista agrupada**: Agrupa transacciones por categoría con totales
- **Resumen visual**: Tarjetas con totales de ingresos, gastos y balance
- **Almacenamiento local**: Los datos persisten usando localStorage
- **Diseño responsivo**: Optimizado para móviles, tablets y escritorio

## Tecnologías

- **Next.js 16** con App Router
- **TypeScript** para type safety
- **Tailwind CSS** para estilos
- **React Hooks** para gestión de estado

## Instalación

1. Instala las dependencias:

```bash
npm install
```

2. Ejecuta el servidor de desarrollo:

```bash
npm run dev
```

3. Abre [http://localhost:3000](http://localhost:3000) en tu navegador

## Uso

### Agregar Transacciones

1. Selecciona el tipo: Gasto o Ingreso
2. Ingresa el monto
3. Selecciona una categoría
4. Agrega una descripción
5. Selecciona la fecha
6. Haz clic en "Agregar Gasto" o "Agregar Ingreso"

### Ordenar y Filtrar

- **Ordenar por**: Fecha, Monto o Categoría
- **Filtrar por**: Todas, Ingresos o Gastos
- **Vista**: Lista o Agrupado por categoría

### Eliminar Transacciones

Haz clic en el icono de papelera junto a cualquier transacción para eliminarla.

## Estructura del Proyecto

```
├── app/
│   ├── layout.tsx       # Layout principal
│   ├── page.tsx         # Página principal
│   └── globals.css      # Estilos globales
├── components/
│   ├── Summary.tsx            # Resumen de totales
│   ├── TransactionForm.tsx    # Formulario de entrada
│   ├── TransactionList.tsx    # Lista de transacciones
│   └── TransactionItem.tsx    # Item individual
├── hooks/
│   └── useTransactions.ts     # Hook de estado
└── types/
    └── index.ts               # Definiciones de tipos
```

## Categorías

### Gastos
- Alimentación
- Transporte
- Vivienda
- Servicios
- Salud
- Educación
- Entretenimiento
- Ropa
- Otro

### Ingresos
- Salario
- Freelance
- Inversiones
- Ventas
- Otro

## Scripts

- `npm run dev` - Ejecuta el servidor de desarrollo
- `npm run build` - Crea una build de producción
- `npm start` - Ejecuta el servidor de producción
- `npm run lint` - Ejecuta el linter

## Build de Producción

```bash
npm run build
npm start
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)
