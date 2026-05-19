const express = require('express')
const router = express.Router()

const verifyToken = require('../middleware/authMiddleware')

const { createTask, getMyTasks } = require('../controllers/taskController')

router.post('/', verifyToken, createTask)
router.get('/', verifyToken, getMyTasks)

module.exports = router