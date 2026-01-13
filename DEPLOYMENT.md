# Cómo Acceder a la Aplicación desde tu Celular

Como la aplicación está en GitHub, tienes varias opciones para usarla desde tu celular:

## Opción 1: Desplegar en Vercel (Gratis y Fácil) ⭐ RECOMENDADO

Vercel es perfecto para Next.js y puedes hacerlo desde tu celular:

### Pasos desde tu celular:

1. **Abre tu navegador** y ve a https://vercel.com

2. **Regístrate o inicia sesión** con tu cuenta de GitHub

3. **Haz clic en "Add New..." → Project**

4. **Importa tu repositorio**:
   - Busca `Prueba-claude`
   - Haz clic en "Import"

5. **Configura el proyecto**:
   - Framework Preset: Next.js (se detecta automáticamente)
   - Root Directory: `./`
   - Build Command: `npm run build` (por defecto)
   - Output Directory: `.next` (por defecto)

6. **Haz clic en "Deploy"**

7. **Espera 2-3 minutos** y tendrás una URL como:
   - `https://prueba-claude-xxxxx.vercel.app`

8. **Abre esa URL desde tu celular** y listo!

### Actualizaciones automáticas:
- Cada vez que hagas un push a la rama `claude/expense-tracking-app-ar86y`, Vercel actualizará automáticamente tu aplicación

---

## Opción 2: Netlify (Alternativa Gratis)

1. Ve a https://netlify.com
2. Regístrate con GitHub
3. Click "Add new site" → "Import an existing project"
4. Selecciona tu repositorio `Prueba-claude`
5. Configuración:
   - Build command: `npm run build`
   - Publish directory: `.next`
6. Deploy

---

## Opción 3: GitHub Pages con Static Export

Esta opción requiere modificar el código para exportar estático:

1. Modifica `next.config.ts` para agregar `output: 'export'`
2. GitHub Actions puede generar y publicar automáticamente

⚠️ **Limitación**: No funcionará el localStorage en el servidor, solo en el cliente

---

## Opción 4: Ejecutar en tu Computadora y Acceder desde el Celular

Si tienes una computadora en la misma red WiFi:

1. En tu computadora:
   ```bash
   git clone https://github.com/anfazaba-droid/Prueba-claude
   cd Prueba-claude
   npm install
   npm run dev -- -H 0.0.0.0
   ```

2. Encuentra la IP de tu computadora:
   - Windows: `ipconfig`
   - Mac/Linux: `ifconfig` o `ip addr`

3. En tu celular, abre el navegador y ve a:
   - `http://[IP-DE-TU-COMPUTADORA]:3000`
   - Ejemplo: `http://192.168.1.100:3000`

---

## ¿Cuál elegir?

- **Para uso permanente desde cualquier lugar**: Vercel o Netlify
- **Para pruebas rápidas en casa**: Opción 4 (red local)
- **Si no tienes computadora**: Vercel desde el navegador del celular

## Nota Importante sobre localStorage

La aplicación usa `localStorage` para guardar los datos. Esto significa:
- ✅ Los datos se guardan en tu dispositivo (celular)
- ✅ No necesitas base de datos
- ⚠️ Los datos son solo en tu navegador
- ⚠️ Si borras el caché del navegador, perderás los datos
- ⚠️ Los datos no se sincronizan entre dispositivos

Si necesitas sincronización entre dispositivos, se puede agregar una base de datos (Firebase, Supabase, etc.)
