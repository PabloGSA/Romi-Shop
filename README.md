# ✨ Romi Antonucci

Tienda online desarrollada como proyecto final del curso de Programador Full Stack. Permite registrarse, navegar el catálogo, comprar con Stripe y gestionar productos desde un panel de administración.

## Tecnologías utilizadas

| Tecnología | Propósito |
|-----------|-----------|
| **Next.js 14** | Framework React (frontend + backend en un solo proyecto) |
| **MongoDB Atlas** | Base de datos en la nube |
| **Mongoose** | Modelado de datos para MongoDB |
| **NextAuth.js** | Autenticación con JWT |
| **Stripe** | Pasarela de pago (modo test) |
| **Email List Verify** | Validación de emails en el registro |
| **Tailwind CSS** | Estilos y diseño responsive |
| **bcryptjs** | Encriptación de contraseñas |

## Características

### Usuario
- ✅ Registro con validación de email real (Email List Verify API)
- ✅ Login con email y contraseña (sesión JWT)
- ✅ Catálogo de productos con filtros por categoría
- ✅ Carrito de compras
- ✅ Pago seguro con Stripe (modo test)
- ✅ Página de confirmación con resumen real del pedido
- ✅ Historial de pedidos en "Mis pedidos"
- ✅ Rutas protegidas (sin login no se puede acceder al carrito ni a pedidos)

### Administrador
- ✅ Panel de administración en `/admin/productos`
- ✅ Crear, editar y eliminar productos
- ✅ Acceso restringido por rol (solo usuarios con `role: "admin"` en la base de datos)

### Sistema
- ✅ Stock de productos se descuenta automáticamente al confirmar el pago
- ✅ Pedidos guardados en MongoDB con estado (`pendiente` → `pagado`)
- ✅ Middleware que protege rutas privadas a nivel de servidor

## Instalación y uso

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/bisuteria-shop.git
cd bisuteria-shop
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
```bash
# Copia el archivo de ejemplo
cp .env.example .env.local
# Edita .env.local con tus credenciales reales
```

### 4. Ejecutar en desarrollo
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Estructura del proyecto

```
bisuteria-shop/
├── components/
│   ├── Layout.js           # Estructura base con Navbar y Footer
│   ├── Navbar.js           # Barra de navegación
│   └── ProductCard.js      # Tarjeta de producto
├── context/
│   └── CartContext.js      # Estado global del carrito (React Context)
├── lib/
│   ├── mongodb.js          # Conexión a MongoDB (con caché para desarrollo)
│   ├── stripe.js           # Instancia del cliente de Stripe
│   └── email.js            # Módulo de email (preparado para Resend)
├── middleware.js            # Protección de rutas privadas y de admin
├── models/
│   ├── User.js             # Esquema de usuario (name, email, password, role)
│   ├── Product.js          # Esquema de producto (name, price, category, stock...)
│   └── Order.js            # Esquema de pedido (items, total, status, stripeSessionId)
├── pages/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── [...nextauth].js    # Login y sesión JWT
│   │   │   └── register.js        # Registro con validación Email List Verify
│   │   ├── products/
│   │   │   ├── index.js           # GET todos / POST crear producto
│   │   │   └── [id].js            # GET uno / PUT actualizar / DELETE eliminar
│   │   ├── orders/
│   │   │   └── index.js           # GET pedidos del usuario logueado
│   │   ├── checkout/
│   │   │   └── create-session.js  # POST crear sesión Stripe + guardar pedido
│   │   └── webhook.js             # POST recibir confirmación de pago de Stripe
│   ├── admin/
│   │   └── productos.js    # Panel CRUD de productos (solo admin)
│   ├── index.js            # Catálogo de productos
│   ├── login.js            # Formulario de login
│   ├── register.js         # Formulario de registro
│   ├── cart.js             # Carrito de compras
│   ├── mis-pedidos.js      # Historial de pedidos del usuario
│   └── success.js          # Confirmación de pago (actualiza pedido y stock)
└── styles/
    └── globals.css         # Estilos globales + Tailwind
```

## Flujo completo de la aplicación

```
1. Usuario se registra    →  /register         →  POST /api/auth/register
                                                   (valida email con Email List Verify)
2. Usuario hace login     →  /login            →  NextAuth genera token JWT
3. Ve el catálogo         →  /                 →  GET /api/products
4. Agrega al carrito      →  Context API (estado en memoria del navegador)
5. Va al carrito          →  /cart             →  (requiere login)
6. Paga con Stripe        →  POST /api/checkout/create-session
                                                   → Guarda pedido en MongoDB (status: pendiente)
                                                   → Redirige a Stripe
7. Stripe procesa el pago →  Redirige a /success?session_id=xxx
8. Página de éxito        →  Verifica pago con Stripe API
                                                   → Descuenta stock de productos
                                                   → Cambia pedido a (status: pagado)
9. Usuario ve sus pedidos →  /mis-pedidos      →  GET /api/orders
```

## Roles de usuario

| Rol | Acceso |
|-----|--------|
| `user` (por defecto) | Tienda, carrito, mis pedidos |
| `admin` | Todo lo anterior + panel de administración `/admin/productos` |

Para asignar rol de admin: en MongoDB Atlas, edita el documento del usuario en la colección `users` y cambia el campo `role` de `"user"` a `"admin"`.

## Tarjetas de prueba (Stripe modo test)

| Número | Resultado |
|--------|-----------|
| `4242 4242 4242 4242` | Pago exitoso ✅ |
| `4000 0000 0000 0002` | Pago rechazado ❌ |
| `4000 0025 0000 3155` | Requiere autenticación 3D Secure |

Usa cualquier fecha futura (ej: `12/28`) y cualquier CVC (ej: `123`).

## Variables de entorno necesarias

| Variable | Descripción |
|----------|-------------|
| `MONGODB_URI` | Cadena de conexión de MongoDB Atlas |
| `NEXTAUTH_URL` | URL de la aplicación (http://localhost:3000 en desarrollo) |
| `NEXTAUTH_SECRET` | Clave secreta para firmar los tokens JWT |
| `STRIPE_SECRET_KEY` | Clave secreta de Stripe (empieza por `sk_test_`) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Clave pública de Stripe (empieza por `pk_test_`) |
| `STRIPE_WEBHOOK_SECRET` | Clave del webhook de Stripe (empieza por `whsec_`) |
| `EMAIL_LIST_VERIFY_API_KEY` | Clave de Email List Verify para validar emails |

## Despliegue en Vercel

1. Sube el código a GitHub
2. Ve a [vercel.com](https://vercel.com) y conecta tu repositorio
3. Agrega todas las variables de entorno en el panel de Vercel
4. ¡Deploy automático!
