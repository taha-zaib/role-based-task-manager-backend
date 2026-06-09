const express = require('express');
const router = express.Router();

const { registerUser, loginUser, registerAdmin } = require('../controllers/authController')

// User Register
router.post('/register', registerUser)
router.post('/login', loginUser)

// Admin Register
router.post('/admin/register', registerAdmin)

module.exports = router;