const mongoose = require("mongoose");// imported mongoose library
const User = require("./userModel");

const orderSchema = mongoose.Schema({//schema(using mongoose) which defines the structure of category.
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: User,
    },
    orderTotal: {
        itemsCount: {
            type: Number,
            required: true
        },
        cartSubTotal: {
            type: Number,
            required: true
        }
    },
    cartItems: [
        {
            name: { type: String, required: true },
            price: { type: Number, required: true },
            image: { type: String, required: true },
            quantity: { type: Number, required: true },
            count: { type: Number, required: true }
        }
    ],
    paymentMethod: {
        type: String,
        required: true,
    },
    transactionResult: {
        status: { type: String },
        createTime: { type: String },
        amount: { type: Number }
    },
    isPaid: {
        type: Boolean,
        required: true,
        default: false
    },
    paidAt: {
        type: Date
    },
    isDelivered: {
        type: Boolean,
        required: true,
        default: false
    },
    deliveredAt: {
        type: Date
    }
}, {
    timestamps: true
});

const Order = mongoose.model("Order", orderSchema);
Order.watch().on("change", (data) => {
    // console.log(data)
    if (data.operationType === "insert") {
        io.emit("newOrder", data.fullDocument);
    }
})
module.exports = Order;
