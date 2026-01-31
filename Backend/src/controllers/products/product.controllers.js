import Product from "../../models/product.model.js"  

export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('category', 'name image')  // ADDED: Populate category details

        if (products.length === 0) {  // FIXED: Check array length
            return res.status(404).json({ 
                success: false,
                message: "No products found" 
            })
        }

        return res.status(200).json({
            success: true,
            count: products.length,  // ADDED: Useful for mobile app
            products
        })

    } catch (error) {
        console.error('Get all products error:', error)
        return res.status(500).json({ 
            success: false,
            message: "Internal server error" 
        })
    }
}

export const getProductsByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params

        const products = await Product.find({ category: categoryId })
            .populate('category', 'name image')  

        if (products.length === 0) {  
            return res.status(404).json({ 
                success: false,
                message: "No products found in this category" 
            })
        }

        return res.status(200).json({
            success: true,
            count: products.length,
            products
        })

    } catch (error) {
        console.error('Get products by category error:', error)
        return res.status(500).json({ 
            success: false,
            message: "Internal server error" 
        })
    }
}