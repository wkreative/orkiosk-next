# 🚀 Despliegue con Vercel - Guía Rápida

## ✅ Configuración Inicial (Solo una vez)

### Paso 1: Crear Cuenta en Vercel

1. Ve a: https://vercel.com/signup
2. Haz clic en "Continue with GitHub"
3. Autoriza Vercel para acceder a tu GitHub

### Paso 2: Importar Proyecto

1. En Vercel, haz clic en "Add New..." → "Project"
2. Busca y selecciona `wkreative/orkiosk-next`
3. Haz clic en "Import"

### Paso 3: Configurar Variables de Entorno

En la página de configuración del proyecto, agrega estas variables:

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDGvN8F5bRQ0KqJ3xY7wZ9mL4nP6tX8sU0
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=orkiosk-web.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=orkiosk-web
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=orkiosk-web.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=563584335869
NEXT_PUBLIC_FIREBASE_APP_ID=1:563584335869:web:b4c8e9f3a2d1c5e6f7g8h9
```

### Paso 4: Desplegar

1. Haz clic en "Deploy"
2. Espera 2-3 minutos
3. ¡Listo!

---

## 🔄 Despliegues Futuros (Automático)

Cada vez que hagas cambios:

```bash
git add .
git commit -m "Descripción de cambios"
git push origin main
```

**¡Eso es todo!** Vercel detecta el push y despliega automáticamente.

---

## 🌐 URLs

Después del primer deploy, tendrás:
- **Producción:** `https://orkiosk-next.vercel.app`
- **CMS:** `https://orkiosk-next.vercel.app/es/admin1/login`

Puedes configurar tu dominio personalizado `orkiosk.com` después.

---

## 💰 Costo

**$0/mes** - El plan gratuito de Vercel es más que suficiente para tu proyecto.

---

## ✨ Ventajas

- ✅ Deploy automático con cada `git push`
- ✅ Preview deployments para cada PR
- ✅ CDN global ultra rápido
- ✅ SSL automático
- ✅ Zero configuration para Next.js
- ✅ Logs y analytics incluidos
