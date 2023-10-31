const companyModel = require('../models/company.model');

module.exports = {
  saveCompany: async (company) => {
    // active by default
    company.isActive = true;
    company = new companyModel(company);
    return await company.save();
  },
  findCompanyByQuery: async (query) => {
    const output = await companyModel.findOne(query).exec();
    return output;
  },
  findCompanyById: async (companyId) => {
    const output = await companyModel.findById(companyId);
    return output;
  },
  findAllCompanies: async (query, pagination) => {
    query = { ...query, isDeleted: false, isActive: true };
    let output = null;
    if (pagination) {
      const { pageNo, pageSize, sortBy, sortOrder } = pagination;
      output = await companyModel.find(query)
        .limit(pageSize)
        .skip((pageNo - 1) * pageSize)
        .sort({ [sortBy]: sortOrder });
    } else {
      output = await companyModel.find(query);
    }
    return output;
  },
}
