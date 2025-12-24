# 🚀 Despliegue a Firebase

## Paso 1: Actualizar a Firebase Blaze

Antes de desplegar, necesitas actualizar tu proyecto a Firebase Blaze:

1. Ve a: https://console.firebase.google.com/u/0/project/orkiosk-web/usage/details
2. Haz clic en "Modificar plan" o "Upgrade to Blaze"
3. Vincula tu tarjeta de crédito
4. Configura un presupuesto de alerta de $10/mes

## Paso 2: Desplegar

Una vez actualizado a Blaze, ejecuta:

```bash
npm run deploy
```

Eso es todo. El comando hará:
- ✅ Build de Next.js
- ✅ Deploy de Functions
- ✅ Deploy de Hosting
- ✅ Deploy de Firestore rules
- ✅ Deploy de Storage rules

## 🎯 Acceso al CMS

Después del despliegue, tu CMS estará disponible en:
- https://orkiosk.com/admin1/login
- https://orkiosk.com/es/admin1/login

## 💰 Costo Estimado

Con tráfico bajo/medio: $0-5/mes
