const express = require('express');
const {body} = require('express-validator')

const authController = require('../controllers/auth')

const router = express.Router();

router.post('/register', [
    body('userName').notEmpty().withMessage('User name is required!'),
    body('email').isEmail(),
    body('password').isLength({min: 8}).withMessage('Password should be at least 8 characters long')
    .isAlphanumeric().withMessage('Password must contain both letters and numbers'),
    body('confirmPassword').isLength({min:8}).withMessage('Password should be at least 8 characters long').custom((value,{req, loc, path}) => {
        if (value !== req.body.confirmPassword) {
            // trow error if passwords do not match
            throw new Error("Passwords don't match");
        } else {
            return value;
        }
    })


], authController.registerUser);

router.post('/login', authController.loginUser)




module.exports = router;

