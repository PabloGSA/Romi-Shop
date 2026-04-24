# ✨ Romi Antonucci — Bisutería Shop

Tienda online desarrollada como proyecto final del curso de Programador Full Stack. Permite registrarse, navegar el catálogo, agregar productos al carrito, comprar con Stripe y gestionar productos desde un panel de administración.

Desarrollado por [Pablo Sanchez](https://github.com/PabloGSA).

---

## Tecnologías utilizadas

| Tecnología | Propósito |
|-----------|-----------|
| **Node.js** | Entorno de ejecución de JavaScript en el servidor |
| **Express.js** | Framework de Node.js para crear el servidor y las rutas |
| **EJS** | Motor de plantillas para renderizar las páginas HTML |
| **MongoDB Atlas** | Base de datos en la nube (NoSQL) |
| **Mongoose** | Librería para modelar y consultar datos en MongoDB |
| **express-session** | Gestión de sesiones de usuario en el servidor |
| **connect-mongo** | Almacena las sesiones en MongoDB (persisten al reiniciar) |
| **bcryptjs** | Cifrado seguro de contraseñas |
| **Stripe** | Pasarela de pago (modo test) |
| **Email List Verify** | Servicio de envío de emails de confirmación |
| **Tailwind CSS** | Estilos y diseño responsive (vía CDN) |
| **dotenv** | Carga las variables de entorno desde el archivo `.env` |

---

## Características

### Usuario
- ✅ Registro con nombre, email y contraseña
- ✅ Login con email y contraseña (sesión guardada en MongoDB)
- ✅ Cierre de sesión
- ✅ Catálogo de productos con filtros por categoría (sin recargar la página)
- ✅ Carrito de compras (guardado en localStorage del navegador)
- ✅ Pago seguro con Stripe (modo test)
- ✅ Página de confirmación con resumen real del pedido
- ✅ Historial de pedidos en "Mis pedidos"

### Administrador
- ✅ Panel de administración en `/admin/productos`
- ✅ Crear, editar y eliminar productos
- ✅ Vista previa de imagen al escribir la URL
- ✅ Acceso restringido por rol (solo usuarios con `role: "admin"`)

### Sistema
- ✅ Stock de productos se descuenta automáticamente al confirmar el pago
- ✅ Pedidos guardados en MongoDB con estado (`pendiente` → `pagado`)
- ✅ Rutas protegidas por middleware (sin login no se accede a páginas privadas)
- ✅ Webhook de Stripe para confirmación de pagos confiable
- ✅ Productos de ejemplo insertados automáticamente en la primera ejecución

---

## Instalación y uso

### 1. Clonar el repositorio
```bash
git clone https://github.com/PabloGSA/Bisuteria-Shop.git
cd Bisuteria-Shop
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno

Crear un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```env
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/bisuteria

SESSION_SECRET=una-clave-larga-y-secreta-aqui

APP_URL=http://localhost:3000
PORT=3000

STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 4. Ejecutar en desarrollo
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## Estructura del proyecto

```
bisuteria-shop/
│
├── server.js                   # Punto de entrada: servidor Express principal
│
├── routes/
│   ├── auth.js                 # Login, registro y logout
│   ├── products.js             # API REST de productos (CRUD)
│   ├── orders.js               # API: pedidos del usuario logueado
│   ├── checkout.js             # API: crear sesión de pago en Stripe
│   └── webhook.js              # API: recibir confirmaciones de Stripe
│
├── middleware/
│   └── auth.js                 # Protección de rutas (requireAuth, requireAdmin)
│
├── models/
│   ├── User.js                 # Esquema de usuario (name, email, password, role)
│   ├── Product.js              # Esquema de producto (name, price, category, stock)
│   └── Order.js                # Esquema de pedido (items, total, status, stripeSessionId)
│
├── lib/
│   ├── mongodb.js              # Conexión a MongoDB (con caché para no repetir conexión)
│   ├── stripe.js               # Instancia del cliente de Stripe
│   ├── email.js                # Envío de emails de confirmación con Email List Verify
│   └── seedData.js             # Productos de ejemplo para la primera ejecución
│
├── views/                      # Páginas HTML renderizadas con EJS
│   ├── partials/
│   │   ├── head.ejs            # DOCTYPE, <head>, apertura de <body>
│   │   ├── navbar.ejs          # Barra de navegación (reutilizada en todas las páginas)
│   │   └── footer.ejs          # Pie de página + carga de scripts JS
│   ├── admin/
│   │   └── productos.ejs       # Panel CRUD de productos (solo admin)
│   ├── index.ejs               # Catálogo de productos con filtros
│   ├── login.ejs               # Formulario de inicio de sesión
│   ├── register.ejs            # Formulario de registro
│   ├── cart.ejs                # Carrito de compras
│   ├── mis-pedidos.ejs         # Historial de pedidos del usuario
│   └── success.ejs             # Confirmación de pago exitoso
│
├── public/
│   ├── images/                 # Imágenes de los productos
│   └── js/
│       ├── cart.js             # Gestión del carrito en localStorage (cliente)
│       └── toast.js            # Notificaciones visuales tipo toast (cliente)
│
├── _explicado/                 # Código comentado línea por línea (solo local, no en GitHub)
│
├── .env                        # Variables de entorno (no sube a GitHub)
├── .gitignore
└── package.json
```

---

## Flujo completo de la aplicación

```
1. Usuario se registra    →  POST /register
                              → Cifra la contraseña con bcrypt
                              → Guarda el usuario en MongoDB
                              → Redirige al login

2. Usuario hace login     →  POST /login
                              → Verifica email y contraseña con bcrypt
                              → Crea la sesión en el servidor (express-session)
                              → Redirige a la página de origen

3. Ve el catálogo         →  GET /
                              → Servidor consulta MongoDB y renderiza index.ejs
                              → El JS del cliente maneja el filtro de categorías

4. Agrega al carrito      →  addToCart() en public/js/cart.js
                              → Se guarda en localStorage del navegador

5. Va al carrito          →  GET /cart
                              → El JS del cliente lee localStorage y construye la vista

6. Paga con Stripe        →  POST /api/checkout/create-session
                              → Crea la sesión en Stripe
                              → Guarda el pedido en MongoDB (status: pendiente)
                              → Devuelve la URL de Stripe

7. Stripe procesa el pago →  Redirige a /success?session_id=xxx
                              → Verifica el pago con la API de Stripe
                              → Descuenta stock de cada producto
                              → Cambia el pedido a (status: pagado)

8. Notificación de Stripe →  POST /api/webhook
                              → Verifica la firma criptográfica
                              → Marca el pedido como pagado (respaldo del paso 7)

9. Usuario ve sus pedidos →  GET /mis-pedidos
                              → Requiere sesión activa (middleware requireAuth)
                              → Consulta MongoDB y renderiza la lista de pedidos
```

---

## Roles de usuario

| Rol | Acceso |
|-----|--------|
| `user` (por defecto) | Tienda, carrito, mis pedidos |
| `admin` | Todo lo anterior + panel `/admin/productos` |

Para asignar rol de admin: en MongoDB Atlas, edita el documento del usuario en la colección `users` y cambia el campo `role` de `"user"` a `"admin"`.

---

## Tarjetas de prueba (Stripe modo test)

| Número | Resultado |
|--------|-----------|
| `4242 4242 4242 4242` | Pago exitoso ✅ |
| `4000 0000 0000 0002` | Pago rechazado ❌ |
| `4000 0025 0000 3155` | Requiere autenticación 3D Secure |

Usa cualquier fecha futura (ej: `12/28`) y cualquier CVC (ej: `123`).

---

## Variables de entorno

| Variable | Descripción |
|----------|-------------|
| `MONGODB_URI` | Cadena de conexión de MongoDB Atlas |
| `SESSION_SECRET` | Clave secreta para firmar las cookies de sesión |
| `APP_URL` | URL base de la app (`http://localhost:3000` en desarrollo) |
| `PORT` | Puerto del servidor (3000 por defecto) |
| `STRIPE_SECRET_KEY` | Clave secreta de Stripe (empieza por `sk_test_`) |
| `STRIPE_WEBHOOK_SECRET` | Clave del webhook de Stripe (empieza por `whsec_`) |
| `EMAIL_LIST_VERIFY_API_KEY` | Clave de Email List Verify para el envío de emails |

---

## Despliegue en Render

1. Sube el código a GitHub
2. Ve a [render.com](https://render.com) y crea un nuevo **Web Service**
3. Conecta tu repositorio de GitHub
4. Configura:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Agrega todas las variables de entorno en el panel de Render
6. ¡Deploy automático en cada push!
