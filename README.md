# ✨ Bisutería Shop

Tienda online de bisutería artesanal desarrollada con Next.js, MongoDB y Stripe.

## Tecnologías utilizadas

| Tecnología | Propósito |
|-----------|-----------|
| **Next.js 14** | Framework React (frontend + backend) |
| **MongoDB Atlas** | Base de datos en la nube |
| **NextAuth.js** | Autenticación con JWT |
| **Stripe** | Pasarela de pago |
| **Tailwind CSS** | Estilos |

## Características

- ✅ Registro de usuarios
- ✅ Login con email y contraseña
- ✅ Catálogo de productos con filtros por categoría
- ✅ Carrito de compras
- ✅ Pago seguro con Stripe
- ✅ Diseño responsive

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
├── components/         # Componentes React reutilizables
│   ├── Layout.js       # Estructura base con Navbar y Footer
│   ├── Navbar.js       # Barra de navegación
│   └── ProductCard.js  # Tarjeta de producto
├── context/
│   └── CartContext.js  # Estado global del carrito
├── lib/
│   ├── mongodb.js      # Conexión a la base de datos
│   └── stripe.js       # Configuración de Stripe
├── models/
│   ├── User.js         # Esquema de usuario
│   └── Product.js      # Esquema de producto
├── pages/
│   ├── api/            # Endpoints del backend
│   │   ├── auth/       # Login, Register (NextAuth)
│   │   ├── products/   # CRUD de productos
│   │   └── checkout/   # Sesión de pago Stripe
│   ├── index.js        # Página principal (tienda)
│   ├── login.js        # Formulario de login
│   ├── register.js     # Formulario de registro
│   ├── cart.js         # Carrito de compras
│   └── success.js      # Confirmación de pago
└── styles/
    └── globals.css     # Estilos globales + Tailwind
```

## Flujo de la aplicación

```
1. Usuario se registra  →  /register  →  POST /api/auth/register
2. Usuario hace login   →  /login     →  NextAuth maneja JWT
3. Ve productos         →  /          →  GET /api/products
4. Agrega al carrito    →  Context API (estado en memoria)
5. Va al carrito        →  /cart
6. Paga con Stripe      →  POST /api/checkout/create-session
7. Stripe procesa pago  →  Redirige a /success
```

## Tarjetas de prueba (Stripe modo test)

| Número | Resultado |
|--------|-----------|
| `4242 4242 4242 4242` | Pago exitoso |
| `4000 0000 0000 0002` | Pago rechazado |

Usa cualquier fecha futura y cualquier CVC (ej: 123).

## Despliegue en Vercel

1. Sube el código a GitHub
2. Ve a [vercel.com](https://vercel.com) y conecta tu repositorio
3. Agrega las variables de entorno en el panel de Vercel
4. ¡Deploy automático!
