import Product from "../../models/product.model"

export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find()
        if (!products) {
            return res.status(400).json({ message: "No products found" })
        }

        return res.status(200).json(products)

    } catch (error) {
        return res.status(500).json({ message: "Internal server error" })
    }
}

export const getProductsByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params
        const products = await Product.find({ category: categoryId })
        if (!products) {
            return res.status(400).json({ message: "No products found" })
        }

        return res.status(200).json(products)

    } catch (error) {
        return res.status(500).json({ message: "Internal server error" })
    }
}
