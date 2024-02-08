const categoryModel = require('../models/category.model');

module.exports = {
  findAll: async (query = {}) => {
    query.isDeleted = false;
    return await categoryModel.find(query);
  },
  saveCategory: async (category) => {
    category = new categoryModel(category);
    return await category.save();
  },
  findCategoryById: async (id) => {
    const output = await categoryModel.findOne({ _id: id, isDeleted: false });
    return output;
  },
  updateCategoryById: async (categoryId, category) => {
    category = await categoryModel.findByIdAndUpdate(categoryId, category, { new: true });
    return category;
  },
  deleteCategoryById: async (categoryId) => {
    const category = await categoryModel.findByIdAndUpdate(categoryId, { isDeleted: true }, { new: true });
    return category;
  },
}
