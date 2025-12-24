# 🔧 Solución: Error de Login en Vercel

## ❌ Problema Identificado

Cuando intentas hacer login en el admin panel de Vercel, te redirige a la página principal en lugar del dashboard.

**Causa:** Firebase Auth no tiene autorizado el dominio de Vercel.

---

## ✅ Solución (2 minutos)

### Paso 1: Obtén tu URL de Vercel

Tu sitio en Vercel debería ser algo como:
- `https://orkiosk-next.vercel.app`
- O `https://orkiosk-next-[tu-usuario].vercel.app`

**Copia la URL completa** de tu navegador.

### Paso 2: Agregar Dominio a Firebase Auth

1. **Abre Firebase Console:**
   https://console.firebase.google.com/project/orkiosk-web/authentication/settings

2. **Desplázate hasta "Dominios autorizados"**

3. **Haz clic en "Agregar dominio"**

4. **Pega tu dominio de Vercel** (solo la parte del dominio, sin `https://`)
   - Ejemplo: `orkiosk-next.vercel.app`
   - O: `orkiosk-next-wkreative.vercel.app`

5. **Haz clic en "Agregar"**

### Paso 3: Probar de Nuevo

1. Recarga la página de login en Vercel
2. Intenta iniciar sesión nuevamente
3. Ahora debería funcionar correctamente ✅

---

## 📋 Dominios Actualmente Autorizados

Según Firebase Console, estos son los dominios que YA están autorizados:

- ✅ `localhost` (para desarrollo local)
- ✅ `orkiosk-web.firebaseapp.com` (Firebase Hosting)
- ✅ `orkiosk-web.web.app` (Firebase Hosting)

**Falta agregar:** Tu dominio de Vercel

---

## 🎥 Guía Visual

He dejado abierta la página de Firebase Auth Settings para que puedas agregar el dominio fácilmente.

---

## ⚠️ Nota Importante

Si más adelante configuras un dominio personalizado (como `orkiosk.com`), también tendrás que agregarlo a esta lista de dominios autorizados.

---

## 🆘 Si Sigue sin Funcionar

Después de agregar el dominio, si aún tienes problemas:

1. **Limpia la caché del navegador** (Ctrl + Shift + Delete)
2. **Cierra sesión** de cualquier cuenta de Firebase
3. **Intenta en modo incógnito**
4. **Verifica que el dominio esté escrito correctamente** (sin espacios, sin https://)

---

## ✨ Después de Arreglarlo

Una vez que funcione el login:

1. Inicia sesión en el admin panel
2. Crea un post de prueba
3. Verifica que aparezca en el blog
4. ¡Tu sitio estará completamente funcional! 🎉
