import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    image: {
        type: String,
        required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,  // CHANGE: mongoose.Types → mongoose.Schema.Types
        ref: "Category"
    },
    price: {
        type: Number,
        required: true
    },
    discountedPrice: {
        type: Number
    },
    description: {
        type: String,
        // required:true
    }
})


const Product = mongoose.model("Product", productSchema)

export default Product