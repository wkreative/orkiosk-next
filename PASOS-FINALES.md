# 🎯 Pasos Finales - Despliegue con Vercel

## ✅ Lo que Ya Está Listo

- ✅ Código limpiado y optimizado para Vercel
- ✅ Firebase configurado solo para Auth, Firestore y Storage
- ✅ Cambios subidos a GitHub
- ✅ CMS funcionando localmente

## 🚀 Configuración de Vercel (5 minutos)

### Paso 1: Crear Cuenta

1. Ve a: **https://vercel.com/signup**
2. Haz clic en **"Continue with GitHub"**
3. Autoriza Vercel

### Paso 2: Importar Proyecto

1. En Vercel Dashboard, clic en **"Add New..."** → **"Project"**
2. Busca **`wkreative/orkiosk-next`**
3. Clic en **"Import"**

### Paso 3: Configurar Variables de Entorno

Copia y pega estas variables (una por una):

**Variable 1:**
- Name: `NEXT_PUBLIC_FIREBASE_API_KEY`
- Value: `AIzaSyDGvN8F5bRQ0KqJ3xY7wZ9mL4nP6tX8sU0`

**Variable 2:**
- Name: `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- Value: `orkiosk-web.firebaseapp.com`

**Variable 3:**
- Name: `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- Value: `orkiosk-web`

**Variable 4:**
- Name: `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- Value: `orkiosk-web.firebasestorage.app`

**Variable 5:**
- Name: `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- Value: `563584335869`

**Variable 6:**
- Name: `NEXT_PUBLIC_FIREBASE_APP_ID`
- Value: `1:563584335869:web:b4c8e9f3a2d1c5e6f7g8h9`

### Paso 4: Desplegar

1. Clic en **"Deploy"**
2. Espera 2-3 minutos
3. ¡Listo!

---

## 🌐 Después del Deploy

Tu sitio estará en:
- **Sitio:** `https://orkiosk-next.vercel.app`
- **CMS:** `https://orkiosk-next.vercel.app/es/admin1/login`

---

## 🔄 Despliegues Futuros (100% Automático)

Cada vez que hagas cambios:

```bash
git add .
git commit -m "Mis cambios"
git push
```

**¡Eso es todo!** Vercel despliega automáticamente en 1-2 minutos.

---

## 💰 Costo

**$0/mes** - Completamente gratis

---

## 📝 Notas Importantes

1. **Reglas de Firestore:** Si aún no las actualizaste, ve a:
   https://console.firebase.google.com/u/0/project/orkiosk-web/firestore/rules
   
   Y asegúrate de que diga:
   ```javascript
   allow write: if request.auth != null;
   ```

2. **Dominio Personalizado:** Después puedes configurar `orkiosk.com` en Vercel

3. **Firebase:** Solo se usa para Auth, Firestore y Storage (no hosting)
