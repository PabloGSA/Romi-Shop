import stripe from "../../lib/stripe";
import connectDB from "../../lib/mongodb";
import Order from "../../models/Order";

// IMPORTANTE: Next.js por defecto parsea el body de las peticiones a JSON.
// Stripe necesita el body en formato RAW (sin parsear) para poder verificar
// que el mensaje realmente viene de Stripe. Por eso desactivamos el bodyParser.
export const config = {
  api: {
    bodyParser: false,
  },
};

// Función auxiliar para leer el body crudo de la petición
function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  // Leemos el body crudo y la firma que Stripe envía en el header
  const rawBody = await getRawBody(req);
  const signature = req.headers["stripe-signature"];

  let event;

  try {
    // Stripe verifica que el mensaje es auténtico usando la firma y el webhook secret
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    // Si la firma no es válida, rechazamos la petición
    console.error("Error al verificar webhook:", error.message);
    return res.status(400).json({ message: "Webhook no válido" });
  }

  // Stripe puede enviarnos muchos tipos de eventos.
  // Solo nos interesa cuando el pago se completó con éxito.
  if (event.type === "checkout.session.completed") {
    const stripeSession = event.data.object;

    try {
      await connectDB();

      // Buscamos el pedido por el ID de sesión de Stripe y lo marcamos como pagado
      await Order.findOneAndUpdate(
        { stripeSessionId: stripeSession.id },
        { status: "pagado" }
      );

      console.log("Pedido marcado como pagado:", stripeSession.id);
    } catch (error) {
      console.error("Error al actualizar el pedido:", error);
      return res.status(500).json({ message: "Error al actualizar el pedido" });
    }
  }

  // Respondemos con 200 para que Stripe sepa que recibimos el evento correctamente.
  // Si no respondemos con 200, Stripe reintentará el evento varias veces.
  return res.status(200).json({ received: true });
}
