const { env } = require('process')
const Task = require('../models/task')
const User = require('../models/user')
const {OpenAI} = require('openai')
exports.createTask = async (req, res, next) => {
    try{
        // req.body.user = req?.userId
        console.log(req.body)
        const task = await Task.create(req.body)
        res.status(200).json({
            message: 'Task Created Successfully',
            task: task
        })
    }catch (error){
        next(error)
    }
}

exports.updateTask = async(req, res, next) => {
    id = req.params.id;
    try{
        const updatedTask = await Task.findByIdAndUpdate(id, req.body, {new: true})
        res.status(200).json({
            message: 'Task Updated Successfully',
            task: updatedTask
        })

    }catch(error){
        next(error)
    }
}

exports.getAllUserTasks = async(req, res, next) => {
    try{
        user_id = req?.userId;
        const tasks = await Task.find({user : user_id});
        const user = await User.findOne({_id: user_id})
        res.status(200).json({
            message: 'Tasks Fetched Successfully', 
            tasks: tasks,
            user: user
        })

    }catch(error){
        next(error)
    }

}

exports.getOneTask = async (req, res,next) => {
    const taskId = req.params.id;
    try{
        const task = await Task.findById(taskId);
        if (!task) {
            const error = new Error()
            error.statusCode = 401
            error.message  = 'Task not found!'
            throw error;
        }
        res.status(200).json({
            message: 'Task data fetched Successfully',
            task: task
        })
    }catch(error){
        next(error)
    }
}

exports.deleteTask = async(req, res, next) => {
    try{
        const taskId = req.params.id;
        const task = await Task.findByIdAndDelete(taskId)
        res.status(200).json({
            message: 'Task Deleted Successfully',
            task: task
        })
    }catch(error){
        next(error)
    }
}

exports.markTaskAndUnmarkTask = async(req, res, next) => {
    try{
        const taskId = req.params.id;
        const task = await Task.findById(taskId)
        task.isCompleted = !task.isCompleted
        await task.save()
        res.status(200).json({
            message: 'Task Updated Successfully',
            task: task
        })
    }catch(error){
        next(error)
    }
}

exports.quoteOfDay = async(req, res, next) => {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY})
    try{
        const completion = await openai.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant designed to output JSON.",
              },
              { role: "user", content: "Give me a motivational text to perform my goals for today" },
            ],
            model: "gpt-3.5-turbo-0125",
            response_format: { type: "json_object" },
          });
          console.log(completion.choices[0].message.content);
          res.status(200).json({
              message: completion.choices[0].message.content,
            })
        }catch(error){
            next(error)
        }

    }
    
    exports.howToCompleteGoals = async(req, res, next) => {
   
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY})
        try{
            const id = req.params.id;
            const pendingTask = await Task.findById(id)
            console.log(pendingTask);
            const completion = await openai.chat.completions.create({
                messages: [
                  {
                    role: "system",
                    content: "You are a helpful assistant designed to output JSON.",
                  },
                  { role: "user", content: `Give me a a list of plans to accomplish these goal: ${pendingTask}` },
                ],
                model: "gpt-3.5-turbo-0125",
                response_format: { type: "json_object" },
              });
              console.log(completion.choices[0].message.content);
              res.status(200).json({
                message: completion.choices[0].message.content,
              })
            }catch(error){
                next(error)
            }
    
        }