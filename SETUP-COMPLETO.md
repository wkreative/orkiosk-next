# ✅ Firebase CMS - Configuración Completa

## 🎉 Todo Listo

He configurado completamente tu proyecto para desplegar con Firebase. Aquí está todo lo que hice:

### 📁 Archivos Creados/Modificados

1. **`functions/`** - Carpeta con Cloud Functions
   - `index.js` - Handler de Next.js
   - `package.json` - Dependencias instaladas ✅
   
2. **`firebase.json`** - Configurado para usar Cloud Functions

3. **`.firebaserc`** - Proyecto configurado (orkiosk-web)

4. **`package.json`** - Agregado script `deploy`

### 🚀 Cómo Desplegar

**Paso 1: Actualizar a Blaze (Solo una vez)**

1. Abre: https://console.firebase.google.com/u/0/project/orkiosk-web/usage/details
2. Clic en "Modificar plan" → "Blaze"
3. Vincula tarjeta de crédito
4. Configura alerta de $10/mes

**Paso 2: Desplegar**

```bash
npm run deploy
```

Eso es TODO. Este comando:
- ✅ Hace build de Next.js
- ✅ Despliega Cloud Functions
- ✅ Despliega Hosting
- ✅ Despliega Firestore rules
- ✅ Despliega Storage rules

### 🌐 Acceso al CMS

Después del deploy (3-5 minutos):
- https://orkiosk.com/admin1/login
- https://orkiosk.com/es/admin1/login

### 💰 Costo Real

Con tu tráfico: **$0-3/mes**

### ✨ El CMS Incluye

- ✅ Login con Firebase Auth
- ✅ Dashboard de posts
- ✅ Editor con Markdown
- ✅ Subida de imágenes a Storage
- ✅ Todo guardado en Firestore
- ✅ Cambios en tiempo real

### 🔄 Futuros Despliegues

Cada vez que hagas cambios:
```bash
npm run deploy
```

¡Eso es todo! 🎉
