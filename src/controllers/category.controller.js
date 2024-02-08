const createHttpError = require('http-errors');

const { companyUserTypes, nonCompanyUserTypes } = require('../constants');
const categoryRepository = require('../repositories/category.repository');
const userRepository = require('../repositories/user.repository');
const { errorMessages, successMessages } = require('../constants/textVariables');

module.exports = {
  getList: async (req, res, next) => {
    const categories = await categoryRepository.findAll();
    res.json({ statusCode: 200, data: categories });
  },
  createCategory: async (req, res, next) => {
    const inputBody = req.body;

    let authUser = req.auth.user;
    authUser = await userRepository.findUserByQuery({ _id: authUser });

    if ([...companyUserTypes, ...nonCompanyUserTypes].includes(authUser?.userType)) {
      return next(createHttpError(403, errorMessages.USER_NOT_AUTHORIZED));
    }

    const category = await categoryRepository.saveCategory(inputBody);
    res.json({ statusCode: 200, data: category });
  },
  updateCategory: async (req, res, next) => {
    const categoryId = req.params.categoryId;
    const inputBody = req.body;

    let authUser = req.auth.user;
    authUser = await userRepository.findUserByQuery({ _id: authUser });

    if ([...companyUserTypes, ...nonCompanyUserTypes].includes(authUser?.userType)) {
      return next(createHttpError(403, errorMessages.USER_NOT_AUTHORIZED));
    }

    let category = await categoryRepository.findCategoryById(categoryId);

    if (!category) {
      return next(createHttpError(403, errorMessages.CAT_DOES_NOT_EXIST));
    }

    category = await categoryRepository.updateCategoryById(categoryId, inputBody);

    res.json({ statusCode: 200, data: category });
  },
  deleteCategory: async (req, res, next) => {
    const categoryId = req.params.categoryId;

    let authUser = req.auth.user;
    authUser = await userRepository.findUserByQuery({ _id: authUser });

    if ([...companyUserTypes, ...nonCompanyUserTypes].includes(authUser?.userType)) {
      return next(createHttpError(403, errorMessages.USER_NOT_AUTHORIZED));
    }

    let category = await categoryRepository.findCategoryById(categoryId);

    if (!category) {
      return next(createHttpError(403, errorMessages.CAT_DOES_NOT_EXIST));
    }

    category = await categoryRepository.deleteCategoryById(categoryId);

    res.json({ statusCode: 200, message: successMessages.CAT_DELETED });
  }
}