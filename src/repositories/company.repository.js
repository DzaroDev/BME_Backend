const { companyStatus } = require('../constants');
const companyModel = require('../models/company.model');

module.exports = {
  getModelName: () => {
    return companyModel.modelName;
  },
  saveCompany: async (company) => {
    // active by default
    company.isActive = true;
    company.status = companyStatus.CREATED;
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
        .populate({
          path: 'user',
          select: 'id firstName lastName'
        })
        .limit(pageSize)
        .skip((pageNo - 1) * pageSize)
        .sort({ [sortBy]: sortOrder });
    } else {
      output = await companyModel.find(query);
    }
    return output;
  },
  findAllCompaniesWithMinimalFields: async (query, pagination) => {
    query = { ...query, isDeleted: false, isActive: true, status: companyStatus.APPROVED };
    let output = null;
    if (pagination) {
      const { pageNo, pageSize, sortBy, sortOrder } = pagination;
      output = await companyModel.find(query)
        .select('id name description logoImage')
        .populate({
          path: 'user',
          select: 'id firstName lastName'
        })
        .limit(pageSize)
        .skip((pageNo - 1) * pageSize)
        .sort({ [sortBy]: sortOrder });
    } else {
      output = await companyModel.find(query);
    }
    return output;
  },
  updateCompany: async (companyId, updateQuery) => {
    const output = await companyModel.findByIdAndUpdate(companyId, updateQuery, { new: true });
    return output;
  },
}
