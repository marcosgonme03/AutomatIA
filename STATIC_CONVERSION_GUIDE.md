# 🔄 Guía de Conversión Manual a Sitio Estático

**Opción manual para convertir tu proyecto a HTML puro sin Node.js**

---

## 📋 Resumen de Cambios

| Cambio | Antes | Después |
|--------|-------|---------|
| **CSS** | `/AutomatIA/css/main.css` | `css/main.css` |
| **JS** | `/AutomatIA/js/common.js` | `js/common.js` |
| **Links** | `/AutomatIA/contact.html` | `contact.html` |
| **Inicio** | `/AutomatIA/` | `./` o `index.html` |
| **BASE variable** | `const BASE = '/AutomatIA'` | `const BASE = ''` |
| **APIs** | `fetch('/AutomatIA/api/...')` | Comentadas/removidas |

---

## 🎯 PASO 1: Preparar la carpeta

### En cPanel File Manager:

1. Ve a `/public_html/`
2. **ELIMINA** la carpeta `AutomatIA` actual (contiene app.js y backend)
3. **CREA** una nueva carpeta vacía: `AutomatIA`
4. Dentro crea subcarpetas:
   - `css/`
   - `js/`
   - `images/`

### Resultado esperado:
```
/public_html/AutomatIA/
├── css/              (vacía)
├── js/               (vacía)
├── images/           (vacía)
└── (esperando archivos)
```

---

## 🎯 PASO 2: Subir archivos HTML

### Archivos a subir a raíz (`/public_html/AutomatIA/`):

```
index.html
contact.html
services.html
process.html
results.html
clients.html
privacy.html
legal.html
404.html
robots.txt
sitemap.xml
```

**En cPanel File Manager:**
1. Selecciona estos archivos desde tu `frontend/`
2. Haz clic en "Upload"
3. Sube a `/public_html/AutomatIA/`

---

## 🎯 PASO 3: Subir CSS y JS

### Archivos en carpetas:

**`/css/`**
- `main.css`

**`/js/`**
- `common.js`

**`/images/`**
- `hero-illustration.svg`
- `og-image.png`

---

## 🎯 PASO 4: Corregir Rutas en HTML (CRÍTICO)

### En cPanel File Manager - Editor HTML:

#### Para CADA archivo `.html`, haz esto:

1. Abre el archivo con "HTML Editor" (cPanel)
2. Usa **Buscar/Reemplazar** (Ctrl+H):

**Reemplazo 1: CSS**
```
Buscar:      /AutomatIA/css/
Reemplazar:  css/
Reemplazar todos
```

**Reemplazo 2: JS**
```
Buscar:      /AutomatIA/js/
Reemplazar:  js/
Reemplazar todos
```

**Reemplazo 3: Imágenes**
```
Buscar:      /AutomatIA/images/
Reemplazar:  images/
Reemplazar todos
```

**Reemplazo 4: Links HTML**
```
Buscar:      /AutomatIA/contact.html
Reemplazar:  contact.html
Reemplazar todos
```

```
Buscar:      /AutomatIA/services.html
Reemplazar:  services.html
Reemplazar todos
```

```
Buscar:      /AutomatIA/process.html
Reemplazar:  process.html
Reemplazar todos
```

```
Buscar:      /AutomatIA/results.html
Reemplazar:  results.html
Reemplazar todos
```

```
Buscar:      /AutomatIA/clients.html
Reemplazar:  clients.html
Reemplazar todos
```

```
Buscar:      /AutomatIA/privacy.html
Reemplazar:  privacy.html
Reemplazar todos
```

```
Buscar:      /AutomatIA/legal.html
Reemplazar:  legal.html
Reemplazar todos
```

**Reemplazo 5: URL raíz**
```
Buscar:      /AutomatIA/
Reemplazar:  ./
Reemplazar todos
```

---

## 🎯 PASO 5: Corregir common.js

En `js/common.js`:

**Línea ~6:**
```javascript
// ANTES:
const BASE = '/AutomatIA';

// DESPUÉS:
const BASE = '';
```

**Línea ~44 (eliminar o comentar admin link):**
```javascript
// ANTES:
<a href="${BASE}/admin/login.html" style="opacity:.4">Admin</a>

// DESPUÉS:
<!-- Admin link removed for static site -->
```

---

## 🎯 PASO 6: Desabilitar APIs

### En `contact.html` y `clients.html`:

**Buscar:**
```javascript
const res = await fetch('/AutomatIA/api/contact'
```

**Reemplazar por:**
```javascript
// API deshabilitada en versión estática
/*const res = await fetch('/AutomatIA/api/contact'*/
```

O simplemente comentar toda la sección de `fetch()`.

---

## 🎯 PASO 7: Crear .htaccess

En cPanel File Manager, en `/public_html/AutomatIA/`:

1. Haz clic en "File"
2. Selecciona "Create New File"
3. Nombre: `.htaccess`
4. Contenido: Copia de `HTACCESS_STATIC.txt` (ver archivo adjunto)
5. Guarda

---

## 🎯 PASO 8: Verificar Estructura Final

En cPanel File Manager, `/public_html/AutomatIA/` debe verse así:

```
✓ .htaccess
✓ 404.html
✓ index.html
✓ contact.html
✓ services.html
✓ process.html
✓ results.html
✓ clients.html
✓ privacy.html
✓ legal.html
✓ robots.txt
✓ sitemap.xml
✓ css/
  └── main.css
✓ js/
  └── common.js
✓ images/
  ├── hero-illustration.svg
  └── og-image.png
```

---

## 🧪 PASO 9: Probar Localmente (ANTES de subir)

En tu computadora:

1. Copia la carpeta `frontend/` a un lugar temporal
2. Aplica los mismos cambios de rutas
3. Abre `index.html` en navegador
4. Verifica:
   - ✅ Página carga
   - ✅ CSS aplicado (colores, tipografía)
   - ✅ Links funcionan (contact.html, services.html, etc.)
   - ✅ Imágenes cargan
   - ✅ No hay errores en consola (F12)

---

## 🚀 PASO 10: Subir a cPanel y Verificar

1. Abre en navegador: `https://marcoscode.com/AutomatIA`

2. Verifica que ves:
   - ✅ Landing page completa
   - ✅ Header con nav
   - ✅ Hero section con animaciones
   - ✅ Secciones de servicios
   - ✅ Footer
   - ✅ Todos los links funcionan
   - ✅ Páginas internas cargan (services.html, contact.html, etc.)

3. Verifica errores en navegador (F12 → Console):
   - ❌ NO debe haber errores rojos
   - ⚠️ Advertencias sobre APIs están bien (esperadas)

---

## 📝 Checklist de Conversión

- [ ] Carpeta `AutomatIA` creada en `/public_html/`
- [ ] Archivos HTML subidos
- [ ] Carpetas `css/`, `js/`, `images/` creadas
- [ ] CSS y JS subidos
- [ ] Rutas `/AutomatIA/...` cambiadas a relativas
- [ ] `common.js` con `BASE = ''`
- [ ] APIs comentadas en contact.html y clients.html
- [ ] `.htaccess` creado
- [ ] `404.html` presente
- [ ] Sitio prueba localmente sin errores
- [ ] Abre en navegador: funciona correctamente

---

## ❓ Problemas Comunes

### CSS no carga (página sin estilos)

**Problema:** Las rutas CSS son incorrectas

**Solución:**
- Verifica que archivos `.css` estén en `/css/`
- En HTML, referencia debe ser `<link rel="stylesheet" href="css/main.css">`
- No debe haber `/AutomatIA/` en las rutas

### Links rotos

**Problema:** Links apuntan a rutas antiguas

**Solución:**
- `href="/AutomatIA/contact.html"` → `href="contact.html"`
- `href="/AutomatIA/"` → `href="./"`o `href="index.html"`

### JS no funciona (sin animaciones)

**Problema:** Script no carga o BASE variable incorrecta

**Solución:**
- `src="/AutomatIA/js/common.js"` → `src="js/common.js"`
- En `common.js`: `const BASE = ''` (vacío, no `/AutomatIA`)

### 404 no funciona

**Problema:** .htaccess no configurado

**Solución:**
- Crea `.htaccess` en `/public_html/AutomatIA/`
- Copia contenido de `HTACCESS_STATIC.txt`

---

## 🎉 Resultado Final

Después de estos pasos, tendrás:

✅ Sitio **100% HTML/CSS/JS estático**
✅ **Sin Node.js requerido**
✅ Funciona en **cualquier hosting**
✅ **Rápido y seguro**
✅ **Cero dependencias**

---

## 📌 Alternativa: Script Automático

Si prefieres automatizar esto, usa:
```bash
bash convert-to-static.sh
```

Esto hace todos los cambios automáticamente.

---

**¿Preguntas?** Revisa `TROUBLESHOOTING.md` 🔍
