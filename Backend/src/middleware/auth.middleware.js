// middleware/auth.middleware.js
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

export const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]  // Get token from "Bearer <token>"

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No token provided'
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded  // Attach userId and role to request
        next()

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        })
    }
}