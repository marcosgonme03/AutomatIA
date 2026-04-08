# ✅ Pre-Deployment Checklist - AutomatIA Pro

Verifica todos estos puntos antes de desplegar en cPanel.

---

## 📦 Código y Dependencias

- [ ] Todos los archivos están presentes (`app.js`, carpetas `frontend/` y `backend/`)
- [ ] Ejecuté `npm install` sin errores
- [ ] No hay mensajes de error o advertencia críticas en `npm install`
- [ ] `package.json` contiene todas las dependencias necesarias
- [ ] No hay archivos sin guardar (`*.bak`, `*.tmp`, etc.)

**Comando para verificar:**
```bash
npm list
# Debe mostrar todas las dependencias sin errores
```

---

## 📁 Estructura de Carpetas

- [ ] `app.js` existe en la raíz
- [ ] `package.json` existe en la raíz
- [ ] Carpeta `frontend/` existe con archivos HTML
- [ ] Carpeta `backend/` existe con `database.js` y `routes/`
- [ ] `backend/data/` directorio está presente (se crea automáticamente si no existe)
- [ ] Archivo `.env` está presente (o `.env.example` disponible)

**Comando para verificar:**
```bash
ls -la
ls -la frontend/
ls -la backend/
```

---

## 🔐 Configuración de Seguridad

### JWT Secret
- [ ] `.env` contiene `JWT_SECRET` con valor aleatorio (no el valor por defecto)
- [ ] El JWT_SECRET tiene mínimo 32 caracteres
- [ ] El JWT_SECRET no está commitido en Git (`node_modules/.gitignore` debe excluir `.env`)

**Generar seguro:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Credenciales Admin
- [ ] `ADMIN_USER` está configurado (por defecto: `admin`)
- [ ] `ADMIN_PASSWORD` está configurado (es fuerte, mínimo 8 caracteres)
- [ ] ⚠️ Recordatorio: DEBES cambiar esto después de desplegar

### Gmail Credentials
- [ ] `GMAIL_USER` está configurado (tu email Gmail)
- [ ] `GMAIL_APP_PASSWORD` está configurado (obtenido de Google App Passwords)
- [ ] El formato es correcto (sin espacios o 16 caracteres sin separadores)

**Cómo obtener Google App Password:**
1. Ve a [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
2. Selecciona "Mail" y "Windows"
3. Copia los 16 caracteres

### .gitignore
- [ ] `.gitignore` excluye `.env` (nunca commitir variables sensibles)
- [ ] `.gitignore` excluye `node_modules/`
- [ ] `.gitignore` excluye `app-debug.log` (opcional pero recomendado)

**Verificar:**
```bash
cat .gitignore
# Debe contener:
# .env
# node_modules/
# app-debug.log
```

---

## 📝 Archivos de Configuración

### .env (Variables de Entorno)
- [ ] Archivo `.env` existe
- [ ] Contiene: `PORT=3000` (puede variar, Passenger lo sobrescribe)
- [ ] Contiene: `JWT_SECRET` (valor aleatorio, no por defecto)
- [ ] Contiene: `GMAIL_USER` (tu email)
- [ ] Contiene: `GMAIL_APP_PASSWORD` (16 caracteres de Google)
- [ ] Contiene: `ADMIN_USER` y `ADMIN_PASSWORD`

**Verificar contenido sin exponer contraseña:**
```bash
# Solo ver las claves (no valores)
grep = .env | cut -d= -f1
# Debe mostrar: PORT, JWT_SECRET, GMAIL_USER, GMAIL_APP_PASSWORD, ADMIN_USER, ADMIN_PASSWORD
```

### package.json
- [ ] Campo `"main": "app.js"` está presente
- [ ] Scripts `"start"` y `"dev"` están configurados
- [ ] Todas las dependencias están listadas
- [ ] Versión está actualizada

---

## 🌐 URLs y Rutas

### Landing Page
- [ ] Accesible en `https://marcoscode.com/AutomatIA`
- [ ] CSS carga desde `/AutomatIA/css/main.css`
- [ ] JS carga desde `/AutomatIA/js/common.js`
- [ ] Imágenes cargan desde `/AutomatIA/images/`

**Verificar en HTML:**
```bash
grep -r "href\|src" frontend/*.html | grep -v AutomatIA | grep -v http | grep -v data:
# No debería haber referencias a /public o /static
```

### APIs
- [ ] Contact API: `/AutomatIA/api/contact`
- [ ] Testimonials API: `/AutomatIA/api/testimonials`
- [ ] Admin APIs: `/AutomatIA/api/admin/*`

**Verificar en código:**
```bash
grep -r "AutomatIA/api" frontend/
# Debe encontrar referencias en los archivos JS
```

---

## 🗄️ Base de Datos

### Archivo Store (JSON)
- [ ] Carpeta `backend/data/` está creada
- [ ] Archivos JSON estarán creados automáticamente:
  - `admin.json` (usuarios admin)
  - `leads.json` (contactos)
  - `testimonials.json` (testimonios)
- [ ] Permisos de carpeta permiten lectura/escritura

**Comando para verificar permisos:**
```bash
ls -la backend/data/
# Debe mostrar permisos como drwxr-xr-x (755)
```

---

## 🧪 Tests Locales (Antes de cPanel)

### Test 1: Servidor arranca
```bash
npm start
# Debe mostrar:
# Server listening on port 3000
```

### Test 2: Landing page
```
http://localhost:3000/AutomatIA
```
Deberías ver:
- ✅ Página HTML cargada
- ✅ CSS aplicado (colores, tipografía)
- ✅ Animaciones funcionando (typewriter, particles)
- ✅ No errores en consola (F12)

### Test 3: Admin Login
```
http://localhost:3000/AutomatIA/admin/login.html
```
Deberías ver:
- ✅ Página de login funcional
- ✅ Puedas ingresar con `admin / AutomatIA2025!`

### Test 4: API Contact
```bash
curl -X POST http://localhost:3000/AutomatIA/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","message":"test"}'

# Respuesta esperada: {"ok":true,"id":1}
```

---

## 📋 Checklist Final cPanel

### Antes de hacer Deploy en Setup Node.js App

- [ ] Todos los archivos subidos a `/home/usuario/public_html/AutomatIA/`
- [ ] `npm install` ejecutado en servidor
- [ ] `.env` configurado en servidor
- [ ] Permisos de `backend/data/` son 755
- [ ] No hay errores en logs

### Después de crear la app en Setup Node.js App

- [ ] Node.js versión es v20+
- [ ] Application Root: `/home/usuario/public_html/AutomatIA`
- [ ] Startup File: `app.js`
- [ ] Application URL: `marcoscode.com/AutomatIA`
- [ ] Status muestra: "Running"

### Pruebas en cPanel

- [ ] `https://marcoscode.com/AutomatIA` carga
- [ ] Formulario de contacto funciona
- [ ] Email de contacto se recibe
- [ ] Admin login funciona
- [ ] Cambio de contraseña admin completado
- [ ] Logs en `app-debug.log` sin errores críticos

---

## 🚨 Problemas Comunes Previos a Desplegar

### ⚠️ "Cannot find module 'express'"
**Causa:** npm install no ejecutado
```bash
npm install
```

### ⚠️ ".env: No such file"
**Causa:** Falta archivo .env
```bash
cp .env.example .env
# Edita con tus valores
```

### ⚠️ "EACCES: permission denied"
**Causa:** Permisos de carpeta
```bash
chmod 755 backend/data
chmod 644 backend/data/*.json
```

### ⚠️ "JWT_SECRET no está configurado"
**Causa:** .env tiene valor por defecto
```bash
# Edita .env y reemplaza:
# Antes:  JWT_SECRET=cambia_esto_por_algo_muy_secreto_y_largo_2025
# Después: JWT_SECRET=<valor_aleatorio_generado>
```

---

## 📊 Resumen de Cambios Necesarios Antes de Deploy

**CRÍTICOS (deben estar hechos):**
1. ✅ Cambiar `JWT_SECRET` a valor aleatorio
2. ✅ Configurar `GMAIL_USER` y `GMAIL_APP_PASSWORD`
3. ✅ Cambiar `ADMIN_PASSWORD` a algo más seguro
4. ✅ Ejecutar `npm install`

**RECOMENDADOS (después del primer login en cPanel):**
1. 🔄 Cambiar contraseña admin desde panel
2. 🔄 Verificar que email de contacto funciona
3. 🔄 Revisar logs regularmente

---

## ✅ Estoy listo para desplegar en cPanel

Si todos los puntos anteriores están marcados con ✅, ¡estás listo!

**Próximos pasos:**
1. Lee `QUICK_START.md` para resumen rápido
2. O sigue `DEPLOYMENT.md` para guía detallada
3. O usa `CPANEL_SETUP.md` para instrucciones visual paso a paso

**¡Buena suerte! 🚀**
