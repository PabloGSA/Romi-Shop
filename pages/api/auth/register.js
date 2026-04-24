import connectDB from "../../../lib/mongodb";
import User from "../../../models/User";

// Función que llama a la API de Email List Verify para comprobar si un email es real
async function verificarEmail(email) {
  const apiKey = process.env.EMAIL_LIST_VERIFY_API_KEY;
  const url = `https://apps.emaillistverify.com/api/verifyEmail?secret=${apiKey}&email=${email}`;

  const response = await fetch(url);
  const resultado = await response.text();

  // La API devuelve un texto simple: "ok", "invalid", "disposable", "unknown", etc.
  return resultado.trim();
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    // Verificamos con Email List Verify que el email existe y es real
    const estadoEmail = await verificarEmail(email);

    // Solo aceptamos emails con estado "ok"
    if (estadoEmail !== "ok") {
      return res.status(400).json({
        message: "El email no es válido o no existe. Por favor usa un email real.",
      });
    }

    await connectDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Ya existe una cuenta con ese email" });
    }

    const user = await User.create({ name, email, password });

    return res.status(201).json({
      message: "Usuario creado exitosamente",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}
