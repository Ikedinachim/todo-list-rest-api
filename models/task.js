const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var taskModel = new mongoose.Schema({
    title:{
        type:String,
        required:true,
      
    },
    description:{
        type:String,
        required:true,
        
    },
   
    date:{
        type:Date,
        required:true,
    },

    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isCompleted: {
        type: Boolean,
        default: false
    }
  
}, {timestamps: true});

//Export the model
module.exports = mongoose.model('Task', taskModel);