const Task = require("../models/Task")
const { User, Admin } = require("../models/Users")


const getAllUsers = async (req, res) => {
    try {
        
        const users = await User.find().select('-password')

        res.status(200).json(users)
        
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

const getUserData = async (req, res) => {
    try {
        
        const data = await User.findById(req.params.id).select('-password')
        
        res.status(200).json(data)
        
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

const getTasksByUserId = async (req, res) => {
    try {
        const userId = req.params.id;

        const tasks = await Task.find({ createdBy: userId })

        res.status(200).json({
            success: true,
            tasks
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

const promoteUser = async (req, res) => {
    try {
        
        const user = await User.findById(req.params.id)

        if(!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if(user.role === 'admin') {
            return res.status(400).json({
                message: "Already admin!"
            })
        }

        user.role = 'admin'
        await user.save()

        await res.status(200).json({
            message: 'Role promoted successfully!'
        })

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

const deleteAnyUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if(!user) {
            return res.status(404).json({
                success: false,
                message: "User not found!"
            })
        }

        await user.deleteOne()

        res.status(200).json({
            success: true,
            message: `${user.email} deleted Successfully!`
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const deleteAnyUserTasks = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)

        if(!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found!"
            })
        }

        await task.deleteOne()

        res.status(200).json({
            success: true,
            message: `Title: ${task.title} \n Task deleted Successfully!`
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = {
    getAllUsers,
    getUserData,
    getTasksByUserId,
    promoteUser,
    deleteAnyUser,
    deleteAnyUserTasks
}