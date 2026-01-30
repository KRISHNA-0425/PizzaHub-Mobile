import Category from "../../models/category.model"

export const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find()
        if (!categories) {
            return res.status(400).json({ message: "No categories found" })
        }
        return res.status(200).json(categories)
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" })
    }
}