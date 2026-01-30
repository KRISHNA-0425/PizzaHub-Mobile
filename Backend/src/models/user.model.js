import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,  // ADD: Normalize emails
        trim: true        // ADD: Remove whitespace
    },
    password: {
        type: String,
        required: true
        // REMOVE: trim - don't trim passwords
    },
    phoneNumber: {
        type: String,     // CHANGE: Number → String (for +91, +1, etc.)
        required: true,
        unique: true,
        trim: true        // ADD: Remove whitespace
    },
    role: {
        type: String,
        enum: ["admin", "user", "deliveryPartner"],
        required: true
    },
    isActivated: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

// customer Schema
const customerSchema = new mongoose.Schema({
    ...userSchema.obj,
    role: {
        type: String,
        enum: ["customer"],
        default: "customer"
    },
    liveLocation: {
        longitude: { type: Number },
        latitude: { type: Number }
    },
    address: { type: String },
    branch: {
        type: mongoose.Schema.Types.ObjectId,  // CHANGE: mongoose.Types → mongoose.Schema.Types
        ref: "Branch"
    }
}, { timestamps: true })  // ADD: timestamps for customer too

// delivery partner
const deliveryPartnerSchema = new mongoose.Schema({
    ...userSchema.obj,
    role: {
        type: String,
        enum: ["deliveryPartner"],
        default: "deliveryPartner"
    },
    branch: {
        type: mongoose.Schema.Types.ObjectId,  // CHANGE: mongoose.Types → mongoose.Schema.Types
        ref: "Branch"
    },
    address: {
        type: String
    },
    liveLocation: {
        longitude: { type: Number },  // CHANGE: String → Number for coordinates
        latitude: { type: Number },   // CHANGE: String → Number for coordinates
    }
}, { timestamps: true })  // ADD: timestamps

// admin Schema
const adminSchema = new mongoose.Schema({
    ...userSchema.obj,
    role: {
        type: String,
        enum: ["admin"],
        default: "admin"
    }
}, { timestamps: true })  // ADD: timestamps


const Customer = mongoose.model("Customer", customerSchema)
const DeliveryPartner = mongoose.model("DeliveryPartner", deliveryPartnerSchema)
const Admin = mongoose.model("Admin", adminSchema)
const User = mongoose.model("User", userSchema)

export { Customer, DeliveryPartner, Admin, User }