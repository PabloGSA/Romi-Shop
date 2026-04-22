import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { data: session } = useSession();
  const { totalItems } = useCart();

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-rose-600">
          ✨ Bisutería Shop
        </Link>

        <div className="flex items-center gap-6">
          <Link href="/" className="text-gray-600 hover:text-rose-600 transition">
            Tienda
          </Link>

          <Link href="/cart" className="relative text-gray-600 hover:text-rose-600 transition">
            🛒 Carrito
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-3 bg-rose-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          {session ? (
            <div className="flex items-center gap-3">
              <span className="text-gray-700 text-sm">Hola, {session.user.name}</span>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="bg-rose-500 text-white px-4 py-1.5 rounded-full text-sm hover:bg-rose-600 transition"
              >
                Salir
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-gray-600 hover:text-rose-600 transition text-sm">
                Iniciar sesión
              </Link>
              <Link
                href="/register"
                className="bg-rose-500 text-white px-4 py-1.5 rounded-full text-sm hover:bg-rose-600 transition"
              >
                Registrarse
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
