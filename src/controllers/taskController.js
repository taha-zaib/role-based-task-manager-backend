const Task = require('../models/Task')

const createTask = async (req, res) => {

    try {

        const { title } = req.body

        const task = await Task.create({
            title,
            createdBy: req.user.id
        })

        res.status(201).json(task)
        
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }

}

const getMyTasks = async (req, res) => {

    try {
        const tasks = await Task.find({
            createdBy: req.user.id
        })

        res.status(200).json(tasks)
    } catch (error) {
        res.status(500).json({
            mesage: error.message
        })
    }

}

module.exports = {
    createTask,
    getMyTasks
}