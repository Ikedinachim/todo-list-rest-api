exports.errorhandler = (error, req, res, next) => {
    const status = error.statusCode || 500;
    const message = error.message || 'An Internal Error Occured'
    res.status(status).json({
        message: message,
        error: error,
    })
}

exports.notFound = (req,res, next) => {
    res.status(404).json({
        message: 'Sorry, this url does not exist'
    })
    next();
}