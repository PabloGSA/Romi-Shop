import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import stripe from "../../../lib/stripe";
import connectDB from "../../../lib/mongodb";
import Order from "../../../models/Order";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  // Verificamos que el usuario esté logueado
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Debes iniciar sesión para comprar" });
  }

  try {
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "El carrito está vacío" });
    }

    // Calculamos el total del pedido
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Stripe trabaja en centavos, multiplicamos el precio por 100
    const lineItems = items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          images: [item.image],
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    // Primero creamos la sesión en Stripe para obtener su ID
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXTAUTH_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/cart`,
      customer_email: session.user.email,
    });

    // Luego guardamos el pedido en MongoDB con el ID de Stripe
    await connectDB();
    await Order.create({
      userId: session.user.id,
      userEmail: session.user.email,
      items: items.map((item) => ({
        productId: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
      total: Math.round(total * 100) / 100,
      status: "pendiente",
      stripeSessionId: checkoutSession.id,
    });

    // Devolvemos la URL de Stripe para redirigir al usuario
    return res.status(200).json({ url: checkoutSession.url });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al procesar el pago" });
  }
}
