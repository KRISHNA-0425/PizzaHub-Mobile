import mongoose from 'mongoose'

const branchSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    location: {
        longitude: { type: Number },
        latitude: { type: Number },
    },
    address: {
        type: String
    },
    deliveryPartner: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "DeliveryPartner"
        }
    ]
}, { timestamps: true })


const Branch = mongoose.model("Branch", branchSchema)

export default Branch