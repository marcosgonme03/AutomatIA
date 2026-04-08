#!/bin/bash

# ══════════════════════════════════════════════════════════════
# AutomatIA Pro - Convertir a Sitio Estático (sin Node.js)
# ══════════════════════════════════════════════════════════════

echo "🚀 Convirtiendo a sitio estático..."
echo ""

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

success() { echo -e "${GREEN}✓${NC} $1"; }
error() { echo -e "${RED}✗${NC} $1"; }
warning() { echo -e "${YELLOW}⚠${NC} $1"; }

# ──────────────────────────────────────────────────────────────
# 1. Crear carpeta temporal para sitio estático
# ──────────────────────────────────────────────────────────────

OUTPUT_DIR="AutomatIA-STATIC"
rm -rf "$OUTPUT_DIR"
mkdir -p "$OUTPUT_DIR"

success "Carpeta temporal creada: $OUTPUT_DIR"

# ──────────────────────────────────────────────────────────────
# 2. Copiar archivos frontend
# ──────────────────────────────────────────────────────────────

echo ""
echo "📁 Copiando archivos..."

cp -r frontend/* "$OUTPUT_DIR/" 2>/dev/null
cp frontend/.htaccess "$OUTPUT_DIR/" 2>/dev/null || true

# Eliminar carpeta admin (no necesaria para sitio estático)
rm -rf "$OUTPUT_DIR/admin/"

success "Archivos copiados"

# ──────────────────────────────────────────────────────────────
# 3. Corregir rutas en todos los archivos HTML
# ──────────────────────────────────────────────────────────────

echo ""
echo "🔧 Corrigiendo rutas en archivos HTML..."

# Función para reemplazar en un archivo
fix_routes() {
    local file=$1
    if [ -f "$file" ]; then
        # Reemplazar /AutomatIA/css/ → css/
        sed -i 's|/AutomatIA/css/|css/|g' "$file"
        # Reemplazar /AutomatIA/js/ → js/
        sed -i 's|/AutomatIA/js/|js/|g' "$file"
        # Reemplazar /AutomatIA/images/ → images/
        sed -i 's|/AutomatIA/images/|images/|g' "$file"
        # Reemplazar /AutomatIA/contact.html → contact.html
        sed -i 's|/AutomatIA/contact.html|contact.html|g' "$file"
        # Reemplazar /AutomatIA/services.html → services.html
        sed -i 's|/AutomatIA/services.html|services.html|g' "$file"
        # Reemplazar /AutomatIA/process.html → process.html
        sed -i 's|/AutomatIA/process.html|process.html|g' "$file"
        # Reemplazar /AutomatIA/results.html → results.html
        sed -i 's|/AutomatIA/results.html|results.html|g' "$file"
        # Reemplazar /AutomatIA/clients.html → clients.html
        sed -i 's|/AutomatIA/clients.html|clients.html|g' "$file"
        # Reemplazar /AutomatIA/privacy.html → privacy.html
        sed -i 's|/AutomatIA/privacy.html|privacy.html|g' "$file"
        # Reemplazar /AutomatIA/legal.html → legal.html
        sed -i 's|/AutomatIA/legal.html|legal.html|g' "$file"
        # Reemplazar /AutomatIA/ → ./
        sed -i 's|/AutomatIA/|./|g' "$file"
        # Reemplazar /AutomatIA → ./
        sed -i 's|/AutomatIA"|./"|g' "$file"
        echo "  ✓ $file"
    fi
}

# Aplicar a todos los HTML
find "$OUTPUT_DIR" -type f -name "*.html" | while read file; do
    fix_routes "$file"
done

success "Rutas corregidas"

# ──────────────────────────────────────────────────────────────
# 4. Corregir common.js para rutas relativas
# ──────────────────────────────────────────────────────────────

echo ""
echo "🔧 Actualizando common.js..."

if [ -f "$OUTPUT_DIR/js/common.js" ]; then
    # Cambiar const BASE = '/AutomatIA'; → const BASE = '';
    sed -i "s|const BASE = '/AutomatIA'|const BASE = ''|g" "$OUTPUT_DIR/js/common.js"

    # Comentar referencia a admin
    sed -i 's|<a href="${BASE}/admin/login.html"|<!-- <a href="${BASE}/admin/login.html"<!-- Admin deshabilitado en versión estática -->|g' "$OUTPUT_DIR/js/common.js"

    success "common.js actualizado"
fi

# ──────────────────────────────────────────────────────────────
# 5. Crear .htaccess para Apache
# ──────────────────────────────────────────────────────────────

echo ""
echo "⚙️  Creando .htaccess..."

cat > "$OUTPUT_DIR/.htaccess" << 'EOF'
# ══════════════════════════════════════════════════════════════
# AutomatIA Pro - Apache Configuration
# ══════════════════════════════════════════════════════════════

# Enable mod_rewrite
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /AutomatIA/

    # Redirigir URLs sin .html a .html
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^([^\.]+)$ $1.html [L]

    # Redirigir 404 a página personalizada
    ErrorDocument 404 /AutomatIA/404.html
</IfModule>

# Compress text files
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE text/javascript
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
    AddOutputFilterByType DEFLATE application/x-httpd-php
    AddOutputFilterByType DEFLATE image/svg+xml
</IfModule>

# Cache control
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresDefault "access plus 1 month"
    ExpiresByType text/html "access plus 1 hour"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType text/javascript "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
</IfModule>

# Prevent access to sensitive files
<FilesMatch "\.(env|json|md|lock)$">
    Order Allow,Deny
    Deny from all
</FilesMatch>

# Security headers
<IfModule mod_headers.c>
    Header set X-Content-Type-Options "nosniff"
    Header set X-Frame-Options "DENY"
    Header set X-XSS-Protection "1; mode=block"
</IfModule>
EOF

success ".htaccess creado"

# ──────────────────────────────────────────────────────────────
# 6. Remover llamadas a APIs en HTML
# ──────────────────────────────────────────────────────────────

echo ""
echo "🔧 Removiendo llamadas a APIs..."

# En contact.html, comentar el fetch de API
if [ -f "$OUTPUT_DIR/contact.html" ]; then
    sed -i "s|const res = await fetch|\/\/ const res = await fetch (API deshabilitada)|g" "$OUTPUT_DIR/contact.html"
    success "contact.html: APIs deshabilitadas"
fi

# En clients.html, comentar el fetch de API
if [ -f "$OUTPUT_DIR/clients.html" ]; then
    sed -i "s|const res = await fetch|\/\/ const res = await fetch (API deshabilitada)|g" "$OUTPUT_DIR/clients.html"
    success "clients.html: APIs deshabilitadas"
fi

# ──────────────────────────────────────────────────────────────
# 7. Verificar estructura
# ──────────────────────────────────────────────────────────────

echo ""
echo "✅ Verificando estructura final..."
echo ""
echo "Estructura de $OUTPUT_DIR/:"
tree -L 2 "$OUTPUT_DIR" 2>/dev/null || find "$OUTPUT_DIR" -type f | head -20

# ──────────────────────────────────────────────────────────────
# 8. Resumen final
# ──────────────────────────────────────────────────────────────

echo ""
echo "════════════════════════════════════════════════════════════"
echo "✅ Conversión completada exitosamente"
echo "════════════════════════════════════════════════════════════"
echo ""
echo "📁 Carpeta lista: $OUTPUT_DIR/"
echo ""
echo "📋 Próximos pasos:"
echo ""
echo "1. Abre la carpeta: $OUTPUT_DIR/"
echo ""
echo "2. Prueba localmente:"
echo "   - Abre en navegador: file://$(pwd)/$OUTPUT_DIR/index.html"
echo "   - Verifica que todos los links funcionen"
echo "   - Verifica que CSS y JS cargen"
echo ""
echo "3. Sube a cPanel:"
echo "   - File Manager → /public_html/"
echo "   - Elimina la carpeta AutomatIA anterior"
echo "   - Sube la carpeta: $OUTPUT_DIR"
echo "   - Abre en navegador: https://marcoscode.com/AutomatIA"
echo ""
echo "4. Verifica:"
echo "   - ✓ Landing page carga"
echo "   - ✓ CSS aplicado"
echo "   - ✓ Links internos funcionan"
echo "   - ✓ 404.html se muestra si accedes a página no existente"
echo ""
echo "════════════════════════════════════════════════════════════"
echo ""

success "¡Sitio estático listo para desplegar!"
