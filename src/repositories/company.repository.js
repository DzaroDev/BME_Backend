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
  findCompanyByRegistrationNum: async (registrationId) => {
    const company = await companyModel.findOne({ registrationId });
    return company;
  },
  findCompanyById: async (companyId) => {
    const output = await companyModel.findById(companyId);
    return output;
  },
}
