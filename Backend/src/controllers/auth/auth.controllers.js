import jwt from 'jsonwebtoken'
import { Customer, DeliveryPartner } from "../../models/index.model.js"
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
dotenv.config()

// generating the token 
const generateToken = (user) => {
    const accessToken = jwt.sign({
        userId: user._id,
        role: user.role
    },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    )
    const refreshToken = jwt.sign({
        userId: user._id,
        role: user.role
    },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
    )
    return { accessToken, refreshToken }
}

export const registerCustomer = async (req, res) => {
    try {
        const { email, password, phoneNumber, name } = req.body

        if (!email || !password || !phoneNumber || !name) {
            return res.status(400).json({ message: 'All fields are required' })
        }

        // Check if user already exists
        let existingUser = await Customer.findOne({
            $or: [{ email }, { phoneNumber }]
        })

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" })
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Create customer
        const customer = await Customer.create({
            email,
            password: hashedPassword,
            phoneNumber,
            name,
            role: 'customer'
        })

        // Generate tokens
        const token = generateToken(customer)

        // Don't send password back
        const customerResponse = {
            _id: customer._id,
            name: customer.name,
            email: customer.email,
            phoneNumber: customer.phoneNumber,
            role: customer.role
        }

        return res.status(201).json({
            customer: customerResponse,
            ...token
        })

    } catch (error) {
        console.error('Register error:', error)
        return res.status(500).json({ message: 'Server error' })
    }
}

export const loginCustomer = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' })
        }

        // Find customer
        let customer = await Customer.findOne({ email })

        if (!customer) {
            return res.status(400).json({ message: "Invalid credentials" })
        }

        // Compare password
        const isPasswordValid = await bcrypt.compare(password, customer.password)

        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid credentials" })
        }

        // Generate tokens
        const token = generateToken(customer)

        // Don't send password back
        const customerResponse = {
            _id: customer._id,
            name: customer.name,
            email: customer.email,
            phoneNumber: customer.phoneNumber,
            role: customer.role
        }

        return res.status(200).json({
            customer: customerResponse,
            ...token
        })

    } catch (error) {
        console.error('Login error:', error)
        return res.status(500).json({ message: 'Server error' })
    }
}

// DELIVERY PARTNER CONTROLLERS

export const registerDeliveryPartner = async (req, res) => {
    try {
        const { email, password, phoneNumber, name, vehicleType, vehicleNumber } = req.body

        if (!email || !password || !phoneNumber || !name) {
            return res.status(400).json({ message: 'All fields are required' })
        }

        // Check if delivery partner already exists
        let existingUser = await DeliveryPartner.findOne({
            $or: [{ email }, { phoneNumber }]
        })

        if (existingUser) {
            return res.status(400).json({ message: "Delivery partner already exists" })
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Create delivery partner
        const deliveryPartner = await DeliveryPartner.create({
            email,
            password: hashedPassword,
            phoneNumber,
            name,
            role: 'deliveryPartner',
            vehicleType,
            vehicleNumber
        })

        // Generate tokens
        const token = generateToken(deliveryPartner)

        // Don't send password back
        const deliveryPartnerResponse = {
            _id: deliveryPartner._id,
            name: deliveryPartner.name,
            email: deliveryPartner.email,
            phoneNumber: deliveryPartner.phoneNumber,
            role: deliveryPartner.role
        }

        return res.status(201).json({
            deliveryPartner: deliveryPartnerResponse,
            ...token
        })

    } catch (error) {
        console.error('Register delivery partner error:', error)
        return res.status(500).json({ message: 'Server error' })
    }
}

export const loginDeliveryPartner = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' })
        }

        // Find delivery partner
        let deliveryPartner = await DeliveryPartner.findOne({ email })

        if (!deliveryPartner) {
            return res.status(400).json({ message: "Invalid credentials" })
        }

        // Compare password
        const isPasswordValid = await bcrypt.compare(password, deliveryPartner.password)

        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid credentials" })
        }

        // Generate tokens
        const token = generateToken(deliveryPartner)

        // Don't send password back
        const deliveryPartnerResponse = {
            _id: deliveryPartner._id,
            name: deliveryPartner.name,
            email: deliveryPartner.email,
            phoneNumber: deliveryPartner.phoneNumber,
            role: deliveryPartner.role
        }

        return res.status(200).json({
            deliveryPartner: deliveryPartnerResponse,
            ...token
        })

    } catch (error) {
        console.error('Login delivery partner error:', error)
        return res.status(500).json({ message: 'Server error' })
    }
}

// REFRESH TOKEN CONTROLLER (for both Customer and DeliveryPartner)

export const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body

        if (!refreshToken) {
            return res.status(400).json({ message: 'Refresh token is required' })
        }

        // Verify refresh token
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET)

        // Find user based on role
        let user
        if (decoded.role === 'customer') {
            user = await Customer.findById(decoded.userId)
        } else if (decoded.role === 'deliveryPartner') {
            user = await DeliveryPartner.findById(decoded.userId)
        } else {
            return res.status(400).json("unauthorized access")
        }

        if (!user) {
            return res.status(401).json({ message: 'Invalid refresh token' })
        }

        // Generate new tokens
        const tokens = generateToken(user)

        return res.status(200).json(tokens)

    } catch (error) {
        console.error('Refresh token error:', error)
        return res.status(401).json({ message: 'Invalid or expired refresh token' })
    }
}


// fetching details of the user

export const fetchData = async (req, res) => {
    try {
        const { userId, role } = req.user

        let user;

        if (role === "customer") {
            user = await Customer.findById(userId)
        } else if (role === "deliveryPartner") {
            user = await DeliveryPartner.findById(userId)
        }
        else {
            return res.status(400).json({ message: "unauthorized access" })
        }

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        return res.status(200).json(user)

    } catch (error) {
        return res.status(500).json({ message: 'internal server error in the fetching data controller ' })
    }
}

