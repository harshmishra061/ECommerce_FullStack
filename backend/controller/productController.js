const Product = require('../models/productModel');
const ErrorHandler = require('../utils/errorhandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors')
const ApiFeatures = require('../utils/apifeatures')

// Create Product -- admin
exports.createProduct = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.create(req.body);
    res.status(201).json({
        success: true,
        product
    })
});


// get all products
exports.getAllProducts = catchAsyncErrors(async (req, res, next) => {
    const resultPerPage = 5;
    const productCount = await Product.countDocuments();
    const apifeature = new ApiFeatures(Product, req.query).search().filter().pagination(resultPerPage);
    const products = await apifeature.query;
    res.status(200).json({
        success: true,
        productCount,
        products,

    });
});

//update product -- admin
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
    let product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler('Product not found', 404));
    }
    product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true, useFindAndModify: false });
    res.status(200).json({
        success: true,
        product,
    })
});

// delete product -- admin
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
        return next(new ErrorHandler('Product not found', 404));
    }
    return res.status(200).json({
        status: true,
        message: 'Product deleted successfully.'
    })
});

// get single product details
exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler('Product not found', 404));
    }
    return res.status(200).json({
        success: true,
        product
    })
})