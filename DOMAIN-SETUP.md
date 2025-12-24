# 🌐 Configuración de Dominio: orkiosk.com

## 📋 Situación Actual

- **orkiosk.com** → Hosting actual
- **orkiosk.com/admin** → Panel de administración de kioscos (plataforma separada)
- **Nueva web** → Desplegada en Vercel

## 🎯 Objetivo

- **orkiosk.com** → Nueva web en Vercel
- **orkiosk.com/admin** → Mantener panel actual de kioscos

---

## ✅ Solución 1: Vercel Rewrites (RECOMENDADA)

### Ventajas
- ✅ Más simple de configurar
- ✅ No requiere cambios en tu servidor actual
- ✅ Todo el tráfico pasa por Vercel (mejor para SEO)
- ✅ SSL automático para todo

### Cómo Funciona

```
Usuario visita orkiosk.com/admin
    ↓
Vercel recibe la petición
    ↓
Vercel hace proxy a tu servidor actual
    ↓
Usuario ve el panel de kioscos
```

### Configuración

#### 1. En `next.config.js` (YA CONFIGURADO)

```javascript
async rewrites() {
  return [
    {
      source: '/admin/:path*',
      destination: 'https://tu-servidor-actual.com/admin/:path*',
    },
  ]
}
```

**Reemplaza `tu-servidor-actual.com` con:**
- La URL actual donde está tu panel de kioscos
- Ejemplo: `https://admin.orkiosk.com`
- O: `https://tu-servidor.herokuapp.com`
- O: `https://12.34.56.78` (IP directa)

#### 2. En Vercel

1. **Agrega el dominio:**
   - Settings → Domains
   - Add `orkiosk.com`
   - Copiar DNS records

2. **Configura DNS en tu proveedor:**
   - Tipo: `A` o `CNAME`
   - Valor: Lo que Vercel te indique

#### 3. Espera propagación (24-48h)

---

## 🔄 Solución 2: Subdominios (ALTERNATIVA)

Si prefieres mantener todo separado:

### Configuración

- **orkiosk.com** → Vercel (nueva web)
- **admin.orkiosk.com** → Tu servidor actual (panel kioscos)
- **blog.orkiosk.com** → Vercel (opcional, para el blog)

### Ventajas
- ✅ Separación clara
- ✅ Más fácil de mantener
- ✅ Cada servicio independiente

### Desventajas
- ⚠️ Requiere cambiar URLs en tu plataforma
- ⚠️ Los usuarios deben usar `admin.orkiosk.com` en lugar de `orkiosk.com/admin`

### DNS Configuration

```
orkiosk.com          A/CNAME  → Vercel
admin.orkiosk.com    A/CNAME  → Tu servidor actual
www.orkiosk.com      CNAME    → orkiosk.com
```

---

## 📊 Comparación

| Aspecto | Rewrites (Solución 1) | Subdominios (Solución 2) |
|---------|----------------------|-------------------------|
| **Simplicidad** | ⭐⭐⭐ | ⭐⭐ |
| **SEO** | ⭐⭐⭐ | ⭐⭐⭐ |
| **Mantenimiento** | ⭐⭐⭐ | ⭐⭐ |
| **URLs** | orkiosk.com/admin | admin.orkiosk.com |
| **Cambios requeridos** | Mínimos | Moderados |

---

## 🚀 Pasos para Implementar (Solución 1)

### Paso 1: Obtener URL Actual del Panel

Necesitas saber dónde está alojado actualmente tu panel de kioscos:

```bash
# Opción A: Si tienes un dominio
https://admin.orkiosk.com

# Opción B: Si está en un servidor
https://tu-servidor.com/admin

# Opción C: Si es una IP
https://12.34.56.78/admin
```

### Paso 2: Actualizar next.config.js

Reemplaza `tu-servidor-actual.com` con la URL real:

```javascript
async rewrites() {
  return [
    {
      source: '/admin/:path*',
      destination: 'https://AQUI-TU-URL-REAL/admin/:path*',
    },
  ]
}
```

### Paso 3: Commit y Push

```bash
git add next.config.js
git commit -m "Add proxy for /admin to existing kiosk panel"
git push
```

### Paso 4: Configurar Dominio en Vercel

1. Ve a tu proyecto en Vercel
2. Settings → Domains
3. Add Domain: `orkiosk.com`
4. Vercel te dará instrucciones DNS

### Paso 5: Actualizar DNS

En tu proveedor de dominio (GoDaddy, Namecheap, etc.):

**Si Vercel te da IP (A Record):**
```
Type: A
Name: @
Value: 76.76.21.21 (ejemplo)
```

**Si Vercel te da CNAME:**
```
Type: CNAME
Name: @
Value: cname.vercel-dns.com
```

### Paso 6: Esperar y Probar

1. **Espera 24-48h** para propagación DNS
2. **Prueba:**
   - `orkiosk.com` → Debe mostrar tu nueva web
   - `orkiosk.com/admin` → Debe mostrar tu panel de kioscos

---

## ⚠️ Consideraciones Importantes

### CORS (Cross-Origin Resource Sharing)

Si tu panel de kioscos hace peticiones API, puede que necesites configurar CORS en tu servidor actual:

```javascript
// En tu servidor actual
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://orkiosk.com');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});
```

### Cookies y Sesiones

Si tu panel usa cookies para autenticación:

```javascript
// Asegúrate de que las cookies tengan el dominio correcto
res.cookie('session', token, {
  domain: '.orkiosk.com', // Nota el punto al inicio
  secure: true,
  httpOnly: true,
});
```

### SSL/HTTPS

- ✅ Vercel proporciona SSL automático para `orkiosk.com`
- ⚠️ Tu servidor actual DEBE tener SSL también
- Si no tiene SSL, el proxy fallará (mixed content)

---

## 🔧 Troubleshooting

### Problema: /admin muestra 404

**Solución:**
- Verifica que la URL en `next.config.js` sea correcta
- Asegúrate de que tu servidor actual esté funcionando
- Revisa los logs de Vercel

### Problema: /admin muestra error de CORS

**Solución:**
- Configura CORS en tu servidor actual
- Permite origen `https://orkiosk.com`

### Problema: Las cookies no funcionan

**Solución:**
- Configura cookies con dominio `.orkiosk.com`
- Asegúrate de que ambos sitios usen HTTPS

---

## 📝 Información Necesaria

Para completar la configuración, necesito que me proporciones:

1. **¿Dónde está alojado actualmente tu panel de kioscos?**
   - Ejemplo: `https://admin.orkiosk.com`
   - O: `https://mi-servidor.com`
   - O: Una IP

2. **¿Tu servidor actual tiene SSL (HTTPS)?**
   - Sí / No

3. **¿Prefieres Solución 1 (rewrites) o Solución 2 (subdominios)?**

Con esta información, puedo ayudarte a configurar todo correctamente. 🚀
