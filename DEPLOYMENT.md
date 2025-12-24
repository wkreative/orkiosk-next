# Orkiosk CMS - Guía de Despliegue

## 🎯 Resumen

Tu CMS de Firebase está completamente funcional. Aquí te explico cómo usarlo:

## 🚀 Opción 1: Ejecutar Localmente (Recomendado para desarrollo)

```bash
# 1. Construir el proyecto
npm run build

# 2. Iniciar el servidor
npm start
```

Luego abre tu navegador en `http://localhost:3000/admin1/login`

## 🌐 Opción 2: Desplegar a Producción

Para desplegar tu sitio con el CMS funcionando, tienes estas opciones:

### A) Vercel (Gratis y Fácil - RECOMENDADO)
1. Sube tu código a GitHub (ya lo tienes)
2. Ve a [vercel.com](https://vercel.com)
3. Conecta tu repositorio `wkreative/orkiosk-next`
4. Agrega las variables de entorno de Firebase en Vercel
5. ¡Despliega!

### B) Firebase Hosting + Cloud Run (Requiere plan Blaze)
Si quieres usar Firebase Hosting con Next.js dinámico, necesitas:
1. Actualizar a Firebase Blaze plan
2. Configurar Cloud Run
3. Usar `firebase deploy`

### C) Netlify (Gratis)
Similar a Vercel, conecta tu repo y despliega.

## 📝 Variables de Entorno Necesarias

Asegúrate de configurar estas variables en tu plataforma de despliegue:

```
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id
```

## ✅ El CMS Ya Funciona

- ✅ Login con Firebase Auth
- ✅ Dashboard para ver posts
- ✅ Crear y editar posts
- ✅ Subir imágenes a Firebase Storage
- ✅ Todo guardado en Firestore

¿Prefieres que te ayude a configurar Vercel para un despliegue automático?
