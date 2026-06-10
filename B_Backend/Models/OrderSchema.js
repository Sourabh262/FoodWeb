import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    custName: {
      type: String,
      required: true,
    },
    custPhone: {
      type: Number,
     
    },
    tableNumber: {
      type: String,
      required: true,
    },

    items: [
      {
        foodId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Food",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],

    totalPrice: {
      type: Number,
      default: 0,
    },

    orderStatus: {
      type: String,
      default: "pending",
      enum: ["pending", "preparing", "served"],
    },
  },
  {
    timestamps: true,
  },
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
