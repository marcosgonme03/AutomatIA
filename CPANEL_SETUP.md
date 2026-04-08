# cPanel - Setup Node.js App: Guía Visual Paso a Paso

## 🎯 Objetivo
Desplegar AutomatIA en `marcoscode.com/AutomatIA` usando setupnodejs

---

## 📍 Ubicación en cPanel

### Encontrar Setup Node.js App

**En cPanel:**
1. Busca la barra de búsqueda (arriba)
2. Escribe: `Setup Node.js App`
3. O búscalo en: **Software > Node.js Selector** o **Developers > Setup Node.js App**

---

## ⚙️ Configuración Exacta

Cuando crees la nueva aplicación, completa estos campos:

| Campo | Valor |
|-------|-------|
| **Node.js Version** | v20.x (la más reciente) |
| **Application Root** | `/home/usuario/public_html/AutomatIA` |
| **Application URL** | `marcoscode.com/AutomatIA` |
| **Application Startup File** | `app.js` |
| **Passenger Log File** | `/home/usuario/logs/AutomatIA_app.log` |

⚠️ **Reemplaza "usuario" con tu usuario real de cPanel**

---

## 🔑 Clave del Startup File

El archivo `app.js` DEBE estar en la raíz de `/AutomatIA/`

**Tu estructura debe verse así:**
```
/home/usuario/public_html/
└── AutomatIA/
    ├── app.js              ← AQUÍ
    ├── package.json
    ├── .env
    ├── frontend/
    ├── backend/
    └── node_modules/
```

---

## 📦 npm install

**Crucial:** Después de subir los archivos, ejecutar en SSH:

```bash
cd /home/usuario/public_html/AutomatIA
npm install
```

Esto instala todas las dependencias del `package.json`:
- express
- bcryptjs
- jsonwebtoken
- nodemailer
- cors
- dotenv
- express-rate-limit

---

## ✅ Verificar que Funciona

### Test 1: Landing Page
```
https://marcoscode.com/AutomatIA
```
Deberías ver:
- Página cargada completamente
- Estilos aplicados (colores vivos)
- Animaciones suaves

### Test 2: Admin Login
```
https://marcoscode.com/AutomatIA/admin/login.html
```
Credenciales iniciales:
- Usuario: `admin`
- Contraseña: `AutomatIA2025!`

⚠️ **CAMBIA inmediatamente después de acceder**

### Test 3: API (Contact Form)
1. Ve a `/AutomatIA/contact.html`
2. Rellena el formulario
3. Haz clic en "Reservar consulta gratuita"
4. Deberías recibir un email de confirmación

### Test 4: Logs
```bash
# En cPanel Terminal o SSH
cat /home/usuario/public_html/AutomatIA/app-debug.log
```
Deberías ver:
```
[2026-04-07T...] === APP.JS STARTING ===
[2026-04-07T...] Server listening on port 3000
```

---

## 🔄 Reiniciar la Aplicación

Si haces cambios o algo falla:

**Opción 1: Desde cPanel**
1. Ve a Setup Node.js App
2. Busca tu aplicación "AutomatIA"
3. Haz clic en **"Restart"**
4. Espera 30 segundos
5. Recarga tu navegador

**Opción 2: Desde SSH/Terminal**
```bash
# Ver procesos Node.js
ps aux | grep node

# Matar el proceso (reemplaza con el PID real)
kill -9 XXXX

# Passenger lo reiniciará automáticamente
```

---

## 🐛 Errores Comunes y Soluciones

### Error: "Cannot find module 'express'"

**Causa:** npm install no se ejecutó

**Solución:**
```bash
cd /home/usuario/public_html/AutomatIA
npm install
```

---

### Error: "ENOENT: no such file or directory, open '.env'"

**Causa:** Falta el archivo `.env`

**Solución:**
1. Ve a cPanel File Manager
2. Navega a `/AutomatIA/`
3. Crea un archivo nuevo: `.env`
4. Pega esto dentro:
```env
PORT=3000
JWT_SECRET=tu_valor_secreto_aqui_32_caracteres_minimo
GMAIL_USER=tu@email.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
ADMIN_USER=admin
ADMIN_PASSWORD=AutomatIA2025!
```

---

### Error: "EACCES: permission denied" en database

**Causa:** Permisos insuficientes en carpeta `backend/data/`

**Solución en SSH:**
```bash
cd /home/usuario/public_html/AutomatIA/backend/data
chmod 755 .
chmod 644 *.json 2>/dev/null || true
touch .gitkeep
```

---

### Error: "Socket hangup" o "ECONNREFUSED"

**Causa:** Passenger no está corriendo o puerto incorrecto

**Solución:**
1. En cPanel: Setup Node.js App → Restart
2. Espera 1 minuto
3. Recarga la página

---

### La página carga pero sin CSS/JS

**Causa:** Rutas incorrectas (generalmente poco probable, tu código ya está bien)

**Verificación en navegador (F12 → Console):**
- ¿Ves errores 404 en Resources?
- ¿Las URLs de CSS/JS dicen `/AutomatIA/css/main.css`?

Si no, revisa en `frontend/index.html` que todas las referencias sean:
```html
<link rel="stylesheet" href="/AutomatIA/css/main.css">
<script src="/AutomatIA/js/common.js"></script>
```

---

## 🌐 URLs de Acceso

| Página | URL |
|--------|-----|
| **Landing Page** | `https://marcoscode.com/AutomatIA` |
| **Servicios** | `https://marcoscode.com/AutomatIA/services.html` |
| **Proceso** | `https://marcoscode.com/AutomatIA/process.html` |
| **Contacto** | `https://marcoscode.com/AutomatIA/contact.html` |
| **Admin Login** | `https://marcoscode.com/AutomatIA/admin/login.html` |
| **Admin Dashboard** | `https://marcoscode.com/AutomatIA/admin/dashboard.html` |
| **API Contact** | `https://marcoscode.com/AutomatIA/api/contact` |
| **API Testimonials** | `https://marcoscode.com/AutomatIA/api/testimonials` |
| **API Admin** | `https://marcoscode.com/AutomatIA/api/admin/login` |

---

## 🔐 Variables de Entorno (.env)

### JWT_SECRET
Genéralo seguro:
```bash
# En tu terminal local
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Resultado: cópialo y pégalo en `.env`

**Ejemplo:**
```
JWT_SECRET=a7f3e2d1c5b9e4a8f1d6c3b2e9a4f7d1c5b8e2a9f4d7c1b6e3a8f5d2c9b4e
```

### GMAIL_APP_PASSWORD

1. Ve a [Google Account Security](https://myaccount.google.com/apppasswords)
2. Selecciona **Mail** y **Windows**
3. Google genera 16 caracteres
4. Pégalos en `.env` (sin espacios):
```
GMAIL_APP_PASSWORD=agkzqcfsuwhrgsml
```

---

## 📊 Monitor y Logs

### Ver logs en tiempo real
```bash
# SSH/Terminal
tail -f /home/usuario/public_html/AutomatIA/app-debug.log
```

### Ver estado de Passenger
```bash
# Procesos Node.js corriendo
ps aux | grep node

# Puerto escuchando
netstat -tulpn | grep 3000 (o el puerto asignado)
```

---

## ✨ Post-Despliegue Checklist

- [ ] Landing page visible en `/AutomatIA`
- [ ] CSS y animaciones aplicadas
- [ ] Formulario de contacto funciona
- [ ] Email de contacto recibido
- [ ] Admin panel accesible
- [ ] Contraseña admin cambiada
- [ ] Logs limpios (sin errores)
- [ ] Base de datos creada (`backend/data/*.json`)

---

**¿Algo no funciona?** Revisa `app-debug.log` o ejecuta `npm install` de nuevo.
