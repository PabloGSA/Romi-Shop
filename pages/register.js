import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return toast.error("Las contraseñas no coinciden");
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success("¡Cuenta creada exitosamente!");
      router.push("/login");
    } catch (error) {
      toast.error(error.message || "Error al registrarse");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto py-20">

        {/* Encabezado */}
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">Romi Antonucci</p>
          <h1 className="text-3xl font-light text-gray-900 tracking-wide">Crear cuenta</h1>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-8">

          <div>
            <label className="text-xs uppercase tracking-widest text-gray-500 block mb-2">
              Nombre completo
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Tu nombre"
              className="w-full border-b border-gray-300 focus:border-black outline-none py-2 text-sm bg-transparent transition-colors placeholder-gray-300"
            />
          </div>

          <div>
            <label className="text-xs uppercase tracking-widest text-gray-500 block mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="correo@ejemplo.com"
              className="w-full border-b border-gray-300 focus:border-black outline-none py-2 text-sm bg-transparent transition-colors placeholder-gray-300"
            />
          </div>

          <div>
            <label className="text-xs uppercase tracking-widest text-gray-500 block mb-2">
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Mínimo 6 caracteres"
              className="w-full border-b border-gray-300 focus:border-black outline-none py-2 text-sm bg-transparent transition-colors placeholder-gray-300"
            />
          </div>

          <div>
            <label className="text-xs uppercase tracking-widest text-gray-500 block mb-2">
              Confirmar contraseña
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Repite tu contraseña"
              className="w-full border-b border-gray-300 focus:border-black outline-none py-2 text-sm bg-transparent transition-colors placeholder-gray-300"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-4 text-sm uppercase tracking-widest hover:bg-gray-800 transition disabled:opacity-50"
          >
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>

        {/* Link a login */}
        <p className="text-center text-xs text-gray-400 mt-10 uppercase tracking-widest">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="text-black border-b border-black hover:text-gray-600 hover:border-gray-600 transition pb-0.5">
            Inicia sesión
          </Link>
        </p>
      </div>
    </Layout>
  );
}
