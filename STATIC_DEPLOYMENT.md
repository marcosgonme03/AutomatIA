# 📦 Conversión a Despliegue Estático (Sin Node.js)

Tu proyecto se convertirá a **sitio HTML puro** que funciona en cualquier hosting compartido.

---

## ✅ Estructura Final para `/public_html/AutomatIA/`

```
AutomatIA/
├── index.html                    ← Landing page (raíz)
├── contact.html                  ← Página de contacto
├── services.html                 ← Servicios
├── process.html                  ← Proceso
├── results.html                  ← Resultados/ROI
├── clients.html                  ← Testimonios
├── privacy.html                  ← Privacidad
├── legal.html                    ← Aviso legal
├── 404.html                      ← Página de error
├── .htaccess                     ← Configuración Apache (NUEVO)
├── css/
│   └── main.css
├── js/
│   └── common.js                 ← Sin APIs
├── images/
│   ├── hero-illustration.svg
│   ├── og-image.png
│   └── logo.png
├── robots.txt
├── sitemap.xml
└── [ELIMINADOS] app.js, backend/, node_modules/
```

---

## 🔧 Cambios de Rutas

### ANTES (rutas absolutas con /AutomatIA/):
```html
<link rel="stylesheet" href="/AutomatIA/css/main.css">
<script src="/AutomatIA/js/common.js"></script>
<a href="/AutomatIA/services.html">Servicios</a>
```

### DESPUÉS (rutas relativas):
```html
<link rel="stylesheet" href="css/main.css">
<script src="js/common.js"></script>
<a href="services.html">Servicios</a>
```

---

## 📝 Cambios en Archivos

### 1. `common.js` - Cambiar BASE

```javascript
// ANTES:
const BASE = '/AutomatIA';

// DESPUÉS:
const BASE = '';  // ← Vacío = rutas relativas
```

Esto hace que:
- `/AutomatIA/services.html` → `services.html`
- `/AutomatIA/` → `./` o `index.html`

### 2. Remover todas las llamadas a APIs

En `contact.html`, `clients.html`, `admin/` → **COMENTAR O ELIMINAR**:

```javascript
// ❌ ELIMINAR:
const res = await fetch('/AutomatIA/api/contact', { ... });
const res = await fetch('/AutomatIA/api/testimonials');

// ✅ REEMPLAZAR CON (opcional - mostrar mensaje):
showToast('Funcionalidad de contacto deshabilitada en sitio estático', 'info');
```

### 3. Remover referencias a admin

En `common.js`, eliminar:
```html
<a href="/AutomatIA/admin/login.html" style="opacity:.4">Admin</a>
```

---

## 🛠️ Guía Paso a Paso

### **PASO 1: Copiar archivos frontend a raíz**

```bash
# En tu máquina:
cd /home/marcosco/repositories/AutomatIA

# Copiar todo de frontend a la raíz
cp -r frontend/* /ruta/temporal/AutomatIA/

# Resultado:
# /ruta/temporal/AutomatIA/
# ├── index.html
# ├── services.html
# ├── css/
# ├── js/
# └── ...
```

### **PASO 2: Crear common.js estático**

Ver archivo: `common.js.STATIC` (abajo)

### **PASO 3: Crear .htaccess**

Ver archivo: `.htaccess.STATIC` (abajo)

### **PASO 4: Corregir todos los HTML**

Usar búsqueda/reemplazo:
- Buscar: `/AutomatIA/css/` → Reemplazar: `css/`
- Buscar: `/AutomatIA/js/` → Reemplazar: `js/`
- Buscar: `/AutomatIA/contact.html` → Reemplazar: `contact.html`
- Etc.

### **PASO 5: Subir a cPanel**

1. Ve a cPanel File Manager
2. Ve a `/public_html/`
3. **Elimina la carpeta AutomatIA anterior** (con app.js, backend, etc.)
4. **Sube la nueva carpeta AutomatIA** (solo HTML estático)
5. **Abre en navegador:** `https://marcoscode.com/AutomatIA`

---

## 📋 Archivos Estáticos Listos

Los siguientes archivos necesitan SOLO cambio de rutas (no cambio de lógica):

```
index.html           → Cambiar /AutomatIA/ → relativas
contact.html         → Cambiar /AutomatIA/ → relativas + REMOVER fetch
services.html        → Cambiar /AutomatIA/ → relativas
process.html         → Cambiar /AutomatIA/ → relativas
results.html         → Cambiar /AutomatIA/ → relativas
clients.html         → Cambiar /AutomatIA/ → relativas + REMOVER fetch
privacy.html         → Cambiar /AutomatIA/ → relativas
legal.html           → Cambiar /AutomatIA/ → relativas
404.html             → Cambiar /AutomatIA/ → relativas
```

---

## ✅ Archivos que Se Crean Nuevos

- `.htaccess` → Configuración Apache
- `common.js` → Versión sin APIs
- `js/api-disabled.js` (opcional) → Avisos si intentan usar APIs

---

## 🚀 Resultado Final

✅ **Sitio 100% estático**
✅ **Funciona en cualquier hosting**
✅ **Sin Node.js requerido**
✅ **Cero dependencias de backend**
✅ **Rápido y seguro**

---

## 📌 Próximos Pasos

1. Ejecutar script de conversión (ver abajo)
2. O hacer cambios manualmente usando "Buscar/Reemplazar"
3. Probar localmente abriendo `index.html`
4. Subir a cPanel
5. Verificar en navegador

---

