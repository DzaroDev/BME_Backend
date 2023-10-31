const { companyUserTypes, nonCompanyUserTypes } = require('../constants');
const { errorMessages } = require('../constants/textVariables');
const createError = require('../helpers/createError');
const companyRepository = require('../repositories/company.repository');
const memberRepository = require('../repositories/member.repository');
const userRepository = require('../repositories/user.repository');

module.exports = {
  createCompany: async (req, res, next) => {
    const inputBody = req.body;
    let authUser = req.auth.user;

    authUser = await userRepository.findUserByQuery({ _id: authUser });

    if (!companyUserTypes.includes(authUser.userType)) {
      return next(createError(400, errorMessages.USER_NOT_ALLOWED));
    }
    
    let company = null;

    // check if company exists with registration Id
    company = await companyRepository.findCompanyByQuery({ registrationId: inputBody.registrationId });

    if (company) {
      return next(createError(400, errorMessages.COMPANY_EXIST_WITH_REG_NUM));
    }

    // check if company exists with mobile/email
    company = await companyRepository.findCompanyByQuery({ $or: [ { mobile: inputBody.mobile }, { email: inputBody.email } ] });

    if (company) {
      return next(createError(400, errorMessages.COMPANY_EXIST_WITH_MOBILE_EMAIL));
    }

    // assign user
    inputBody.user = authUser.id;

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
  listAllCompanies: async (req, res, next) => {
    const pagination = {
      pageNo: req.query.pageNo,
      pageSize: req.query.pageSize,
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder,
    }
    const companies = await companyRepository.findAllCompanies({ user: req.auth.user }, pagination);
    return res.json({ statusCode: 200, data: companies });
  },
  createStudentCompany: async (req, res, next) => {
    const inputBody = req.body;
    let authUser = req.auth.user;

    authUser = await userRepository.findUserByQuery({ _id: authUser });

    if (!nonCompanyUserTypes.includes(authUser.userType)) {
      return next(createError(400, errorMessages.USER_NOT_ALLOWED));
    }
    
    let company = null;

    // check if company exists with registration Id
    company = await companyRepository.findCompanyByQuery({ registrationId: inputBody.registrationId });

    if (company) {
      return next(createError(400, errorMessages.COMPANY_EXIST_WITH_REG_NUM));
    }

    // check if company exists with mobile/email
    company = await companyRepository.findCompanyByQuery({ $or: [ { mobile: inputBody.mobile }, { email: inputBody.email } ] });

    if (company) {
      return next(createError(400, errorMessages.COMPANY_EXIST_WITH_MOBILE_EMAIL));
    }

    // assign user
    inputBody.user = authUser.id;

    // save new company
    company = await companyRepository.saveCompany(inputBody);
    let companyMembers = null;

    // save company members
    if (company.id && inputBody.members?.length > 0) {
      companyMembers = await memberRepository.saveManyCompanyMember(company.id, inputBody.members);
    }

    // save updated user
    authUser = await userRepository.findUserAndUpdate({
      id: authUser.id,
      userType: inputBody.userType,
      category: inputBody.category,
    });

    if (companyMembers) {
      company = company.toJSON();
      company.members = companyMembers;
    }

    return res.json({ statusCode: 200, data: { company, user: authUser } });
  },
  updateCompany: async (req, res, next) => {
    const inputBody = req.body;
    const companyId = req.params.companyId;
    let company = null;

    // check if company Id exist
    company = await companyRepository.findCompanyByQuery({ _id: companyId });

    if (!company) {
      return next(createError(400, errorMessages.COMPANY_NOT_EXIST_WITH_ID));
    }

    company = await companyRepository.updateCompany(companyId, inputBody);

    return res.json({ statusCode: 200, data: company });
  },
  getCompanyById: async (req, res, next) => {
    const companyId = req.params.companyId;
    let company = null;

    // check if company Id exist
    company = await companyRepository.findCompanyByQuery({ _id: companyId });

    if (!company) {
      return next(createError(400, errorMessages.COMPANY_NOT_EXIST_WITH_ID));
    }

    return res.json({ statusCode: 200, data: company });
  },
}