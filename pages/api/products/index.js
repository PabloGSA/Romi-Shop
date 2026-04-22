import connectDB from "../../../lib/mongodb";
import Product from "../../../models/Product";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  try {
    await connectDB();

    const products = await Product.find({});

    // Si no hay productos cargamos los datos iniciales
    if (products.length === 0) {
      await Product.insertMany(SAMPLE_PRODUCTS);
      const seeded = await Product.find({});
      return res.status(200).json(seeded);
    }

    return res.status(200).json(products);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al obtener productos" });
  }
}

const SAMPLE_PRODUCTS = [
  {
    name: "Collar de Perlas",
    description: "Elegante collar de perlas naturales con cierre dorado",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400",
    category: "collares",
    stock: 15,
  },
  {
    name: "Pulsera Dorada",
    description: "Pulsera de oro laminado con detalles artesanales",
    price: 19.99,
    image: "https://images.unsplash.com/photo-1573408301185-9519f94815d5?w=400",
    category: "pulseras",
    stock: 20,
  },
  {
    name: "Aretes de Cristal",
    description: "Aretes colgantes con cristales Swarovski en colores pastel",
    price: 14.99,
    image: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=400",
    category: "aretes",
    stock: 25,
  },
  {
    name: "Anillo de Plata",
    description: "Anillo de plata 925 con piedra turquesa",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400",
    category: "anillos",
    stock: 10,
  },
  {
    name: "Collar Corazón",
    description: "Delicado collar con dije de corazón en oro rosa",
    price: 22.99,
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400",
    category: "collares",
    stock: 18,
  },
  {
    name: "Pulsera de Cuentas",
    description: "Pulsera boho con cuentas de colores y macramé",
    price: 9.99,
    image: "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=400",
    category: "pulseras",
    stock: 30,
  },
];
