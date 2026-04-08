# 🐛 Troubleshooting - Solución de Problemas

Encuentra tu problema aquí y su solución

---

## 🔴 Error 502 Bad Gateway

### ¿Qué es?
Passenger (servidor) no puede conectar con tu aplicación Node.js

### ¿Por qué ocurre?
- Aplicación Node.js no está corriendo
- Puerto incorrecto
- Crash en la aplicación

### ✅ Soluciones

**Opción 1: Reiniciar desde cPanel**
1. Ve a Setup Node.js App
2. Busca tu aplicación "AutomatIA"
3. Haz clic en **"Restart"**
4. Espera 30-40 segundos
5. Recarga la página

**Opción 2: Verificar logs**
```bash
# En SSH/Terminal:
tail -f /home/usuario/public_html/AutomatIA/app-debug.log

# Busca lineas con "ERROR" o "FATAL"
```

**Opción 3: npm install nuevamente**
```bash
cd /home/usuario/public_html/AutomatIA
rm -rf node_modules
npm install
# Luego reinicia desde cPanel
```

---

## 🔴 Error 500 Internal Server Error

### ¿Qué es?
Error en la aplicación JavaScript/Node.js

### ¿Dónde está el problema?
Mira en `app-debug.log`

```bash
cat /home/usuario/public_html/AutomatIA/app-debug.log
```

### Problemas Comunes:

#### "Cannot find module 'express'"
```bash
cd /home/usuario/public_html/AutomatIA
npm install
```

#### "ENOENT: no such file or directory, open '.env'"
Falta el archivo `.env`
```bash
# En cPanel File Manager:
# 1. Ve a /AutomatIA/
# 2. Crea archivo: .env
# 3. Pega contenido de .env.example
# 4. Edita con tus valores
```

#### "JWT_SECRET no está configurado"
En `.env`, el JWT_SECRET tiene el valor por defecto
```bash
# Edita .env y reemplaza:
JWT_SECRET=<valor_aleatorio_32_caracteres>
```

Generar valor:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### "EACCES: permission denied ... data/leads.json"
Permisos incorrectos en base de datos
```bash
cd /home/usuario/public_html/AutomatIA/backend/data
chmod 755 .
chmod 644 *.json
```

#### "listen EADDRINUSE: address already in use :::3000"
Otro proceso está usando el puerto
```bash
# Ver procesos Node.js:
ps aux | grep node

# Matar proceso (reemplaza PID):
kill -9 <PID>

# Passenger lo reiniciará
```

---

## 🔴 Los CSS y JS no cargan (Página blanca o sin estilos)

### ¿Qué es?
Página carga pero sin estilos y sin funcionalidad

### ¿Por qué?
Rutas incorrectas a recursos CSS/JS

### ✅ Solución

**Verificar en navegador (F12 → Console):**
```
GET /AutomatIA/css/main.css 404 (Not Found)
GET /AutomatIA/js/common.js 404 (Not Found)
```

**Causas posibles:**

1. **Archivos no subidos a servidor**
   - Verifica en cPanel File Manager que existan:
     - `/home/usuario/public_html/AutomatIA/frontend/css/main.css`
     - `/home/usuario/public_html/AutomatIA/frontend/js/common.js`

2. **Rutas incorrectas en HTML**
   - Tu código ya está correcto con `/AutomatIA/...`
   - Pero si ves referencias a `/css/...` o `/js/...`:
     - Edita el archivo HTML
     - Reemplaza con `/AutomatIA/css/...`

**Comando para verificar:**
```bash
ls -la /home/usuario/public_html/AutomatIA/frontend/
# Debe mostrar: css/, js/, index.html, etc.
```

---

## 🔴 Formulario de Contacto no envía

### ¿Qué es?
Rellenas el formulario, haces clic en "Reservar", pero no envía

### ¿Por qué?
- API no está disponible
- Validación falla silenciosamente
- Error en backend

### ✅ Solución

**Verificar en navegador (F12 → Network):**
1. Abre DevTools (F12)
2. Pestaña "Network"
3. Rellena formulario y haz clic en "Reservar"
4. Busca petición POST a `/AutomatIA/api/contact`
   - Si ves 200/201: ✅ Envío exitoso, revisa correo
   - Si ves 400/500: ❌ Error del servidor

**Si es error 400 (Bad Request):**
- Algún campo obligatorio falta o es inválido
- Revisa que nombre y email no estén vacíos

**Si es error 500:**
- Mira logs:
```bash
tail -f /home/usuario/public_html/AutomatIA/app-debug.log
```

**Si dice "Gateway timeout":**
- Gmail no está configurado correctamente
- Email se guarda pero no se envía
- Revisa en `app-debug.log`: "Email no configurado"

---

## 🔴 No recibo email de contacto

### ¿Por qué?
- GMAIL_USER no configurado
- GMAIL_APP_PASSWORD incorrecto
- Gmail bloqueó la conexión

### ✅ Solución

**Verificar configuración:**
```bash
grep GMAIL /home/usuario/public_html/AutomatIA/.env
# Debe mostrar:
# GMAIL_USER=tu@gmail.com
# GMAIL_APP_PASSWORD=xxxx_xxxx_xxxx_xxxx
```

**Si GMAIL_APP_PASSWORD es incorrecto:**

1. Ve a [Google App Passwords](https://myaccount.google.com/apppasswords)
   - Verifica que 2FA esté activado
   - Selecciona "Mail" y "Windows"
   - Copia los 16 caracteres

2. Edita `.env` en cPanel:
   ```
   GMAIL_APP_PASSWORD=xxxx_xxxx_xxxx_xxxx
   ```

3. Reinicia aplicación en cPanel

4. Prueba enviando nuevo contacto

**Si sigue sin funcionar:**
- Mira logs para mensaje exacto:
```bash
tail -f /home/usuario/public_html/AutomatIA/app-debug.log | grep Email
```

---

## 🔴 Admin Panel no abre

### URL no funciona
```
https://marcoscode.com/AutomatIA/admin/login.html
```

### ¿Por qué?
- Archivo no existe
- Ruta incorrecta en servidor

### ✅ Solución

**Verificar que archivo existe:**
```bash
ls -la /home/usuario/public_html/AutomatIA/frontend/admin/
# Debe mostrar:
# -rw-r--r-- admin/login.html
# -rw-r--r-- admin/dashboard.html
```

Si no existen:
- Sube los archivos desde `frontend/admin/`

---

## 🔴 Login admin no funciona

### Credenciales correctas pero no entra

### ✅ Solución

**Verificar credenciales por defecto:**
- Usuario: `admin`
- Contraseña: `AutomatIA2025!`

**Si sigue sin funcionar:**
1. Mira logs:
   ```bash
   tail -f /home/usuario/public_html/AutomatIA/app-debug.log | grep POST
   ```

2. Verifica que base de datos existe:
   ```bash
   cat /home/usuario/public_html/AutomatIA/backend/data/admin.json
   # Debe mostrar usuario admin
   ```

3. Si no existe, reinicia aplicación (Passenger lo creará)

---

## 🔴 Cambiar contraseña admin

### Desde el panel admin:
1. Login con credenciales por defecto
2. Dashboard → Cambiar contraseña
3. Ingresa contraseña actual: `AutomatIA2025!`
4. Nueva contraseña: algo más seguro
5. Haz clic en "Cambiar"

### Si olvidaste la contraseña:
```bash
# SSH/Terminal
cd /home/usuario/public_html/AutomatIA/backend/data

# Borra el archivo
rm admin.json

# Reinicia la aplicación (Passenger creará uno nuevo)
# Y usa las credenciales por defecto de nuevo
```

---

## 🔴 Base de datos vacía o se borra

### ¿Qué ocurre?
- Los contactos desaparecen
- Los testimonios se pierden

### ¿Por qué?
- Aplicación se reinicia y borra archivos JSON
- Permisos incorrectos

### ✅ Solución

**Asegurar que carpeta tiene permisos correctos:**
```bash
chmod 755 /home/usuario/public_html/AutomatIA/backend/data
chmod 644 /home/usuario/public_html/AutomatIA/backend/data/*.json
```

**Hacer backup de la base de datos:**
```bash
# Copiar archivos JSON a lugar seguro
cp -r /home/usuario/public_html/AutomatIA/backend/data ~/backup_data
```

---

## 🔴 Aplicación muy lenta

### ¿Qué ocurre?
- Carga lenta
- Timeouts en formularios

### ¿Por qué?
- Demasiados datos en JSON
- Servidor sobrecargado

### ✅ Solución

**Migrar a PostgreSQL (recomendado para producción):**
- Contacta al soporte de cPanel
- Solicita crear base de datos PostgreSQL
- Modifica `backend/database.js` para usar PostgreSQL

**Mientras tanto:**
- Limpia leads antiguos desde admin panel
- Borra contactos que no necesites

---

## 🔴 Puerto incorrecto o conflicto de puertos

### ¿Qué ocurre?
- Passenger asigna puerto pero aplicación usa otro
- Múltiples aplicaciones Node.js usando mismo puerto

### ✅ Solución

**Verificar puerto asignado:**
1. Ve a cPanel → Setup Node.js App
2. Mira puerto asignado (ej: 12345)

**Verificar que app usa puerto correcto:**
- El archivo `app.js` lee variable `PORT` de entorno
- Passenger sobreescribe automáticamente
- ✅ Tu código ya está correcto

---

## 📊 Comandos Útiles

### Ver estado general
```bash
# ¿Node.js está instalado?
node --version
npm --version

# ¿Procesos Node.js corriendo?
ps aux | grep node

# ¿Puerto escuchando?
netstat -tulpn | grep 3000

# ¿Espacio en disco?
df -h
```

### Monitorear logs en tiempo real
```bash
tail -f /home/usuario/public_html/AutomatIA/app-debug.log

# Solo errores:
tail -f /home/usuario/public_html/AutomatIA/app-debug.log | grep -i error
```

### Reiniciar aplicación (sin cPanel)
```bash
cd /home/usuario/public_html/AutomatIA

# Matar proceso:
pkill -f "node app.js"

# Reiniciará automáticamente
sleep 5

# Verificar que reinició:
ps aux | grep node
```

---

## 💬 ¿Nada de esto funciona?

1. **Revisa logs completos:**
   ```bash
   cat /home/usuario/public_html/AutomatIA/app-debug.log
   ```

2. **Verifica estructura completa:**
   ```bash
   tree /home/usuario/public_html/AutomatIA/ -I node_modules
   ```

3. **Reinstala desde cero:**
   ```bash
   cd /home/usuario/public_html/AutomatIA
   rm -rf node_modules
   npm install
   npm start
   ```

4. **Contacta soporte cPanel:**
   - Proporciona logs completos
   - Describe qué intentaste
   - Incluye versión Node.js: `node --version`

---

**¿Algo más? Revisa `DEPLOYMENT.md` o `CPANEL_SETUP.md`** 📖
