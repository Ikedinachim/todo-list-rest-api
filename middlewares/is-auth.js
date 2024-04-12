const { header } = require('express-validator');
const jwt = require('jsonwebtoken');

const isAuth = (req, res, next) => {
 let token;
 let decodedToken;
 if (req.headers?.authorization?.startsWith('Bearer')) {
    token = req.get('Authorization').split(' ')[1];
    if (!token) {
        const error = new Error('Not Authenticated')
        error.statusCode = 401;
        throw error
    }
    try {
         decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        
    } catch (error) {
        error.statusCode = 401;
        throw error
    }
    if (!decodedToken) {
        const error = new Error('Not Authenticated')
        error.statusCode = 401;
        throw error
    }
    req.userId = decodedToken.userId;
    console.log(req.userId)
    
    next()
 }else{
    const error = new Error('Not Authenticated')
    error.statusCode = 401;
    throw error
 }
}

module.exports = isAuth;