# 🚀 Guía de Despliegue en cPanel - AutomatIA Pro

## Resumen Rápido
Tu aplicación AutomatIA Pro está lista para desplegar en **marcoscode.com/AutomatIA** usando Passenger (setupnodejs en cPanel).

**Duración estimada:** 15-20 minutos

---

## 📋 Requisitos Previos

✅ Acceso a cPanel de marcoscode.com
✅ setupnodejs disponible en cPanel
✅ Git instalado en el servidor (generalmente viene incluido)

---

## 🔧 Pasos de Despliegue

### **PASO 1: Preparar el Servidor en cPanel**

1. **Acceder a cPanel** → `https://marcoscode.com:2083`

2. **Ir a "Setup Node.js App"** (búscalo en cPanel)
   - Si no lo encuentras, busca "Node.js" en la barra de búsqueda

3. **Crear nueva aplicación Node.js:**
   - **Node.js version:** v20.x o superior (elige la más nueva disponible)
   - **Application root:** `/home/usuario/public_html/AutomatIA`
   - **Application URL:** `marcoscode.com/AutomatIA`
   - **Application Startup File:** `app.js`

4. **Copiar la siguiente información** (la necesitarás después):
   - **Port:** (Passenger te asignará uno automáticamente, algo como 12345)
   - Anota este puerto, lo necesitas después

---

### **PASO 2: Subir el Código al Servidor**

#### **Opción A: Usando Git (Recomendado)**

Si tu repositorio ya está en GitHub:

```bash
# En cPanel File Manager o SSH
cd /home/usuario/public_html
mkdir -p AutomatIA
cd AutomatIA
git clone <tu-repo-github> .
npm install
```

#### **Opción B: Subir manualmente los archivos

1. En cPanel, ve a **File Manager**
2. Navega a `/public_html/AutomatIA` (crea la carpeta si no existe)
3. Sube todos tus archivos EXCEPTO:
   - `node_modules/` (se instalarán automáticamente)
   - `.git/` (opcional)

Luego en SSH o terminal de cPanel:
```bash
cd /home/usuario/public_html/AutomatIA
npm install
```

---

### **PASO 3: Configurar Variables de Entorno**

1. **Editar el archivo `.env`** en cPanel File Manager:
   - Navega a `/home/usuario/public_html/AutomatIA/`
   - Abre `.env` (si no existe, créalo)

2. **Asegúrate de que contiene:**

```env
PORT=3000

# JWT Secret (CRÍTICO: cambia esto a un valor aleatorio largo)
JWT_SECRET=generado_con_openssl_rand_hex_32

# Gmail (configurado con tu App Password de Google)
GMAIL_USER=tu-email@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx

# Admin (CAMBIA DESPUÉS DE DESPLEGAR)
ADMIN_USER=admin
ADMIN_PASSWORD=AutomatIA2025!
```

**⚠️ IMPORTANTE - Generar JWT_SECRET seguro:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Ejecuta esto en tu terminal local, copia el resultado y pégalo en `.env`

---

### **PASO 4: Configurar Passenger (setupnodejs)**

1. **Volver a cPanel → Setup Node.js App**

2. **Seleccionar tu aplicación** (debería listar "AutomatIA")

3. **Verificar configuración:**
   - Application root: `/home/usuario/public_html/AutomatIA` ✓
   - Startup file: `app.js` ✓
   - Node.js version: v20.x ✓

4. **Hacer clic en "Create"** (si no está creada) o **"Deploy"**

5. Passenger te mostrará un mensaje de éxito

---

### **PASO 5: Verificar que Funcione**

1. **Abre en tu navegador:**
   ```
   https://marcoscode.com/AutomatIA
   ```

2. **Deberías ver:**
   - ✅ La landing page de AutomatIA cargada correctamente
   - ✅ Los estilos CSS aplicados (colores púrpura y cyan)
   - ✅ Las animaciones funcionando

3. **Prueba el formulario de contacto:**
   - Completa el formulario
   - Verifica que se envíe sin errores
   - Revisa que llegue el email a tu cuenta

4. **Acceder a admin:**
   ```
   https://marcoscode.com/AutomatIA/admin/login.html
   ```
   - Usuario: `admin`
   - Contraseña: `AutomatIA2025!`
   - ⚠️ **CAMBIA LA CONTRASEÑA INMEDIATAMENTE**

---

### **PASO 6: Solucionar Problemas Comunes**

#### **❌ Error 502 Bad Gateway**

**Causa:** Passenger no puede conectar con la app

**Solución:**
1. Ve a cPanel → Setup Node.js App
2. Haz clic en "Restart"
3. Espera 30 segundos
4. Recarga la página en el navegador

#### **❌ Error 500 - Internal Server Error**

**Causa:** Error en la aplicación

**Solución:**
1. Revisa el archivo de logs en:
   ```
   /home/usuario/public_html/AutomatIA/app-debug.log
   ```
2. Busca el error específico
3. Si es sobre `.env`, asegúrate de que el archivo esté en la carpeta raíz
4. Reinicia Passenger (Setup Node.js App → Restart)

#### **❌ Los CSS y JS no cargan**

**Causa:** Rutas incorrectas en los archivos HTML

**Verificación:**
- Todos los archivos tienen referencias correctas: `/AutomatIA/css/...`
- ✅ Esto ya está configurado en tu proyecto

#### **❌ Las APIs no responden**

**Causa:** Puerto incorrecto o Passenger no iniciado

**Solución:**
1. Verifica que Passenger esté corriendo: cPanel → Setup Node.js App → Status
2. Revisa que el puerto sea el asignado por Passenger
3. Reinicia: Setup Node.js App → Restart

---

## 🔒 Seguridad - Checklist Pre-Producción

Antes de considerar "listo para producción":

- [ ] Cambiar la contraseña admin (`/AutomatIA/admin/login.html` → Cambiar contraseña)
- [ ] Verificar JWT_SECRET en `.env` (debe ser una cadena larga aleatoria)
- [ ] Confirmar GMAIL configurado correctamente (prueba enviando un lead)
- [ ] Probar el formulario de contacto completamente
- [ ] Verificar permisos de archivos en cPanel (database files deben ser read/write)

---

## 📊 Estructura de Archivos (Lo que verá Passenger)

```
/home/usuario/public_html/AutomatIA/
├── app.js                    ← Punto de entrada (startup file)
├── package.json              ← Dependencias
├── .env                      ← Variables de entorno (NO en Git)
├── app-debug.log            ← Logs de la app (se crea automáticamente)
├── frontend/                 ← Archivos HTML, CSS, JS
│   ├── index.html
│   ├── contact.html
│   ├── admin/
│   │   ├── login.html
│   │   └── dashboard.html
│   ├── css/
│   │   └── main.css
│   └── js/
│       └── common.js
├── backend/                  ← APIs y lógica del servidor
│   ├── database.js
│   ├── data/                 ← Archivos JSON (base de datos)
│   │   ├── leads.json
│   │   ├── testimonials.json
│   │   └── admin.json
│   ├── routes/
│   ├── middleware/
│   └── ...
└── node_modules/            ← Se instala con npm install
```

---

## 🚨 Problema: "Permission denied" en base de datos

Si ves errores como "EACCES: permission denied" al guardar datos:

1. En cPanel → Terminal (o SSH)
2. Ejecuta:
   ```bash
   cd /home/usuario/public_html/AutomatIA/backend/data
   chmod 755 .
   chmod 644 *.json
   touch .gitkeep
   ```

---

## 📞 Soporte

Si algo no funciona:

1. **Revisa los logs:**
   ```
   /home/usuario/public_html/AutomatIA/app-debug.log
   ```

2. **Reinicia Passenger:**
   - cPanel → Setup Node.js App → Restart

3. **Verifica Node.js:**
   ```bash
   node --version
   # Debe ser v20+
   ```

4. **Instala dependencias nuevamente:**
   ```bash
   cd /home/usuario/public_html/AutomatIA
   npm install
   ```

---

## ✅ Checklist Final

- [ ] Carpeta `/AutomatIA` creada en `/public_html/`
- [ ] Código subido completamente
- [ ] `npm install` ejecutado
- [ ] `.env` configurado correctamente
- [ ] Passenger creado/reiniciado en Setup Node.js App
- [ ] Landing page accesible en `/AutomatIA`
- [ ] Formulario de contacto funciona
- [ ] Admin panel accesible y credenciales cambiadas
- [ ] Logs sin errores críticos en `app-debug.log`

---

**¡Tu aplicación estará lista en unos 15-20 minutos!** 🎉

Más ayuda: Consulta los logs en `app-debug.log` o reinstala Node.js en cPanel.
