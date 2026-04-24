import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await signIn("credentials", {
      email: formData.email,
      password: formData.password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      toast.error("Email o contraseña incorrectos");
    } else {
      toast.success("¡Bienvenida de vuelta!");
      router.push("/");
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto py-20">

        {/* Encabezado */}
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">Romi Antonucci</p>
          <h1 className="text-3xl font-light text-gray-900 tracking-wide">Iniciar sesión</h1>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-8">

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
              placeholder="Tu contraseña"
              className="w-full border-b border-gray-300 focus:border-black outline-none py-2 text-sm bg-transparent transition-colors placeholder-gray-300"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-4 text-sm uppercase tracking-widest hover:bg-gray-800 transition disabled:opacity-50"
          >
            {loading ? "Entrando..." : "Iniciar sesión"}
          </button>
        </form>

        {/* Link a registro */}
        <p className="text-center text-xs text-gray-400 mt-10 uppercase tracking-widest">
          ¿No tienes cuenta?{" "}
          <Link href="/register" className="text-black border-b border-black hover:text-gray-600 hover:border-gray-600 transition pb-0.5">
            Regístrate
          </Link>
        </p>
      </div>
    </Layout>
  );
}
