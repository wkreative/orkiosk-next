# 🚀 Guía de Despliegue en Vercel

## ✅ Código Listo en GitHub

Tu código ya está actualizado en: `https://github.com/wkreative/orkiosk-next`

---

## 📋 Paso a Paso para Desplegar

### Paso 1: Crear Cuenta en Vercel (2 minutos)

1. **Abre esta URL:** https://vercel.com/signup
2. **Haz clic en:** "Continue with GitHub"
3. **Autoriza Vercel** cuando GitHub te lo pida

### Paso 2: Importar tu Proyecto (1 minuto)

1. En el Dashboard de Vercel, haz clic en **"Add New..."** → **"Project"**
2. Busca el repositorio: **`wkreative/orkiosk-next`**
3. Haz clic en **"Import"**

### Paso 3: Configurar Variables de Entorno (2 minutos)

En la sección "Environment Variables", agrega estas 6 variables:

#### Variable 1
- **Name:** `NEXT_PUBLIC_FIREBASE_API_KEY`
- **Value:** `AIzaSyDGvN8F5bRQ0KqJ3xY7wZ9mL4nP6tX8sU0`

#### Variable 2
- **Name:** `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- **Value:** `orkiosk-web.firebaseapp.com`

#### Variable 3
- **Name:** `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- **Value:** `orkiosk-web`

#### Variable 4
- **Name:** `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- **Value:** `orkiosk-web.firebasestorage.app`

#### Variable 5
- **Name:** `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- **Value:** `563584335869`

#### Variable 6
- **Name:** `NEXT_PUBLIC_FIREBASE_APP_ID`
- **Value:** `1:563584335869:web:b4c8e9f3a2d1c5e6f7g8h9`

### Paso 4: Desplegar (3 minutos)

1. Haz clic en **"Deploy"**
2. Espera 2-3 minutos mientras Vercel construye tu sitio
3. ¡Listo! 🎉

---

## 🌐 URLs de tu Sitio

Después del despliegue, tu sitio estará disponible en:

- **Sitio Web:** `https://orkiosk-next.vercel.app`
- **Admin Panel:** `https://orkiosk-next.vercel.app/es/admin1/login`

---

## 🔐 Acceso al Admin Panel

Usa las credenciales que configuraste en Firebase:
- **Email:** `minesartgallery@gmail.com` (o el que hayas configurado)
- **Contraseña:** La que estableciste en Firebase Auth

---

## 🔄 Despliegues Futuros (100% Automático)

Cada vez que hagas cambios en el código:

```bash
git add .
git commit -m "Descripción de cambios"
git push
```

**Vercel desplegará automáticamente** en 1-2 minutos. No necesitas hacer nada más.

---

## 💰 Costo

**$0/mes** - Completamente gratis con el plan Hobby de Vercel

---

## 🎯 Próximos Pasos

1. **Verifica el sitio web** - Navega por las páginas principales
2. **Prueba el admin panel** - Inicia sesión y crea un post de prueba
3. **Configura dominio personalizado** (opcional) - Puedes agregar `orkiosk.com` en la configuración de Vercel

---

## 🆘 Si Algo Sale Mal

- **Error de build:** Revisa los logs en el dashboard de Vercel
- **Variables de entorno:** Verifica que todas las 6 variables estén correctas
- **Firebase Auth:** Asegúrate de que el dominio de Vercel esté autorizado en Firebase Console

---

## ✨ Ventajas de Vercel

- ✅ **Despliegue automático** desde GitHub
- ✅ **Preview deployments** para cada pull request
- ✅ **Analytics** incluidos
- ✅ **SSL/HTTPS** automático
- ✅ **CDN global** para máxima velocidad
- ✅ **Rollback** instantáneo a versiones anteriores
