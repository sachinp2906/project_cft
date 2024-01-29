const connection = require('../database/connection')
module.exports.addCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const checkCategory = await connection.query('SELECT * FROM categories WHERE name = $1', [name]);
        const existingCategory = checkCategory.rows[0];

        if (existingCategory) {
            return res.status(400).json({
                message: 'Category Already Exist'
            })
        }

        const newCategoryCreate = await connection.query('INSERT INTO categories(name) VALUES($1) RETURNING *', [name]);
        const newCategory = newCategoryCreate.rows[0];
        return res.status(201).json({
            message: 'Category Created',
            data: newCategory
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}

module.exports.getCategories = async (req, res) => {
    try {
        const getCategories = await connection.query('SELECT * FROM categories')
        return res.status(201).json({
            message: 'Category Featched',
            data: getCategories.rows
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}

module.exports.updateCategory = async (req, res) => {
    try {
        const { categoryId } = req.params
        const { name } = req.body;
        const checkCategory = await connection.query('SELECT * FROM categories WHERE id = $1', [categoryId])
        const category = checkCategory.rows[0];
        if (!category) {
            return res.status(404).json({
                message: 'category not found'
            })
        }
        await connection.query('UPDATE categories SET name = $1 WHERE id = $2', [name, categoryId])
        return res.status(200).json({
            message: 'Category Updated'
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}

module.exports.deleteCategory = async (req, res) => {
    try {
        const { categoryId } = req.params
        const categoryResult = await connection.query('SELECT * FROM categories WHERE id=$1', [categoryId]);
        const category = categoryResult.rows[0];

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        const servicesInCategoryResult = await connection.query('SELECT * FROM services WHERE category_id = $1', [categoryId]);
        const servicesInCategory = servicesInCategoryResult.rows;
        if (servicesInCategory.length > 0) {
            return res.status(400).json({ message: 'Category has associated services. Cannot remove.' });
        }
        await connection.query('DELETE FROM categories WHERE id = $1', [categoryId]);
        return res.status(200).json({
            message : 'Category Deleted Successfully'
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}