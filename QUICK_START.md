# ⚡ Quick Start - Despliegue en cPanel (5 minutos)

## Sin quiero leer menos... aquí está lo MÍNIMO:

### 1️⃣ Subir código a cPanel
```bash
# Sube la carpeta completa a:
/home/usuario/public_html/AutomatIA

# Luego en SSH/Terminal:
cd /home/usuario/public_html/AutomatIA
npm install
```

### 2️⃣ Configurar variables de entorno
```bash
# Edita .env en cPanel (File Manager)
# Mínimo necesario:

PORT=3000
JWT_SECRET=algo_aleatorio_y_largo_minimo_32_chars
GMAIL_USER=tu@email.com
GMAIL_APP_PASSWORD=xxxx_xxxx_xxxx_xxxx
ADMIN_USER=admin
ADMIN_PASSWORD=AutomatIA2025!
```

**Generar JWT_SECRET seguro:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3️⃣ Configurar en cPanel
- Ve a **Setup Node.js App** (o Node.js Selector)
- Crea nueva aplicación:
  - **Node.js Version:** v20+
  - **Application Root:** `/home/usuario/public_html/AutomatIA`
  - **Application URL:** `marcoscode.com/AutomatIA`
  - **Startup File:** `app.js`
- Haz clic en **Create** o **Deploy**

### 4️⃣ Verificar que funciona
```
https://marcoscode.com/AutomatIA
```

¿Ves la página? ✅ ¡Listo!

---

## Si algo no funciona...

### ❌ Error 502/500
```bash
# En cPanel Terminal:
tail -f /home/usuario/public_html/AutomatIA/app-debug.log
```
Mira qué dice el error

### ❌ Falta npm o node_modules
```bash
cd /home/usuario/public_html/AutomatIA
npm install
```

### ❌ Permisos de base de datos
```bash
cd /home/usuario/public_html/AutomatIA/backend/data
chmod 755 .
chmod 644 *.json 2>/dev/null || true
```

### ❌ Reiniciar la app
En cPanel: Setup Node.js App → Busca tu app → Restart

---

## URLs después del despliegue

| Página | URL |
|--------|-----|
| Landing | `marcoscode.com/AutomatIA` |
| Admin | `marcoscode.com/AutomatIA/admin/login.html` |
| Contacto | `marcoscode.com/AutomatIA/contact.html` |

**Admin credentials (por defecto):**
- Usuario: `admin`
- Password: `AutomatIA2025!`

⚠️ **CAMBIA LA CONTRASEÑA desde el panel admin**

---

## Para documentación completa:
- 📖 Ver `DEPLOYMENT.md`
- 🔧 Ver `CPANEL_SETUP.md`

---

**¿Necesitas ayuda?** Revisa los logs en `app-debug.log` 🔍
