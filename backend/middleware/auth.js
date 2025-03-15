const jwt = require('jsonwebtoken')

const User = require('../models/userModal')
const ErrorHandler = require('../utils/errorhandler')

const catchAsyncErrors = require('./catchAsyncErrors')

exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
    const { token } = req.cookies
    if (!token) {
        return next(
            new ErrorHandler('Please Login to Access This Resource', 401)
        )
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET)

    const user = await User.findById(decodedData.id)
    if (!user) {
        return next(
            new ErrorHandler('Please Login to Access This Resource', 401)
        )
    }

    req.user = user

    next()
})

exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new ErrorHandler(
                    `Role ${req.user.role} is not allowed to access this resource`
                ),
                403
            )
        }
        next()
    }
}
