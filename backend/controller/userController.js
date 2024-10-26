const ErrorHandler = require('../utils/errorhandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const User = require('../models/userModal');
const { sendToken } = require('../utils/jwtToken');
const { sendEmail } = require('../utils/sendEmail');
const crypto = require('crypto')

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

// forget password
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new ErrorHandler('User not found', 404))
    }

    // find the reset password token
    const resetToken = user.getResetPasswordToken();
    await user.save();

    const resetPasswordUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`;
    const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\n If you have not requested this email then, please ignoe it`;
    try {
        await sendEmail({ email: user.email, subject: 'Ecommerce Password Reset', message });

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`
        })

    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();
        return next(new ErrorHandler(error.message, 500));
    }
})



exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({ resetPasswordToken, resetPasswordExpire: { $gt: Date.now() } });
    if (!user) {
        return next(new ErrorHandler('Reset password token is invalid or has been expired', 400));
    }
    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler('Password and Confirm Password are mismatched'))
    }

    console.log(user);

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    sendToken(user, 200, res);
})