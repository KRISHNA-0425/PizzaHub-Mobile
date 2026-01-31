import Category from "../../models/category.model.js"

export const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find()

        if (categories.length === 0) {  
            return res.status(404).json({ 
                success: false,
                message: "No categories found" 
            })
        }

        return res.status(200).json({
            success: true,
            count: categories.length,
            categories
        })

    } catch (error) {
        console.error('Get all categories error:', error)
        return res.status(500).json({ 
            success: false,
            message: "Internal server error" 
        })
    }
}