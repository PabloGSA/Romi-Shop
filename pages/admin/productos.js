import { useState, useEffect } from "react";
import Image from "next/image";
import Layout from "../../components/Layout";

const CATEGORIAS = ["collares", "pulseras", "aretes", "anillos"];

const productoVacio = {
  name: "",
  description: "",
  price: "",
  image: "",
  category: "collares",
  stock: "",
};

export default function AdminProductos() {
  const [productos, setProductos] = useState([]);
  const [formulario, setFormulario] = useState(productoVacio);
  const [editandoId, setEditandoId] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    cargarProductos();
  }, []);

  async function cargarProductos() {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProductos(data);
  }

  function handleChange(e) {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setCargando(true);
    setMensaje("");

    try {
      const res = editandoId
        ? await fetch(`/api/products/${editandoId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formulario),
          })
        : await fetch("/api/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formulario),
          });

      if (res.ok) {
        setMensaje(editandoId ? "Producto actualizado" : "Producto creado");
        setFormulario(productoVacio);
        setEditandoId(null);
        cargarProductos();
      } else {
        const error = await res.json();
        setMensaje("Error: " + error.message);
      }
    } catch {
      setMensaje("Error de conexión");
    }

    setCargando(false);
  }

  function handleEditar(producto) {
    setFormulario({
      name: producto.name,
      description: producto.description,
      price: producto.price,
      image: producto.image,
      category: producto.category,
      stock: producto.stock,
    });
    setEditandoId(producto._id);
    setMensaje("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleEliminar(id) {
    if (!confirm("¿Eliminar este producto?")) return;
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (res.ok) {
      setMensaje("Producto eliminado");
      cargarProductos();
    }
  }

  function handleCancelar() {
    setFormulario(productoVacio);
    setEditandoId(null);
    setMensaje("");
  }

  return (
    <Layout>
      {/* Encabezado */}
      <div className="border-b border-gray-200 pb-6 mb-10">
        <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">Romi Antonucci</p>
        <h1 className="text-3xl font-light text-gray-900 tracking-wide">Panel de Administración</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

        {/* Formulario — ocupa 1 columna */}
        <div className="lg:col-span-1">
          <h2 className="text-sm uppercase tracking-widest text-gray-900 font-semibold mb-6">
            {editandoId ? "Editar producto" : "Nuevo producto"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="text-xs uppercase tracking-widest text-gray-500 block mb-1">Nombre</label>
              <input
                type="text"
                name="name"
                value={formulario.name}
                onChange={handleChange}
                required
                className="w-full border-b border-gray-300 focus:border-black outline-none py-2 text-sm bg-transparent transition-colors"
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-widest text-gray-500 block mb-1">Descripción</label>
              <textarea
                name="description"
                value={formulario.description}
                onChange={handleChange}
                required
                rows={3}
                className="w-full border-b border-gray-300 focus:border-black outline-none py-2 text-sm bg-transparent transition-colors resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs uppercase tracking-widest text-gray-500 block mb-1">Precio ($)</label>
                <input
                  type="number"
                  name="price"
                  value={formulario.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full border-b border-gray-300 focus:border-black outline-none py-2 text-sm bg-transparent transition-colors"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-gray-500 block mb-1">Stock</label>
                <input
                  type="number"
                  name="stock"
                  value={formulario.stock}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full border-b border-gray-300 focus:border-black outline-none py-2 text-sm bg-transparent transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-xs uppercase tracking-widest text-gray-500 block mb-1">Categoría</label>
              <select
                name="category"
                value={formulario.category}
                onChange={handleChange}
                className="w-full border-b border-gray-300 focus:border-black outline-none py-2 text-sm bg-transparent transition-colors capitalize"
              >
                {CATEGORIAS.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs uppercase tracking-widest text-gray-500 block mb-1">URL de la imagen</label>
              <input
                type="text"
                name="image"
                value={formulario.image}
                onChange={handleChange}
                required
                placeholder="/images/collares/collar-1.jpeg"
                className="w-full border-b border-gray-300 focus:border-black outline-none py-2 text-sm bg-transparent transition-colors"
              />
            </div>

            {/* Vista previa de la imagen */}
            {formulario.image && (
              <div className="relative h-40 w-full bg-gray-100 overflow-hidden">
                <Image src={formulario.image} alt="Vista previa" fill className="object-cover" />
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={cargando}
                className="flex-1 bg-black text-white py-3 text-sm uppercase tracking-widest hover:bg-gray-800 transition disabled:opacity-50"
              >
                {cargando ? "Guardando..." : editandoId ? "Actualizar" : "Crear producto"}
              </button>
              {editandoId && (
                <button
                  type="button"
                  onClick={handleCancelar}
                  className="flex-1 border border-black text-black py-3 text-sm uppercase tracking-widest hover:bg-gray-100 transition"
                >
                  Cancelar
                </button>
              )}
            </div>

            {mensaje && (
              <p className={`text-sm text-center py-2 ${mensaje.startsWith("Error") ? "text-red-500" : "text-green-600"}`}>
                {mensaje}
              </p>
            )}
          </form>
        </div>

        {/* Lista de productos — ocupa 2 columnas */}
        <div className="lg:col-span-2">
          <h2 className="text-sm uppercase tracking-widest text-gray-900 font-semibold mb-6">
            Productos <span className="text-gray-400 font-normal">({productos.length})</span>
          </h2>

          {productos.length === 0 ? (
            <p className="text-gray-400 text-sm uppercase tracking-widest">No hay productos.</p>
          ) : (
            <div className="space-y-3">
              {productos.map((producto) => (
                <div key={producto._id} className="flex items-center gap-4 border border-gray-100 p-4 hover:border-gray-300 transition">

                  {/* Imagen */}
                  <div className="relative w-16 h-16 flex-shrink-0 bg-gray-100 overflow-hidden">
                    <Image src={producto.image} alt={producto.name} fill className="object-cover" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{producto.name}</p>
                    <p className="text-xs text-gray-400 uppercase tracking-widest">{producto.category}</p>
                    <p className="text-sm text-gray-700 mt-0.5">${producto.price} · Stock: {producto.stock}</p>
                  </div>

                  {/* Acciones */}
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleEditar(producto)}
                      className="border border-black text-black px-4 py-1.5 text-xs uppercase tracking-widest hover:bg-black hover:text-white transition"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleEliminar(producto._id)}
                      className="border border-red-400 text-red-400 px-4 py-1.5 text-xs uppercase tracking-widest hover:bg-red-400 hover:text-white transition"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
