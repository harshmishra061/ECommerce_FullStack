const catchAsyncErrors = require('../middleware/catchAsyncErrors')
const Product = require('../models/productModel')
const ApiFeatures = require('../utils/apifeatures')
const ErrorHandler = require('../utils/errorhandler')

// Create Product -- admin
exports.createProduct = catchAsyncErrors(async (req, res, next) => {
    req.body.user = req.user._id
    const product = await Product.create(req.body)
    res.status(201).json({
        success: true,
        product,
    })
})

// get all products
exports.getAllProducts = catchAsyncErrors(async (req, res, next) => {
    const resultPerPage = 8
    const productsCount = await Product.countDocuments()
    const apifeature = new ApiFeatures(Product, req.query)
        .search()
        .filter()
        .pagination(resultPerPage)
    const products = await apifeature.query
    res.status(200).json({
        success: true,
        productsCount,
        products,
    })
})

// get single product details
exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id)
    if (!product) {
        return next(new ErrorHandler('Product not found', 404))
    }
    return res.status(200).json({
        success: true,
        product,
    })
})

//update product -- admin
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
    let product = await Product.findById(req.params.id)
    console.log(product)
    if (!product) {
        return next(new ErrorHandler('Product not found', 404))
    }
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    })
    res.status(200).json({
        success: true,
        product,
    })
})

// delete product -- admin
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findByIdAndDelete(req.params.id)
    if (!product) {
        return next(new ErrorHandler('Product not found', 404))
    }
    return res.status(200).json({
        status: true,
        message: 'Product deleted successfully.',
    })
})

// Create new review or update the review
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
    const { rating, comment, productId } = req.body
    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment,
    }
    console.log(review)

    const product = await Product.findById(productId)

    console.log('product', product)

    const isReviewed = product.reviews.find(
        (rev) => rev.user.toString() == req.user._id.toString()
    )

    if (isReviewed) {
        product.reviews.forEach((rev) => {
            if (rev.user.toString() == req.user._id.toString()) {
                rev.rating = rating
                rev.comment = comment
            }
        })
    } else {
        product.reviews.push(review)
        product.numberOfReviews = product.reviews.length
    }

    let avg = 0
    product.reviews.forEach((rev) => {
        avg += rev.rating
    })
    product.ratings = avg / product.reviews.length
    await product.save()

    res.status(200).json({
        success: true,
        message: 'rating added/updated successfully',
    })
})

exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.productId)
    if (!product) {
        return next(new ErrorHandler('Product not found'))
    }

    return res.status(200).json({
        success: true,
        reviews: product.reviews,
    })
})

exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.productId)
    if (!product) {
        return next(new ErrorHandler('Product not found'))
    }

    const reviews = product.reviews.filter(
        (rev) => rev._id.toString() != req.query.reviewId.toString()
    )

    let avg = 0
    reviews.forEach((rev) => {
        avg += rev.rating
    })
    const ratings = avg / reviews.length
    const numberOfReviews = reviews.length

    await Product.findByIdAndUpdate(req.query.productId, {
        reviews,
        ratings,
        numberOfReviews,
    })

    res.status(200).json({
        success: true,
        message: 'Review deleted successfully',
    })
})
