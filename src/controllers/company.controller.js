const { errorMessages } = require('../constants/textVariables');
const createError = require('../helpers/createError');
const companyRepository = require('../repositories/company.repository');
const memberRepository = require('../repositories/member.repository');

module.exports = {
  createCompany: async (req, res, next) => {
    const inputBody = req.body;

    // assign user
    inputBody.user = req.auth.user;
    
    let company = null;

    // check if company exists
    company = await companyRepository.findCompanyByRegistrationNum(inputBody.registrationId);

    if (company) {
      return next(createError(400, errorMessages.COMPANY_EXIST_WITH_REG_NUM));
    }

    // save new company
    company = await companyRepository.saveCompany(inputBody);
    let companyMembers = null;

    if (company.id && inputBody.members?.length > 0) {
      companyMembers = await memberRepository.saveManyCompanyMember(company.id, inputBody.members);
    }

    if (companyMembers) {
      company = company.toJSON();
      company.members = companyMembers;
    }

    return res.json({ statusCode: 200, data: company });
  },
}