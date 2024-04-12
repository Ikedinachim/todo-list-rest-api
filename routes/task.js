const express = require('express');
const {body} = require('express-validator')
const isAuth  = require('../middlewares/is-auth')

const taskController = require('../controllers/task')

const router = express.Router();
// add isauth
router.post('/create-task', [
    body('title').notEmpty().withMessage('Title is required!'),
    body('description').notEmpty().withMessage('A Description is required!'),
    body('date').isDate().withMessage('Valid Date is required!'),
    body('isCompleted').isBoolean().withMessage('isCompleted must be Boolean value!'),
    


], taskController.createTask);
router.put('/update-task/:id', [
    body('title').notEmpty().withMessage('Title is required!'),
    body('description').notEmpty().withMessage('A Description is required!'),
    body('date').isDate().withMessage('Valid Date is required!'),
    body('isCompleted').isBoolean().withMessage('isCompleted must be Boolean value!'),
    


], isAuth, taskController.updateTask);

router.delete('/delete-task/:id', isAuth,   taskController.deleteTask)

router.get('/get-tasks', isAuth, taskController.getAllUserTasks)

router.get('/get-tasks/:id', isAuth, taskController.getOneTask)

router.post('/mark-complete/:id', taskController.markTaskAndUnmarkTask)

router.get('/quote-of-day', isAuth, taskController.quoteOfDay)
router.get('/goal-suggestion/:id', isAuth, taskController.howToCompleteGoals)





module.exports = router;