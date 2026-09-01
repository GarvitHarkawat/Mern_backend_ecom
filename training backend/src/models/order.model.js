const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      index: true,
    },

    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },

        seller: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
          required: true,
          index: true,
        },

        title: String,

        image: String,

        price: {
          type: Number,
          required: true,
        },

        qty: {
          type: Number,
          required: true,
          min: 1,
        },

        status: {
          type: String,
          enum: [
            "placed",
            "confirmed",
            "shipped",
            "delivered",
            "cancelled",
            "returned",
          ],
          default: "placed",
        },

        deliveredAt: Date,

        returnRequested: {
          type: Boolean,
          default: false,
        },
      },
    ],

    shippingAddress: {
      fullName: String,
      phone: String,
      line1: String,
      line2: String,
      city: String,
      state: String,
      pincode: String,
    },

    amount: {
      itemsTotal: Number,
      shipping: Number,
      total: Number,
    },

    payment: {
      method: {
        type: String,
        enum: ["cod", "razorpay"],
        required: true,
      },

      status: {
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending",
      },

      razorpayOrderId: String,
      razorpayPaymentId: String,
      razorpaySignature: String,

      paidAt: Date,
    },

    orderStatus: {
      type: String,
      enum: ["pending_payment", "confirmed", "completed", "cancelled"],
      default: "confirmed",
      index: true,
    },

    placedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

orderSchema.index({
  user: 1,
  createdAt: -1,
});

orderSchema.index({
  "items.seller": 1,
  createdAt: -1,
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
