const { User, Admin } = require('../models/Users')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
    try {
        
        const { name, email, password, adminCode } = req.body;

        if(!name || !email || !password || !adminCode) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required!'
            })
        }

        if(password.length < 8) {
            return res.status(400).json({
                success: false,
                message: 'Password must be atleast 8 characters long.'
            })
        }

        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email already exists!'
            })
        }

        // check admin
        const admin = await Admin.findOne({ adminCode })
        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Invalid Admin Code!"
            })
        }


        //Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //new user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,

            linkedToAdmin: admin._id,
            approvalStatus: 'pending'
        })

        res.status(201).json({
            success: true,
            message:'User registered successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,

                admin: admin.adminUsername,
                status: user.approvalStatus
            }
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

const loginUser = async (req, res) => {
    try {

        const { email, password } = req.body;

        const user = await User.findOne({ email })

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid Email"
            })
        }

        if(!password) {
            return res.status(404).json({
                success: false,
                message: "Password not found!"
            })
        }

        //compare password
        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid Password"
            })
        }

        //generate jwt token
        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN
            }
        )

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        })
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const registerAdmin = async (req, res) => {
    try {
        const { adminName, adminEmail, password, adminUsername } = req.body;

        if(!adminName || !adminEmail || !password || !adminUsername) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required!'
            })
        }
        if(password.length < 8) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 8 characters long.'
            });
        }

        const existingAdmin = await Admin.findOne({ adminEmail })
        if(existingAdmin) {
            return res.status(400).json({
                success: false,
                message: {
                    email: adminEmail,
                    message: `Already registered!`
                }
            })
        }

        // Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)

        // Generate Admin Code
        const adminCode = await generateAdminCode();

        // Create Admin
        const admin = await Admin.create({
            adminName,
            adminEmail,
            password: hashedPassword,
            adminUsername,
            adminCode,
            role: 'admin'
        })

        res.status(201).json({
            success: true,
            message: "Admin registered successfully!",
            admin: {
                id: admin._id,
                adminName: admin.adminName,
                adminEmail: admin.adminEmail,
                adminUsername: admin.adminUsername,
                adminCode: admin.adminCode,
                role: admin.role
            }
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }

}

// Generate Admin Code
async function generateAdminCode() {
    let code;
    let exists = true;
    let attempts = 0;

    while (exists && attempts < 5) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        
        let randomPart = '';
    
        for (let i = 0; i < 18; i++) {
            randomPart += chars.charAt(
                Math.floor(Math.random() * chars.length)
            )
        }
    
        code = `${randomPart.slice(0,3)}-` + `${randomPart.slice(3,7)}-` + `${randomPart.slice(7,12)}-` + `${randomPart.slice(12,18)}`
        
        exists = await Admin.findOne({ adminCode: code });
        attempts++;
    }

    if (attempts === 5) {
        throw new Error('Failed to generate unique admin code! Try Again..')
    }

    return code;
}


module.exports = {
    registerUser,
    loginUser,
    registerAdmin
};