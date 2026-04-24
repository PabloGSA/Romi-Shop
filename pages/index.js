import { useState } from "react";
import Link from "next/link";
import Layout from "../components/Layout";
import ProductCard from "../components/ProductCard";

const CATEGORIES = ["todos", "collares", "pulseras", "aretes", "anillos"];

export default function HomePage({ products, initialCategory }) {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  const filteredProducts =
    selectedCategory === "todos"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <Layout>

      {/* Hero banner estilo Pandora */}
      <div className="relative bg-gray-100 mb-14 flex flex-col items-center justify-center py-24 text-center">
        <p className="text-xs uppercase tracking-widest text-gray-500 mb-3">Nueva colección</p>
        <h1 className="text-5xl font-light text-gray-900 mb-4 tracking-wide">
          Romi Antonucci
        </h1>
        <p className="text-gray-500 text-base mb-8 max-w-md">
          Piezas únicas hechas a mano para cada ocasión especial
        </p>
        <Link
          href="#productos"
          className="border border-black text-black px-8 py-3 uppercase tracking-widest text-sm hover:bg-black hover:text-white transition"
        >
          Ver colección
        </Link>
      </div>

      {/* Filtros por categoria */}
      <div id="productos" className="flex flex-wrap gap-0 mb-10 justify-center border-b border-gray-200">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-6 py-3 text-sm uppercase tracking-widest transition border-b-2 -mb-px ${
              selectedCategory === cat
                ? "border-black text-black font-semibold"
                : "border-transparent text-gray-400 hover:text-black"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid de productos */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400 py-20 uppercase tracking-widest text-sm">
          No hay productos en esta categoría
        </p>
      )}
    </Layout>
  );
}

export async function getServerSideProps(context) {
  // Leemos el parametro "cat" de la URL (ej: /?cat=collares)
  const initialCategory = context.query.cat || "todos";

  try {
    const protocol =
      context.req.headers["x-forwarded-proto"] ||
      (process.env.NODE_ENV === "production" ? "https" : "http");
    const host = context.req.headers["x-forwarded-host"] || context.req.headers.host;
    const baseUrl = `${protocol}://${host}`;
    const res = await fetch(`${baseUrl}/api/products`);
    const products = await res.json();
    return { props: { products, initialCategory } };
  } catch (error) {
    return { props: { products: [], initialCategory: "todos" } };
  }
}
