const Order = require("../models/orderModel");//structure of ordermodel
const mongoose = require("mongoose");//its a library used for interaction with mngodb.
const Product = require("../models/productModel");// structure of productmodel
const ObjectId = require("mongodb").ObjectId;

const getUserOrders = async (req, res, next) => { //get the user orders
    try {
      
        const orders = await Order.find({ user: req.user._id });

        res.send(orders);
    } catch (error) {
        next(error);
    }
};

const getOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id).populate("user", "-password -isAdmin -_id -__v -createdAt -updatedAt").orFail();
        res.send(order);
    } catch (err) {
        next(err)
    }
}

const createOrder = async (req, res, next) => {
    try {
        const { cartItems, orderTotal, paymentMethod } = req.body;
        if (!cartItems || !orderTotal || !paymentMethod) {
            return res.status(400).send("All inputs are required");
        }

        let ids = cartItems.map((item) => {
            return item.productId;
        })
        let qty = cartItems.map((item) => {
            return Number(item.quantity);
        })

        await Product.find({ _id: { $in: ids } }).then((products) => {
            products.forEach(function (product, index) {
                product.sales += qty[index];
                product.save();
            })
        })

        const order = new Order({
            user: new ObjectId(req.user._id),
            orderTotal: orderTotal,
            cartItems: cartItems,
            paymentMethod: paymentMethod,
        })
        const createdOrder = await order.save();
        res.status(201).send(createdOrder);

    } catch (err) {
        next(err)
    }
}

const updateOrderToPaid = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id).orFail();
        order.isPaid = true;
        order.paidAt = Date.now();
        const updateOrder = await order.save();
        res.send(updateOrder)
    } catch (error) {
        next(error)
    }
}

const updateOrderToDelivered = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id).orFail();
        order.isDelivered = true;
        order.deliveredAt = Date.now();
        const updatedOrder = await order.save();
        res.send(updatedOrder)
    } catch (error) {
        next(error)
    }
}

const getOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({}).populate("user", "-password").sort({
            paymentMethod: "desc"
        })
        res.send(orders)
    } catch (error) {
        next(error)
    }
}

const getOrderForAnalysis = async (req, res, next) => {
    try {
        const start = new Date(req.params.date);
        start.setHours(0, 0, 0, 0);
        const end = new Date(req.params.date);
        end.setHours(23, 59, 59, 999);

        const order = await Order.find({
            createdAt:{
                $gte:start,
                $lte:end,
            }
        }).sort({createdAt:"asc"})
        res.send(order)
    } catch (error) {
        next(error)
    }
}
module.exports = { getUserOrders, getOrder, createOrder, updateOrderToPaid, updateOrderToDelivered, getOrders, getOrderForAnalysis };
