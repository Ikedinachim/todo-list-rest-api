const express = require('express')
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const bodyParser = require('body-parser');
const morgan = require('morgan')

const authRoutes = require('./routes/auth')
const taskRoutes = require('./routes/task')

const errorHandler = require('./middlewares/errorHandler');



const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.use(morgan("dev"))

app.use((req, res,next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'POST, DELETE, PUT, GET, PATCH');
    next();
})

app.use('/todo/user', authRoutes)
app.use('/todo/task', taskRoutes)

app.use(errorHandler.notFound)
app.use(errorHandler.errorhandler)

mongoose.connect('mongodb+srv://ikedinachimugochukwu:qnDQZvUQv4k9R7ni@cluster0.0keywn6.mongodb.net/').then((result) => {
    console.log('CONNECTED TO MONGODB')
    app.listen(process.env.PORT || 4000)
  
}).catch((err) => {
    console.log('COULD NOT CONNECT TO MONGODB')
    console.log(err);
})