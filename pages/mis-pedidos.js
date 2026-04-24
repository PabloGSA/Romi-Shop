import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import Layout from "../components/Layout";
import connectDB from "../lib/mongodb";
import Order from "../models/Order";

// getServerSideProps se ejecuta en el servidor antes de mostrar la página.
// Si el usuario no está logueado lo mandamos al login directamente.
export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);

  // Si no hay sesión, redirigimos al login
  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  try {
    await connectDB();

    // Buscamos todos los pedidos del usuario, del más nuevo al más viejo
    const orders = await Order.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .lean();

    // Convertimos los datos de MongoDB a un formato que Next.js pueda serializar
    const pedidos = orders.map((order) => ({
      id: order._id.toString(),
      items: order.items.map((item) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      total: order.total,
      status: order.status,
      createdAt: order.createdAt.toISOString(),
    }));

    return { props: { pedidos } };
  } catch (error) {
    console.error(error);
    return { props: { pedidos: [] } };
  }
}

// Función para mostrar el estado con color
function BadgeEstado({ status }) {
  const estilos = {
    pendiente: "bg-yellow-100 text-yellow-700",
    pagado: "bg-green-100 text-green-700",
    cancelado: "bg-red-100 text-red-700",
  };

  return (
    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${estilos[status] || "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  );
}

export default function MisPedidosPage({ pedidos }) {
  return (
    <Layout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Mis pedidos</h1>

      {pedidos.length === 0 ? (
        // Si no tiene pedidos le mostramos un mensaje y un enlace a la tienda
        <div className="text-center py-20">
          <p className="text-5xl mb-4">📦</p>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Todavía no tienes pedidos</h2>
          <p className="text-gray-400 mb-6">Cuando realices una compra aparecerá aquí</p>
          <Link
            href="/"
            className="bg-rose-500 text-white px-6 py-3 rounded-full hover:bg-rose-600 transition"
          >
            Ver productos
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {pedidos.map((pedido) => (
            <div key={pedido.id} className="bg-white rounded-2xl shadow-sm p-6">

              {/* Cabecera del pedido: fecha, estado y total */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-400">
                    {new Date(pedido.createdAt).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-xs text-gray-300">ID: {pedido.id}</p>
                </div>
                <BadgeEstado status={pedido.status} />
              </div>

              {/* Lista de productos del pedido */}
              <ul className="divide-y divide-gray-100 mb-4">
                {pedido.items.map((item, index) => (
                  <li key={index} className="py-2 flex justify-between text-sm text-gray-600">
                    <span>{item.name} <span className="text-gray-400">x{item.quantity}</span></span>
                    <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>

              {/* Total del pedido */}
              <div className="flex justify-between font-bold text-gray-800 border-t pt-3">
                <span>Total</span>
                <span>${pedido.total.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}
