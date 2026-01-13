# Configuración de Supabase para Sincronización en la Nube

Esta guía te ayudará a configurar Supabase para que tus datos se guarden en la nube y se sincronicen entre todos tus dispositivos.

## 📋 Requisitos Previos

- Una cuenta de GitHub (la usarás para iniciar sesión en Supabase)
- Acceso a tu proyecto desplegado en Vercel

## 🚀 Paso 1: Crear Cuenta en Supabase

1. Ve a https://supabase.com
2. Haz clic en **"Start your project"** o **"Sign in"**
3. Selecciona **"Continue with GitHub"**
4. Autoriza a Supabase para acceder a tu cuenta de GitHub

## 🗄️ Paso 2: Crear un Nuevo Proyecto

1. Una vez dentro, haz clic en **"New Project"**
2. Llena los campos:
   - **Name**: `expense-tracker` (o el nombre que prefieras)
   - **Database Password**: Genera una contraseña segura y guárdala
   - **Region**: Selecciona la región más cercana a ti (ej: South America - São Paulo)
   - **Pricing Plan**: Free (gratis hasta 500MB)
3. Haz clic en **"Create new project"**
4. Espera 1-2 minutos mientras se crea el proyecto

## 🔑 Paso 3: Obtener las Credenciales

1. En el menú lateral, haz clic en el icono de **engranaje** (Settings)
2. Selecciona **"API"**
3. Encontrarás dos valores importantes:

   - **Project URL**: Algo como `https://abcdefgh12345678.supabase.co`
   - **anon/public key**: Una clave larga que empieza con `eyJ...`

4. **Copia estos valores**, los necesitarás en el siguiente paso

## 📊 Paso 4: Crear la Tabla de Transacciones

1. En el menú lateral, haz clic en **"Table Editor"**
2. Haz clic en **"Create a new table"**
3. Configura la tabla:
   - **Name**: `transactions`
   - Desmarca **"Enable Row Level Security (RLS)"** por ahora
4. Agrega las siguientes columnas (haz clic en "Add column" para cada una):

| Nombre         | Tipo        | Default Value    | Configuración        |
|----------------|-------------|------------------|----------------------|
| id             | text        | -                | Primary key          |
| tipo           | text        | -                | -                    |
| monto          | float8      | -                | -                    |
| categoria      | text        | -                | -                    |
| descripcion    | text        | -                | -                    |
| fecha          | text        | -                | -                    |
| fecha_creacion | int8        | -                | -                    |

5. Haz clic en **"Save"**

### O usa este SQL (más rápido)

En el menú lateral, ve a **"SQL Editor"** y ejecuta:

```sql
-- Crear tabla de transacciones
CREATE TABLE transactions (
  id text PRIMARY KEY,
  tipo text NOT NULL,
  monto float8 NOT NULL,
  categoria text NOT NULL,
  descripcion text NOT NULL,
  fecha text NOT NULL,
  fecha_creacion bigint NOT NULL
);

-- Permitir acceso público (sin autenticación)
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON transactions
  FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON transactions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable delete access for all users" ON transactions
  FOR DELETE USING (true);
```

## 🔐 Paso 5: Configurar Variables de Entorno en Vercel

Ahora necesitas agregar las credenciales a tu proyecto en Vercel:

### Opción A: Desde el Navegador de tu Celular

1. Ve a https://vercel.com/dashboard
2. Selecciona tu proyecto **"Prueba-claude"**
3. Ve a **"Settings"** (arriba)
4. En el menú lateral, selecciona **"Environment Variables"**
5. Agrega las dos variables:

   **Variable 1:**
   - Key: `NEXT_PUBLIC_SUPABASE_URL`
   - Value: Pega tu Project URL (ej: `https://abcdefgh12345678.supabase.co`)
   - Environments: Selecciona **Production**, **Preview**, y **Development**

   **Variable 2:**
   - Key: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Value: Pega tu anon/public key
   - Environments: Selecciona **Production**, **Preview**, y **Development**

6. Haz clic en **"Save"** para cada variable

## 🔄 Paso 6: Re-desplegar en Vercel

1. Ve a la pestaña **"Deployments"** en tu proyecto de Vercel
2. Busca el último deployment (el más reciente)
3. Haz clic en los tres puntos **⋮** a la derecha
4. Selecciona **"Redeploy"**
5. Confirma la acción
6. Espera 2-3 minutos a que termine

## ✅ Paso 7: Verificar que Funcione

1. Abre tu aplicación en el navegador: `https://tu-proyecto.vercel.app`
2. En la parte superior, deberías ver un badge que dice: **☁️ Sincronizado en la nube**
3. Agrega una transacción de prueba
4. Ve a Supabase → Table Editor → transactions
5. Deberías ver tu transacción guardada

## 🔄 Migrar Datos Existentes (Opcional)

Si ya tenías datos guardados en localStorage:

1. Abre tu aplicación en el navegador
2. Abre la consola del navegador (F12)
3. Ve a la pestaña "Console"
4. Ejecuta este código:

```javascript
// Obtener datos del localStorage
const data = JSON.parse(localStorage.getItem('transactions') || '[]');

// Copiar al portapapeles
copy(data);
```

5. Ve a Supabase → SQL Editor
6. Ejecuta (reemplaza los datos):

```sql
INSERT INTO transactions (id, tipo, monto, categoria, descripcion, fecha, fecha_creacion)
VALUES
  -- Pega aquí tus datos en formato SQL
  -- Ejemplo:
  -- ('uuid-1', 'gasto', 50.0, 'Alimentación', 'Compra supermercado', '2024-01-15', 1705334400000);
```

## 🎉 ¡Listo!

Ahora tu aplicación está conectada a Supabase. Los datos:
- ✅ Se guardan en la nube
- ✅ Se sincronizan entre todos tus dispositivos
- ✅ No se pierden si borras el caché del navegador
- ✅ Tienen respaldo automático en Supabase

## 🛠️ Solución de Problemas

### No veo el badge "☁️ Sincronizado en la nube"

- Verifica que las variables de entorno estén correctamente configuradas en Vercel
- Asegúrate de haber re-desplegado después de agregar las variables
- Revisa la consola del navegador (F12) para ver errores

### Error al guardar transacciones

- Verifica que la tabla `transactions` exista en Supabase
- Verifica que las políticas de Row Level Security permitan acceso público
- Revisa que los nombres de las columnas sean exactos

### Los datos no se sincronizan entre dispositivos

- Asegúrate de que ambos dispositivos usen la misma URL de Vercel
- Recarga la página en ambos dispositivos
- Verifica en Supabase Table Editor que los datos estén ahí

## 🔒 Seguridad (Opcional - Avanzado)

Actualmente, la aplicación permite que cualquiera con el link pueda ver y modificar las transacciones. Si quieres hacerla privada:

1. Implementa autenticación de Supabase
2. Modifica las políticas de RLS para que solo el usuario autenticado pueda ver sus propias transacciones
3. Agrega un campo `user_id` a la tabla

Esto requiere cambios adicionales en el código. Avísame si quieres implementarlo.
