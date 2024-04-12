const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {validationResult} = require('express-validator')
const User = require('../models/user')
const task = require('../models/task')

exports.registerUser = async (req, res, next) => {
    const results = validationResult(req);
    try {
        if (results.isEmpty()) {  // no errors 
        const findEmail = await User.findOne({email: req.body.email});
        if (findEmail) {
            // user with this email exists
            res.status(401).json({
                success: false,
                message: 'User with this email already exits!'
            })
        }else {
          const hash =  bcrypt.hashSync(req.body.password, 10)

         const user = await User.create({
                userName: req.body.userName,
                email: req.body.email,
                password: hash
            });
         await user.save()
            res.status(200).json({
                success: true,
                message: 'User created Successfully',
                user
            })
        }

        
        
    }else{
    res.status(401).json({
        success: false,
        errors: results.array()
    })}
} catch (error) {
      next(error)
}
  
}

exports.loginUser = async (req,res,next) => {
    const email = req.body.email;
    const password = req.body.password;
    let loadedUser;
    try {
       const user = await User.findOne({email: email});
       if (!user) {
        // email does not exist
        const error = new Error;
        error.message = 'A User with this Email does not exist!';
        error.statusCode = 401;
        throw error
       }
       loadedUser = user;
       // email exist, check password
      const isEqual = bcrypt.compareSync(password, loadedUser.password);
      if (!isEqual) {
        // password is incorrect
        const error = new Error;
        error.message = 'This password is incorrect!';
        error.statusCode = 401;
        throw error
        
      }
      // password is correct, generate a token
     const token =  jwt.sign({
        userId: loadedUser._id,
      },process.env.JWT_SECRET_KEY, 
      {expiresIn: '6h'})
      const completedTask = await task.find({isCompleted: true});
      const pendingTask = await task.find({isCompleted: false});
      res.status(200).json({
        completedCount: completedTask.length,
        pendingCount: pendingTask.length,
        success: true,
        user: loadedUser,
        message: 'Login Successful',
        token: token,
        expiresIn: '1h'
      })
        

    } catch (error) {
        if(!error.statusCode){
            error.statusCode = 500
        }
        next(error)
        
    }

}