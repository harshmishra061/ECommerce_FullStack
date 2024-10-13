const ErrorHandler = require('../utils/errorhandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const User = require('../models/userModal');
const { sendToken } = require('../utils/jwtToken');

// register a user
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
    const { name, email, password } = req.body;
    const user = await User.create({
        name, password, email, avtar: {
            public_id: "sample public id",
            url: "sample public url"
        }
    });
    sendToken(user, 201, res);

})

// login user
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) return next(new ErrorHandler('Please Enter Email and Password', 400));
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return next(new ErrorHandler('Email or Password is Incorrect', 401));
    }

    isPasswordMatched = user.comparePassword(password);

    if (!isPasswordMatched) {
        return next(new ErrorHandler('Email or Password is Incorrect', 401));
    }

    sendToken(user, 200, res)
})

// logout user
exports.logoutUser = catchAsyncErrors(async (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })
    res.status(200).json({
        success: true,
        message: 'Logged out Successfully'
    })
})