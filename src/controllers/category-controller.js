const Category = require("../models/category-model");

const categoryController = {
  getCategory: async (req, res, next) => {
    try {
      const category = await Category.find();
      res.json(category);
    } catch (error) {
      next(error);
    }
  },
  createCategory: async (req, res, next) => {
    try {
      const { name } = req.body;
      const category = await Category.findOne({ name });
      if (category)
        return res.status(400).json({
          message: "This category already exists.",
        });
      const newCategory = new Category({ name });

      await newCategory.save();
      res.json({ message: "Created a category" });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = categoryController;
