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
    pendiente: "border-yellow-400 text-yellow-600",
    pagado: "border-green-500 text-green-600",
    cancelado: "border-red-400 text-red-500",
  };

  return (
    <span className={`text-xs uppercase tracking-widest px-3 py-1 border ${estilos[status] || "border-gray-300 text-gray-500"}`}>
      {status}
    </span>
  );
}

export default function MisPedidosPage({ pedidos }) {
  return (
    <Layout>

      {/* Encabezado estilo Pandora */}
      <div className="border-b border-gray-200 pb-6 mb-10">
        <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">Romi Antonucci</p>
        <h1 className="text-3xl font-light text-gray-900 tracking-wide">Mis pedidos</h1>
      </div>

      {pedidos.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-6">Sin pedidos</p>
          <h2 className="text-2xl font-light text-gray-900 mb-3">Todavía no tienes pedidos</h2>
          <p className="text-gray-400 text-sm mb-10">Cuando realices una compra aparecerá aquí</p>
          <Link
            href="/"
            className="border border-black text-black px-10 py-3 text-sm uppercase tracking-widest hover:bg-black hover:text-white transition"
          >
            Ver colección
          </Link>
        </div>
      ) : (
        <div className="space-y-0 divide-y divide-gray-100">
          {pedidos.map((pedido) => (
            <div key={pedido.id} className="py-8">

              {/* Cabecera del pedido */}
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">
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
              <ul className="divide-y divide-gray-100 mb-5">
                {pedido.items.map((item, index) => (
                  <li key={index} className="py-3 flex justify-between text-sm text-gray-600">
                    <span>
                      {item.name}
                      <span className="text-gray-400 ml-2">x{item.quantity}</span>
                    </span>
                    <span className="font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>

              {/* Total del pedido */}
              <div className="flex justify-between text-sm font-medium text-gray-900 border-t border-gray-100 pt-4">
                <span className="uppercase tracking-widest text-xs">Total</span>
                <span>${pedido.total.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}
