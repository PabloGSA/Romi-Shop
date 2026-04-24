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
      <div className="max-w-lg mx-auto text-center py-20">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">✅</span>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-3">¡Pago exitoso!</h1>
        <p className="text-gray-500 mb-2">Tu pedido ha sido procesado correctamente.</p>

        {order ? (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-8 text-left space-y-3">
            <p className="text-green-700 text-sm font-semibold">Resumen del pedido:</p>

            <ul className="space-y-1">
              {order.items.map((item, index) => (
                <li key={index} className="text-gray-600 text-sm flex justify-between">
                  <span>{item.name} x{item.quantity}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>

            <div className="border-t pt-2 flex justify-between font-semibold text-gray-700">
              <span>Total</span>
              <span>${order.total.toFixed(2)}</span>
            </div>

            <p className="text-green-700 text-sm">✓ Email: {order.userEmail}</p>
            <p className="text-green-700 text-sm">✓ Estado: {order.status}</p>
          </div>
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-8 text-left space-y-2">
            <p className="text-green-700 text-sm">✓ Pago procesado por Stripe</p>
            <p className="text-green-700 text-sm">✓ Pedido confirmado</p>
          </div>
        )}

        <Link
          href="/"
          className="bg-rose-500 text-white px-8 py-3 rounded-full hover:bg-rose-600 transition font-semibold"
        >
          Seguir comprando
        </Link>
      </div>
    </Layout>
  );
}
