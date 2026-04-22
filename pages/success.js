import Link from "next/link";
import Layout from "../components/Layout";

export default function SuccessPage() {
  return (
    <Layout>
      <div className="max-w-lg mx-auto text-center py-20">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">✅</span>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-3">¡Pago exitoso!</h1>
        <p className="text-gray-500 mb-2">Tu pedido ha sido procesado correctamente.</p>
        <p className="text-gray-400 text-sm mb-8">
          Recibirás un email de confirmación con los detalles de tu compra.
        </p>

        <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-8 text-left space-y-2">
          <p className="text-green-700 text-sm">✓ Pago procesado por Stripe</p>
          <p className="text-green-700 text-sm">✓ Pedido confirmado</p>
          <p className="text-green-700 text-sm">✓ Email de confirmación enviado</p>
        </div>

        <Link
          href="/"
          className="bg-rose-500 text-white px-8 py-3 rounded-full hover:bg-rose-600 transition font-semibold"
        >
          Seguir comprando
        </Link>
      </div>
    </Layout>
  );
}
