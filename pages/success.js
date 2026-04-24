import Link from "next/link";
import Layout from "../components/Layout";
import connectDB from "../lib/mongodb";
import Order from "../models/Order";
import Product from "../models/Product";
import stripeLib from "../lib/stripe";

// getServerSideProps se ejecuta en el servidor antes de mostrar la página.
// Aprovechamos que Stripe nos manda el session_id en la URL para:
// 1. Verificar con Stripe que el pago fue exitoso
// 2. Actualizar el pedido en MongoDB a "pagado"
// 3. Mostrar los datos reales del pedido al usuario
export async function getServerSideProps(context) {
  const { session_id } = context.query;

  if (!session_id) {
    return { props: { order: null } };
  }

  try {
    await connectDB();

    // Preguntamos a Stripe si la sesión de pago fue exitosa
    const stripeSession = await stripeLib.checkout.sessions.retrieve(session_id);

    // Si Stripe confirma que el pago está completo, actualizamos el pedido
    if (stripeSession.payment_status === "paid") {
      // Buscamos el pedido ANTES de actualizarlo para saber su estado actual
      const orderActual = await Order.findOne({ stripeSessionId: session_id });

      // Solo descontamos stock si el pedido estaba en "pendiente".
      // Esto evita que si el usuario recarga la página se reste el stock dos veces.
      if (orderActual && orderActual.status === "pendiente") {
        // Para cada producto comprado, restamos la cantidad del stock
        for (const item of orderActual.items) {
          await Product.findByIdAndUpdate(
            item.productId,
            { $inc: { stock: -item.quantity } }
          );
        }

        // Marcamos el pedido como pagado
        await Order.findOneAndUpdate(
          { stripeSessionId: session_id },
          { status: "pagado" }
        );

      }
    }

    // Buscamos el pedido actualizado en MongoDB para mostrarlo
    const order = await Order.findOne({ stripeSessionId: session_id }).lean();

    if (!order) {
      return { props: { order: null } };
    }

    return {
      props: {
        order: {
          id: order._id.toString(),
          userEmail: order.userEmail,
          items: order.items,
          total: order.total,
          status: order.status,
          createdAt: order.createdAt.toISOString(),
        },
      },
    };
  } catch (error) {
    console.error(error);
    return { props: { order: null } };
  }
}

export default function SuccessPage({ order }) {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto py-20">
        <div className="text-center border-b border-gray-200 pb-10 mb-10">
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-3">Romi Antonucci</p>
          <div className="w-16 h-16 border border-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl">✓</span>
          </div>
          <h1 className="text-4xl font-light text-gray-900 tracking-wide mb-3">Pago exitoso</h1>
          <p className="text-gray-500">Tu pedido ha sido procesado correctamente.</p>
        </div>

        {order ? (
          <div className="border border-gray-200 p-8 mb-8 text-left">
            <p className="text-xs uppercase tracking-widest text-gray-500 mb-6">Resumen del pedido</p>

            <ul className="space-y-1">
              {order.items.map((item, index) => (
                <li key={index} className="text-sm text-gray-700 flex justify-between py-2 border-b border-gray-100">
                  <span>{item.name} x{item.quantity}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>

            <div className="border-t border-gray-200 pt-4 mt-4 flex justify-between text-gray-900 font-medium">
              <span>Total</span>
              <span>${order.total.toFixed(2)}</span>
            </div>

            <div className="mt-6 text-sm text-gray-500 space-y-2">
              <p>Email: {order.userEmail}</p>
              <p>Estado: {order.status}</p>
            </div>
          </div>
        ) : (
          <div className="border border-gray-200 p-8 mb-8 text-left space-y-2">
            <p className="text-sm text-gray-600">Pago procesado por Stripe</p>
            <p className="text-sm text-gray-600">Pedido confirmado</p>
          </div>
        )}

        <div className="text-center">
          <Link
            href="/"
            className="inline-block border border-black text-black px-10 py-3 text-sm uppercase tracking-widest hover:bg-black hover:text-white transition"
          >
            Seguir comprando
          </Link>
        </div>
      </div>
    </Layout>
  );
}
