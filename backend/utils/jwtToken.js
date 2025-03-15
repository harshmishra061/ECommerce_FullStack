exports.sendToken = (user, statusCode, res) => {
    const token = user.getJWTToken()

    // option for cookie
    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        // httpOnly: true
        secure: true,
    }
    // sending response
    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        message: 'Logged in Successfully',
        token,
    })
}
