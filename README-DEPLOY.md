# Firebase CMS - Listo para Desplegar 🚀

## ✅ Todo Configurado

He configurado completamente Firebase Functions para que Next.js funcione con tu CMS.

### 📋 Próximos Pasos

**1. Actualizar a Firebase Blaze (Solo una vez)**

Ve a esta URL y actualiza tu plan:
https://console.firebase.google.com/u/0/project/orkiosk-web/usage/details

- Haz clic en "Modificar plan" → "Blaze"
- Vincula tu tarjeta
- Configura alerta de presupuesto: $10/mes

**2. Desplegar (Un solo comando)**

```bash
npm run deploy
```

Este comando hace TODO automáticamente:
- ✅ Build de Next.js
- ✅ Deploy de Cloud Functions
- ✅ Deploy de Hosting  
- ✅ Deploy de Firestore rules
- ✅ Deploy de Storage rules

**3. Acceder al CMS**

Después del deploy (tarda 3-5 minutos):
- https://orkiosk.com/admin1/login
- https://orkiosk.com/es/admin1/login

### 💰 Costo Real Estimado

Con tu tráfico actual: **$0-3/mes**

### 🔄 Despliegues Futuros

Cada vez que hagas cambios:
```bash
npm run deploy
```

¡Eso es todo! 🎉
