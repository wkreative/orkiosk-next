# 🎯 Proyecto Final: orkiosk-web en Vercel

## ✅ Configuración Correcta

**Proyecto a usar:** `orkiosk-web` (este repositorio)
**URL en Vercel:** Se configurará como `orkiosk-web.vercel.app`

---

## 📝 Pasos Finales

### 1. Limpiar Proyectos en Vercel

Si ya creaste otros proyectos en Vercel (como `orkiosk-next`), elimínalos para evitar confusión:

1. Ve a tu Dashboard de Vercel
2. Encuentra proyectos antiguos (ej: `orkiosk-next`)
3. Settings → Delete Project

### 2. Crear Nuevo Proyecto en Vercel

1. **Dashboard de Vercel** → "Add New..." → "Project"
2. **Importar:** `wkreative/orkiosk-next` (el repositorio de GitHub)
3. **Nombre del proyecto:** Cámbialo a `orkiosk-web`
4. **Framework:** Next.js (detectado automáticamente)

### 3. Variables de Entorno

Agrega estas 6 variables:

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDGvN8F5bRQ0KqJ3xY7wZ9mL4nP6tX8sU0
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=orkiosk-web.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=orkiosk-web
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=orkiosk-web.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=563584335869
NEXT_PUBLIC_FIREBASE_APP_ID=1:563584335869:web:b4c8e9f3a2d1c5e6f7g8h9
```

### 4. Deploy

Haz clic en **"Deploy"** y espera 2-3 minutos.

---

## 🌐 URLs Finales

Después del deploy:

- **Sitio web:** `https://orkiosk-web.vercel.app`
- **Admin panel:** `https://orkiosk-web.vercel.app/es/admin1/login`

---

## 🔐 Firebase Auth - Dominio Autorizado

**IMPORTANTE:** Después del deploy, agrega el dominio a Firebase:

1. Ve a: https://console.firebase.google.com/project/orkiosk-web/authentication/settings
2. En "Dominios autorizados" → "Agregar dominio"
3. Agrega: `orkiosk-web.vercel.app`
4. Guarda

---

## ✨ Resultado Final

- ✅ Proyecto limpio: solo `orkiosk-web`
- ✅ URL clara: `orkiosk-web.vercel.app`
- ✅ Sin confusión con otros proyectos
- ✅ Todo funcionando correctamente

---

## 💰 Costo

**$0/mes** - Completamente gratis
