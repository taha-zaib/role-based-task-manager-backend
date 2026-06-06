const express = require('express')
const router = express.Router()

const verifyToken = require('../middleware/authMiddleware')
const authorizeRoles = require('../middleware/roleMiddleware')

const { getAllUsers, promoteUser, deleteAnyUser, deleteAnyUserTasks, getUserData } = require('../controllers/adminController')

router.get('/users', verifyToken, authorizeRoles('admin'), getAllUsers)
router.get('/users/:id', verifyToken, authorizeRoles('admin'), getUserData)

router.patch('/users/:id/promote', verifyToken, authorizeRoles('admin'), promoteUser)

router.delete('/users/:id', verifyToken, authorizeRoles('admin'), deleteAnyUser)
router.delete('/tasks/:id', verifyToken, authorizeRoles('admin'), deleteAnyUserTasks)

module.exports = router