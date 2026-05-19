const express = require('express');
const router = express.Router();

const verifyToken = require('../middleware/authMiddleware')
const authorizeRoles = require('../middleware/roleMiddleware')

router.get('/profile', verifyToken, (req, res) => {
    res.status(200).json({
        message: "Protected route accessed",
        user: req.user
    })
})

router.get('/admin', verifyToken, authorizeRoles('admin'), (req, res) => {
    res.json({
        message: 'Welcome admin',
        user: req.user
    })
})

module.exports = router