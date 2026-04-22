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
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden">
      <div className="relative h-56 w-full">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>

      <div className="p-4">
        <span className="text-xs text-rose-400 uppercase font-semibold tracking-wide">
          {product.category}
        </span>
        <h3 className="text-gray-800 font-semibold text-lg mt-1">{product.name}</h3>
        <p className="text-gray-500 text-sm mt-1 line-clamp-2">{product.description}</p>

        <div className="flex items-center justify-between mt-4">
          <span className="text-rose-600 font-bold text-xl">
            ${product.price.toFixed(2)}
          </span>
          <button
            onClick={handleAddToCart}
            className="bg-rose-500 text-white px-4 py-2 rounded-full text-sm hover:bg-rose-600 transition"
          >
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
}
