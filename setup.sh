#!/bin/bash

# ══════════════════════════════════════════════════════════════
# AutomatIA Pro - Setup Script para Despliegue en cPanel
# ══════════════════════════════════════════════════════════════

echo "🚀 AutomatIA Pro - Setup Inicial"
echo "================================"
echo ""

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para imprimir con color
success() { echo -e "${GREEN}✓${NC} $1"; }
error() { echo -e "${RED}✗${NC} $1"; }
warning() { echo -e "${YELLOW}⚠${NC} $1"; }

# ──────────────────────────────────────────────────────────────
# 1. Verificar Node.js
# ──────────────────────────────────────────────────────────────

echo "📋 Verificando Node.js..."
if ! command -v node &> /dev/null; then
    error "Node.js no está instalado"
    echo "Por favor, instala Node.js v20+ desde https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v)
success "Node.js encontrado: $NODE_VERSION"

# ──────────────────────────────────────────────────────────────
# 2. Instalar dependencias
# ──────────────────────────────────────────────────────────────

echo ""
echo "📦 Instalando dependencias..."

if [ -d "node_modules" ]; then
    warning "node_modules ya existe. Ejecutando npm install igualmente..."
fi

npm install
if [ $? -ne 0 ]; then
    error "Error al instalar dependencias"
    exit 1
fi

success "Dependencias instaladas correctamente"

# ──────────────────────────────────────────────────────────────
# 3. Crear .env si no existe
# ──────────────────────────────────────────────────────────────

echo ""
echo "⚙️  Verificando archivo .env..."

if [ ! -f ".env" ]; then
    warning ".env no encontrado. Creando desde .env.example..."
    cp .env.example .env
    success ".env creado. Edítalo con tus valores:"
    echo ""
    echo "Variables a configurar en .env:"
    echo "  - JWT_SECRET: Cambia a un valor aleatorio (ver línea 5-7 de DEPLOYMENT.md)"
    echo "  - GMAIL_USER: Tu email de Gmail"
    echo "  - GMAIL_APP_PASSWORD: Tu contraseña de aplicación de Google"
    echo "  - ADMIN_USER: Usuario admin (por defecto 'admin')"
    echo "  - ADMIN_PASSWORD: Contraseña admin (CÁMBIALA después)"
    echo ""
else
    success ".env encontrado"
fi

# ──────────────────────────────────────────────────────────────
# 4. Crear carpeta de base de datos
# ──────────────────────────────────────────────────────────────

echo ""
echo "💾 Configurando base de datos..."

mkdir -p backend/data
if [ -d "backend/data" ]; then
    success "Carpeta backend/data existe"

    # Dar permisos correctos
    chmod 755 backend/data
    chmod 644 backend/data/*.json 2>/dev/null || true
    touch backend/data/.gitkeep
    success "Permisos configurados"
else
    error "No se pudo crear carpeta backend/data"
    exit 1
fi

# ──────────────────────────────────────────────────────────────
# 5. Verificar estructura de archivos
# ──────────────────────────────────────────────────────────────

echo ""
echo "📁 Verificando estructura de archivos..."

FILES=(
    "app.js"
    "package.json"
    ".env"
    "frontend/index.html"
    "frontend/js/common.js"
    "frontend/css/main.css"
    "backend/database.js"
    "backend/routes/contact.js"
    "backend/routes/testimonials.js"
    "backend/routes/admin.js"
)

MISSING=0
for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        success "✓ $file"
    else
        error "✗ $file"
        MISSING=$((MISSING + 1))
    fi
done

if [ $MISSING -gt 0 ]; then
    error "$MISSING archivos faltantes"
    exit 1
fi

# ──────────────────────────────────────────────────────────────
# 6. Generar JWT_SECRET si no existe
# ──────────────────────────────────────────────────────────────

echo ""
echo "🔐 Verificando JWT_SECRET..."

if grep -q "JWT_SECRET=cambia_esto_por_algo_muy_secreto_y_largo_2025" .env; then
    warning "JWT_SECRET está en su valor por defecto"
    echo "Generando un JWT_SECRET seguro..."

    JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")

    # Reemplazar en .env (compatible con sed en Linux y macOS)
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s/JWT_SECRET=cambia_esto_por_algo_muy_secreto_y_largo_2025/JWT_SECRET=$JWT_SECRET/" .env
    else
        sed -i "s/JWT_SECRET=cambia_esto_por_algo_muy_secreto_y_largo_2025/JWT_SECRET=$JWT_SECRET/" .env
    fi

    success "JWT_SECRET generado y actualizado"
    echo "  Valor: $JWT_SECRET"
else
    success "JWT_SECRET ya está configurado"
fi

# ──────────────────────────────────────────────────────────────
# 7. Crear archivos de log
# ──────────────────────────────────────────────────────────────

echo ""
echo "📝 Creando archivos de log..."

touch app-debug.log
chmod 644 app-debug.log
success "app-debug.log creado"

# ──────────────────────────────────────────────────────────────
# 8. Resumen final
# ──────────────────────────────────────────────────────────────

echo ""
echo "════════════════════════════════════════════════════════════"
echo "✅ Setup completado exitosamente"
echo "════════════════════════════════════════════════════════════"
echo ""
echo "📋 Próximos pasos:"
echo ""
echo "1. Editar .env con tus valores:"
echo "   nano .env"
echo ""
echo "   Variables críticas:"
echo "   - GMAIL_USER"
echo "   - GMAIL_APP_PASSWORD"
echo "   - ADMIN_PASSWORD"
echo ""
echo "2. Para desplegar en cPanel:"
echo "   - Sube esta carpeta a /public_html/AutomatIA/"
echo "   - Ve a cPanel → Setup Node.js App"
echo "   - Crea aplicación con:"
echo "     * Application Root: /home/usuario/public_html/AutomatIA"
echo "     * Startup File: app.js"
echo "     * Node.js Version: v20+"
echo ""
echo "3. Lee DEPLOYMENT.md para instrucciones detalladas"
echo ""
echo "4. Para probar localmente:"
echo "   npm start"
echo "   Luego abre: http://localhost:3000/AutomatIA"
echo ""
echo "════════════════════════════════════════════════════════════"
echo ""

success "¡Listo para desplegar!"
