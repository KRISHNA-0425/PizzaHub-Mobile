import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
        required: true
    },
    deliveryPartner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DeliveryPartner",
        required: true
    },
    branch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Branch",
        required: true
    },
    items: [
        {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }
    ],
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "delivered", "rejected", "arriving",],
        default: "pending"
    },
    deliverLocation: {
        longitude: { type: Number },
        latitude: { type: Number }
    },
    pickupLocation: {
        longitude: { type: Number },
        latitude: { type: Number }
    },
    deliveryPartnerLocation: {
        longitude: { type: Number },
        latitude: { type: Number }
    }

}, { timestamps: true })

const Order = mongoose.model("Order", orderSchema);

export default Order
