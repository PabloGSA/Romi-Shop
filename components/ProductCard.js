import Image from "next/image";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";

export default function ProductCard({ product }) {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem(product);
    toast.success(`${product.name} agregado al carrito`);
  };

  return (
    <div className="group bg-white">

      {/* Imagen del producto */}
      <div className="relative h-72 w-full overflow-hidden bg-gray-100">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Informacion del producto */}
      <div className="pt-4 pb-2">
        <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">
          {product.category}
        </p>
        <h3 className="text-gray-900 font-medium text-base">{product.name}</h3>
        <p className="text-gray-500 text-sm mt-1 line-clamp-1">{product.description}</p>

        <div className="flex items-center justify-between mt-3">
          <span className="text-gray-900 font-semibold text-lg">
            ${product.price.toFixed(2)}
          </span>
          <button
            onClick={handleAddToCart}
            className="bg-black text-white px-5 py-2 text-sm uppercase tracking-wide hover:bg-gray-800 transition"
          >
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
}
