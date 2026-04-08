# 🎯 AutomatIA Pro - Despliegue Estático (Sin Node.js)

**Convierte tu proyecto Node.js a sitio HTML puro en 3 pasos.**

---

## ⚡ Opción Rápida (5 minutos)

### Paso 1: Ejecutar script de conversión
```bash
bash convert-to-static.sh
```

Esto crea una carpeta `AutomatIA-STATIC/` completamente lista.

### Paso 2: Probar localmente
```
Abre en navegador: file:///ruta/a/AutomatIA-STATIC/index.html
```

Verifica que todo funcione.

### Paso 3: Subir a cPanel
1. File Manager → `/public_html/`
2. Elimina carpeta `AutomatIA` antigua
3. Sube carpeta `AutomatIA-STATIC/`
4. Renómbrala a `AutomatIA`
5. Abre: `https://marcoscode.com/AutomatIA`

**¡Listo! 🚀**

---

## 📖 Opción Manual (15 minutos)

Si prefieres hacer cambios manualmente:

1. **Lee:** `STATIC_CONVERSION_GUIDE.md`
2. **Sigue:** Pasos 1-10
3. **Sube a cPanel:** Archivo por archivo

---

## 📁 Estructura Final

```
/public_html/AutomatIA/     (SIN Node.js)
├── .htaccess               (Apache config)
├── index.html
├── contact.html
├── services.html
├── process.html
├── results.html
├── clients.html
├── privacy.html
├── legal.html
├── 404.html
├── robots.txt
├── sitemap.xml
├── css/
│   └── main.css
├── js/
│   └── common.js           (sin APIs)
└── images/
    ├── hero-illustration.svg
    └── og-image.png
```

---

## ✅ Ventajas

- ✅ **Sin Node.js** → Funciona en cualquier hosting
- ✅ **Rápido** → Carga estática, sin procesamiento
- ✅ **Seguro** → Cero backend, cero APIs expuestas
- ✅ **Simple** → Solo HTML, CSS, JS
- ✅ **Barato** → Hosting compartido suficiente

---

## ⚠️ Limitaciones

- ❌ **Sin formulario de contacto dinámico** (no hay backend)
- ❌ **Sin panel admin** (sin autenticación)
- ❌ **Sin base de datos** (no hay datos persistentes)
- ❌ **Sin envío de emails** (necesita backend)

**¿Necesitas eso?** → Vuelve a usar la versión con Node.js y Passenger

---

## 🔄 Cambios principales

### ANTES (Node.js):
```html
<link rel="stylesheet" href="/AutomatIA/css/main.css">
<script src="/AutomatIA/js/common.js"></script>
<a href="/AutomatIA/contact.html">Contacto</a>
```

### DESPUÉS (HTML estático):
```html
<link rel="stylesheet" href="css/main.css">
<script src="js/common.js"></script>
<a href="contact.html">Contacto</a>
```

---

## 📚 Documentos Incluidos

| Archivo | Propósito |
|---------|-----------|
| `STATIC_DEPLOYMENT.md` | Resumen de conversión |
| `STATIC_CONVERSION_GUIDE.md` | Guía paso a paso |
| `HTACCESS_STATIC.txt` | Configuración Apache |
| `convert-to-static.sh` | Script automático |
| `README-STATIC.md` | **← Este archivo** |

---

## 🚀 Resumen Rápido

```bash
# 1. Convertir automáticamente
bash convert-to-static.sh

# 2. Resultado: Carpeta AutomatIA-STATIC/
# → Contiene sitio completo y listo

# 3. Subir a cPanel
# → /public_html/AutomatIA/

# 4. Abrir en navegador
# → https://marcoscode.com/AutomatIA
```

---

## ❓ ¿Preguntas?

- **¿Cómo hacer cambios?** → Edita los archivos HTML directamente
- **¿Cómo agregar páginas?** → Crea nuevo `.html` y linkéalo
- **¿Cómo cambiar estilos?** → Edita `css/main.css`
- **¿Cómo agregar animaciones?** → Edita `js/common.js`

---

**¡Tu sitio estático está listo en 5 minutos!** ⚡

Lee `STATIC_CONVERSION_GUIDE.md` para pasos detallados. 📖
