# 🚀 AutomatIA Pro

**Automatización Inteligente con IA para PYMEs**

Plataforma completa de consultoría y servicios de automatización empresarial con inteligencia artificial. Landing page profesional + Dashboard administrativo.

---

## ✨ Características

### 🎯 Landing Page
- **Hero Section** con efecto typewriter y animaciones fluidas
- **6 Servicios** detallados con FAQs expandibles
- **Proceso de Implementación** visualizado en timeline (5 pasos)
- **Calculadora de ROI** interactiva con fórmulas dinámicas
- **Testimonios** de clientes reales (cargados desde API)
- **Formulario de Contacto** con validación y rate limiting
- **SEO Optimizado** con meta tags, Open Graph y sitemap

### 📊 Dashboard Administrativo
- **Autenticación JWT** segura (7 días de validez)
- **Panel de Estadísticas** en tiempo real
- **Gestión de Leads** completa (crear, leer, actualizar, eliminar)
- **Gestión de Testimonios** (crear, editar, publicar/despublicar)
- **Filtros y Búsqueda** avanzados
- **Exportación CSV** de leads
- **Cambio de Contraseña** seguro
- **Diseño Responsivo** mobile-first

### 🔒 Seguridad
- ✅ JWT con expiración configurada
- ✅ Bcrypt para hasheo de contraseñas
- ✅ Rate limiting en formularios
- ✅ Validación de entrada (XSS protection)
- ✅ CORS listo para producción

---

## 🛠️ Instalación

### Requisitos
- Node.js 14+ y npm
- Git

### Pasos

```bash
# 1. Clonar o descargar el repositorio
cd prueba-pagina-web

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Edita .env con tus valores

# 4. Iniciar servidor
npm start
# O en modo desarrollo con auto-reload:
npm run dev

# 5. Acceder
# Landing page: http://localhost:3000
# Admin panel: http://localhost:3000/admin/login.html
```

---

## ⚙️ Configuración

### 1️⃣ JWT Secret (Seguridad)

Genera un secret seguro:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Luego actualiza en `.env`:
```env
JWT_SECRET=tu_secret_generado_aqui
```

### 2️⃣ Gmail (Notificaciones por Email)

1. Activa la verificación en 2 pasos en tu cuenta Google
2. Ve a: [Google App Passwords](https://myaccount.google.com/apppasswords)
3. Selecciona "Correo" y "Ordenador Windows"
4. Copia la contraseña de 16 caracteres

```env
GMAIL_USER=tu-email@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
```

### 3️⃣ Admin Default

Primer acceso con credenciales por defecto:
```
Usuario: admin
Contraseña: AutomatIA2025!
```

**⚠️ Cambia la contraseña inmediatamente después de iniciar sesión.**

---

## 📁 Estructura del Proyecto

```
├── public/
│   ├── index.html           # Landing page
│   ├── services.html        # Servicios
│   ├── process.html         # Proceso
│   ├── results.html         # Resultados y ROI
│   ├── clients.html         # Testimonios
│   ├── contact.html         # Contacto
│   ├── privacy.html         # Política de privacidad
│   ├── legal.html           # Términos legales
│   ├── 404.html             # Página de error personalizada
│   ├── admin/
│   │   ├── login.html       # Login administrativo
│   │   └── dashboard.html   # Dashboard completo
│   ├── css/
│   │   └── main.css         # Estilos globales (tema dark)
│   ├── js/
│   │   └── common.js        # JS compartido (animaciones, nav)
│   └── images/
│       └── hero-illustration.svg
│
├── routes/
│   ├── contact.js           # API de contacto + emails
│   ├── testimonials.js      # API de testimonios
│   └── admin.js             # API admin (leads, stats, cambio contraseña)
│
├── middleware/
│   └── auth.js              # JWT authentication middleware
│
├── database.js              # JSON file-based store
├── server.js                # Express app
├── package.json
├── .env                      # Variables de entorno
├── .env.example             # Ejemplo de configuración
├── sitemap.xml              # SEO sitemap
└── robots.txt               # SEO robots.txt
```

---

## 🔌 API Endpoints

### Public
- `GET /` - Landing page
- `GET /services.html` - Servicios
- `GET /contact.html` - Contacto
- `POST /api/contact` - Enviar formulario de contacto
- `GET /api/testimonials` - Obtener testimonios publicados

### Admin (Protegido con JWT)
- `POST /api/admin/login` - Iniciar sesión
- `GET /api/admin/me` - Verificar usuario actual
- `GET /api/admin/stats` - Estadísticas
- `GET /api/admin/leads` - Listar leads (con paginación y filtros)
- `GET /api/admin/leads/:id` - Detalle de lead
- `PATCH /api/admin/leads/:id` - Actualizar lead (status, notas)
- `DELETE /api/admin/leads/:id` - Eliminar lead
- `GET /api/admin/leads/export` - Exportar CSV
- `GET /api/admin/testimonials` - Listar todos los testimonios
- `POST /api/admin/testimonials` - Crear testimonio
- `PATCH /api/admin/testimonials/:id` - Actualizar testimonio
- `DELETE /api/admin/testimonials/:id` - Eliminar testimonio
- `POST /api/admin/change-password` - Cambiar contraseña

---

## 🎨 Customización

### Colores y Tema
Edita las variables CSS en `public/css/main.css`:
```css
:root {
  --primary: #7c3aed;      /* Púrpura */
  --primary-light: #a855f7;
  --cyan: #06b6d4;
  --green: #10b981;
  /* ... más variables */
}
```

### Contenido
Actualiza el contenido directamente en los archivos HTML o a través del dashboard:
- Testimonios: Dashboard → Testimonios
- Leads: Dashboard → Leads
- Servicios: Edita `public/services.html`

---

## 📊 Base de Datos

Usa almacenamiento JSON basado en archivos (sin compilación requerida):
- `data/leads.json` - Contactos del formulario
- `data/testimonials.json` - Testimonios
- `data/admin.json` - Usuarios administrativos

⚠️ **Para producción**, migra a PostgreSQL/MongoDB.

---

## 🚀 Deployment

### Opciones Recomendadas

#### 1. Vercel (Recomendado)
```bash
npm install -g vercel
vercel
```

#### 2. Heroku
```bash
heroku create
git push heroku main
```

#### 3. DigitalOcean/AWS/GCP
1. Migra a PostgreSQL en lugar de JSON
2. Configura variables de entorno en el servidor
3. Deploy con Docker o git push

---

## 🔐 Seguridad - Checklist Pre-Producción

- [ ] Cambiar admin password
- [ ] Usar JWT_SECRET aleatorio y fuerte
- [ ] Configurar Gmail para notificaciones
- [ ] Habilitar HTTPS/TLS
- [ ] Migrar a base de datos (PostgreSQL)
- [ ] Configurar backups automáticos
- [ ] Revisar CORS settings
- [ ] Implementar rate limiting adicional
- [ ] Configurar variables de entorno en servidor
- [ ] Habilitar monitoring y logging

---

## 📞 Soporte

Para preguntas o problemas:
- 📧 Email: support@automatia.pro
- 📱 Contacto: /contact.html

---

## 📄 Licencia

Uso exclusivo para AutomatIA Pro. Todos los derechos reservados © 2025.

---

## 🎯 Roadmap

- [ ] Integración con Stripe (pagos)
- [ ] SMS notifications
- [ ] Múltiples usuarios admin
- [ ] Integración Calendly
- [ ] Dark/Light mode toggle
- [ ] Análisis y reportes avanzados
- [ ] Integración con CRM externos

---

**Desarrollado con ❤️ para PYMEs que quieren crecer con IA**
