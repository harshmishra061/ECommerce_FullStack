const catchAsyncErrors = require('../middleware/catchAsyncErrors')
const Order = require('../models/orderModel')
const Product = require('../models/productModel')
const ErrorHandler = require('../utils/errorhandler')

// Create New Order
exports.newOrder = catchAsyncErrors(async (req, res, next) => {
    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    } = req.body
    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        user: req.user._id,
    })

    res.status(201).json({
        success: true,
        order,
    })
})

//Get Single Order
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate(
        'user',
        'name email'
    )
    if (!order) {
        return next(new ErrorHandler('Order not found with this Id', 404))
    }

    res.status(200).json({
        success: true,
        order,
    })
})

//Get Logged in User Order
exports.myOrders = catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find({ user: req.user._id })
    res.status(200).json({
        success: true,
        orders,
    })
})

// Get all orders -- admin
exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find()
    let totalAmount = 0
    orders.forEach((order) => {
        totalAmount += order.totalPrice
    })
    res.status(200).json({
        success: true,
        totalAmount,
        orders,
    })
})

// Update order status -- admin
exports.updateOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id)

    if (!order) {
        return next(new ErrorHandler('Order does not exist'))
    }

    if (order.orderStatus === 'Delivered') {
        return next(
            new ErrorHandler('You have already delivered this order', 404)
        )
    }

    order.orderItems.forEach(async (ord) => {
        await updateStock(ord.product, ord.quantity)
    })

    order.orderStatus = req.body.status

    if (req.body.status === 'Delivered') {
        order.deliveredAt = Date.now()
    }

    await order.save()

    res.status(200).json({
        success: true,
    })
})

async function updateStock(id, quantity) {
    const product = await Product.findById(id)
    product.stock -= quantity
    await product.save({
        validateBeforeSave: false,
    })
}

// Delete order -- admin
exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id)

    if (!order) {
        return next(new ErrorHandler('Order does not exist'))
    }

    await Order.findByIdAndDelete(req.params.id)

    res.status(200).json({
        success: true,
        message: 'Order deleted successfully',
    })
})
