import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";

export default function CartPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { items, removeItem, clearCart, totalItems, totalPrice } = useCart();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (!session) {
      toast.error("Debes iniciar sesión para pagar");
      router.push("/login");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/checkout/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      clearCart();
      window.location.href = data.url;
    } catch (error) {
      toast.error(error.message || "Error al procesar el pago");
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <Layout>
        <div className="text-center py-20">
          <p className="text-6xl mb-4">🛒</p>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Tu carrito está vacío</h2>
          <p className="text-gray-400 mb-6">Agrega algunos productos para comenzar</p>
          <Link href="/" className="bg-rose-500 text-white px-6 py-3 rounded-full hover:bg-rose-600 transition">
            Ver productos
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Tu carrito ({totalItems} {totalItems === 1 ? "artículo" : "artículos"})
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item._id} className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm">
              <div className="relative w-20 h-20 flex-shrink-0">
                <Image src={item.image} alt={item.name} fill className="object-cover rounded-xl" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{item.name}</h3>
                <p className="text-rose-500 font-bold">${item.price.toFixed(2)}</p>
                <p className="text-sm text-gray-400">Cantidad: {item.quantity}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-800">${(item.price * item.quantity).toFixed(2)}</p>
                <button
                  onClick={() => removeItem(item._id)}
                  className="text-red-400 hover:text-red-600 text-sm mt-1 transition"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Resumen del pedido</h2>

            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Envío</span>
                <span className="text-green-500">Gratis</span>
              </div>
            </div>

            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between font-bold text-gray-800 text-lg">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full bg-rose-500 text-white py-3 rounded-xl font-semibold hover:bg-rose-600 transition disabled:opacity-50"
            >
              {loading ? "Redirigiendo..." : "Pagar con Stripe 💳"}
            </button>

            <p className="text-xs text-center text-gray-400 mt-3">
              Pago seguro procesado por Stripe
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
