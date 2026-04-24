import connectDB from "../../../lib/mongodb";
import Product from "../../../models/Product";

export default async function handler(req, res) {
  await connectDB();

  const { id } = req.query;

  // GET - obtener un producto por su ID
  if (req.method === "GET") {
    try {
      const product = await Product.findById(id);

      if (!product) {
        return res.status(404).json({ message: "Producto no encontrado" });
      }

      return res.status(200).json(product);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error al obtener el producto" });
    }
  }

  // PUT - actualizar un producto
  if (req.method === "PUT") {
    try {
      const { name, description, price, image, category, stock } = req.body;

      const updatedProduct = await Product.findByIdAndUpdate(
        id,
        { name, description, price, image, category, stock },
        { new: true, runValidators: true }
      );

      if (!updatedProduct) {
        return res.status(404).json({ message: "Producto no encontrado" });
      }

      return res.status(200).json(updatedProduct);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error al actualizar el producto" });
    }
  }

  // DELETE - eliminar un producto
  if (req.method === "DELETE") {
    try {
      const deletedProduct = await Product.findByIdAndDelete(id);

      if (!deletedProduct) {
        return res.status(404).json({ message: "Producto no encontrado" });
      }

      return res.status(200).json({ message: "Producto eliminado correctamente" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error al eliminar el producto" });
    }
  }

  return res.status(405).json({ message: "Método no permitido" });
}
