import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { data: session } = useSession();
  const { totalItems } = useCart();

  return (
    <header>

      {/* Barra de anuncio superior */}
      <div className="bg-black text-white text-center text-xs py-2 tracking-widest uppercase">
        Envío gratis en compras mayores a $50
      </div>

      {/* Navbar principal */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="text-lg font-semibold tracking-widest uppercase">
            Romi Antonucci
          </Link>

          {/* Lado derecho: carrito y sesion */}
          <div className="flex items-center gap-6 text-sm">

            <Link href="/cart" className="relative uppercase tracking-widest text-sm text-gray-600 hover:text-black transition">
              Carrito
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-4 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </Link>

            {session ? (
              <div className="flex items-center gap-5">
                {session.user.role === "admin" && (
                  <Link href="/admin/productos" className="uppercase tracking-widest text-sm text-gray-600 hover:text-black transition">
                    Admin
                  </Link>
                )}
                <Link href="/mis-pedidos" className="uppercase tracking-widest text-sm text-gray-600 hover:text-black transition">
                  Mis pedidos
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="border border-black px-4 py-1.5 text-sm uppercase tracking-wide hover:bg-black hover:text-white transition"
                >
                  Salir
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/login" className="uppercase tracking-widest text-sm text-gray-600 hover:text-black transition">
                  Entrar
                </Link>
                <Link
                  href="/register"
                  className="border border-black px-4 py-1.5 text-sm uppercase tracking-wide hover:bg-black hover:text-white transition"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
