# 🚀 Guía de Despliegue en Netlify

## Paso 1: Crear Cuenta (2 minutos)

1. Ve a: **https://app.netlify.com/signup**
2. Haz clic en **"GitHub"**
3. Autoriza Netlify

---

## Paso 2: Importar Proyecto (1 minuto)

1. Clic en **"Add new site"** → **"Import an existing project"**
2. Selecciona **"Deploy with GitHub"**
3. Busca y selecciona: **`wkreative/orkiosk-next`**

---

## Paso 3: Configurar Build (2 minutos)

**Build settings:**
- **Build command:** `npm run build`
- **Publish directory:** `.next`
- **Functions directory:** (dejar vacío)

**Environment variables** (agregar las 6):

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDGvN8F5bRQ0KqJ3xY7wZ9mL4nP6tX8sU0
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=orkiosk-web.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=orkiosk-web
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=orkiosk-web.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=563584335869
NEXT_PUBLIC_FIREBASE_APP_ID=1:563584335869:web:b4c8e9f3a2d1c5e6f7g8h9
```

---

## Paso 4: Deploy (3 minutos)

1. Clic en **"Deploy [nombre-del-sitio]"**
2. Espera 2-3 minutos
3. ¡Listo!

---

## Paso 5: Configurar Firebase Auth (1 minuto)

1. Copia la URL de Netlify (ej: `https://orkiosk-abc123.netlify.app`)
2. Ve a: https://console.firebase.google.com/project/orkiosk-web/authentication/settings
3. En "Dominios autorizados" → **"Agregar dominio"**
4. Pega tu URL de Netlify
5. Guarda

---

## ✅ URLs Finales

- **Sitio:** `https://[tu-sitio].netlify.app`
- **Admin:** `https://[tu-sitio].netlify.app/es/admin1/login`

---

## 🎯 Publicar Contenido

1. Entra al admin: `https://[tu-sitio].netlify.app/es/admin1/login`
2. Inicia sesión con tu email de Firebase
3. Crea un post
4. ¡Aparece automáticamente en el blog!

**Sin complicaciones. Sin pasos extras.**

---

## 🌐 Dominio Personalizado (Opcional)

Cuando quieras usar `orkiosk.com`:

1. Netlify → **Domain settings** → **Add custom domain**
2. Sigue las instrucciones para actualizar DNS
3. Listo en 10 minutos

---

## 💰 Costo

**$0/mes** - Completamente gratis
