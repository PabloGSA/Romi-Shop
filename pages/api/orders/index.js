import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import connectDB from "../../../lib/mongodb";
import Order from "../../../models/Order";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  // Solo los usuarios logueados pueden ver sus pedidos
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Debes iniciar sesión" });
  }

  try {
    await connectDB();

    // Buscamos solo los pedidos del usuario actual, del más nuevo al más viejo
    const orders = await Order.find({ userId: session.user.id }).sort({ createdAt: -1 });

    return res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al obtener los pedidos" });
  }
}
