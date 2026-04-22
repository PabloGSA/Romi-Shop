import { useState } from "react";
import Layout from "../components/Layout";
import ProductCard from "../components/ProductCard";

const CATEGORIES = ["todos", "collares", "pulseras", "aretes", "anillos"];

export default function HomePage({ products }) {
  const [selectedCategory, setSelectedCategory] = useState("todos");

  const filteredProducts =
    selectedCategory === "todos"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <Layout>
      <div className="text-center py-12 bg-gradient-to-r from-rose-100 to-pink-100 rounded-3xl mb-10">
        <h1 className="text-4xl font-bold text-rose-700 mb-3">
          ✨ Bisutería Artesanal
        </h1>
        <p className="text-gray-500 text-lg">
          Joyas únicas hechas con amor para cada ocasión
        </p>
      </div>

      <div className="flex flex-wrap gap-3 mb-8 justify-center">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-5 py-2 rounded-full text-sm capitalize transition ${
              selectedCategory === cat
                ? "bg-rose-500 text-white"
                : "bg-white text-gray-600 hover:bg-rose-50 border border-rose-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400 py-12">
          No hay productos en esta categoría.
        </p>
      )}
    </Layout>
  );
}

export async function getServerSideProps() {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/products`);
    const products = await res.json();
    return { props: { products } };
  } catch (error) {
    return { props: { products: [] } };
  }
}
