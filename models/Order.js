import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    // El usuario que hizo el pedido
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Email del comprador (lo guardamos directo para mostrarlo fácil)
    userEmail: {
      type: String,
      required: true,
    },

    // Los productos que se compraron
    items: [
      {
        // Guardamos el ID del producto para poder actualizar su stock después
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        image: { type: String },
      },
    ],

    // Total de la compra
    total: {
      type: Number,
      required: true,
    },

    // Estado del pedido
    status: {
      type: String,
      enum: ["pendiente", "pagado", "cancelado"],
      default: "pendiente",
    },

    // ID de la sesión de Stripe (para poder identificar el pedido cuando Stripe nos avisa)
    stripeSessionId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
