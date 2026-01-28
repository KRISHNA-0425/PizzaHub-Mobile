import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('Database connected successfully')
    } catch (error) {
        console.error('Unable to connect to the database:', error.message)
        process.exit(1) // Exit process with failure
    }
}

// Handle connection events
mongoose.connection.on('disconnected', () => {
    console.log('Database disconnected')
})

mongoose.connection.on('error', (err) => {
    console.error('Database connection error:', err)
})

export default connectDb