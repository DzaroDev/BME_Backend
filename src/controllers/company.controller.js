const path = require('path');

const { companyUserTypes, nonCompanyUserTypes, adminUserTypes, userTypes, companyStatus } = require('../constants');
const { errorMessages, successMessages } = require('../constants/textVariables');
const createError = require('../helpers/createError');
const getFileExtension = require('../helpers/getFileExtension');
const validateObjectId = require('../helpers/validateObjectId');
const companyRepository = require('../repositories/company.repository');
const fileRepository = require('../repositories/file.repository');
const memberRepository = require('../repositories/member.repository');
const userRepository = require('../repositories/user.repository');
const validateFileUpload = require('../helpers/validateFileUpload');
const serviceController = require('./service.controller');

module.exports = {
  createCompanyWithRegisteredUser: async (registeredUser, companyInputBody, callback = () => {}) => {
    if (!registeredUser || !registeredUser?.id) {
      return callback(createError(400, errorMessages.SOMETHING_WENT_WRONG));
    }

    let user = await userRepository.findUserByQuery({ _id: registeredUser.id });
    let company = null;

    // check if company exists with registration Id
    company = await companyRepository.findCompanyByQuery({ registrationId: companyInputBody?.registrationId });

    if (company) {
      return callback(createError(400, errorMessages.COMPANY_EXIST_WITH_REG_NUM));
    }

    // check if company exists with mobile/email
    company = await companyRepository.findCompanyByQuery({ $or: [ { mobile: companyInputBody.mobile }, { email: companyInputBody.email } ] });

    if (company) {
      return callback(createError(400, errorMessages.COMPANY_EXIST_WITH_MOBILE_EMAIL));
    }

    // assign user
    companyInputBody.user = user.id;

    // save new company
    company = await companyRepository.saveCompany(companyInputBody);
    let companyMembers = null;

    if (company.id && companyInputBody?.members?.length > 0) {
      companyMembers = await memberRepository.saveManyCompanyMember(company.id, companyInputBody.members);
    }

    if (companyMembers) {
      company = company.toJSON();
      company.members = companyMembers;
    }

    return callback(null, company);
  },
  createCompany: async (req, res, next) => {
    const inputBody = req.body;
    let authUser = req.auth.user;

    authUser = await userRepository.findUserByQuery({ _id: authUser });

    // check if user exists
    if (!authUser) {
      return next(createError(400, errorMessages.USER_DOES_NOT_EXIST));
    }

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
    const companies = await companyRepository.findAllCompanies({ /*user: req.auth.user*/ }, pagination);
    return res.json({ statusCode: 200, data: companies });
  },
  createStudentCompany: async (req, res, next) => {
    const { service: serviceInputBody, ...companyInputBody } = req.body;
    let authUser = req.auth.user;

    authUser = await userRepository.findUserByQuery({ _id: authUser });

    // check if user exists
    if (!authUser) {
      return next(createError(400, errorMessages.USER_DOES_NOT_EXIST));
    }

    if (!nonCompanyUserTypes.includes(authUser.userType)) {
      return next(createError(400, errorMessages.USER_NOT_ALLOWED));
    }
    
    let company = null;

    // check if company exists with registration Id
    company = await companyRepository.findCompanyByQuery({ registrationId: companyInputBody.registrationId });

    if (company) {
      return next(createError(400, errorMessages.COMPANY_EXIST_WITH_REG_NUM));
    }

    // check if company exists with mobile/email
    company = await companyRepository.findCompanyByQuery({ $or: [ { mobile: companyInputBody.mobile }, { email: companyInputBody.email } ] });

    if (company) {
      return next(createError(400, errorMessages.COMPANY_EXIST_WITH_MOBILE_EMAIL));
    }

    // assign user
    companyInputBody.user = authUser.id;

    // save new company
    company = await companyRepository.saveCompany(companyInputBody);
    let companyMembers = null;

    // save company members
    if (company.id && companyInputBody.members?.length > 0) {
      companyMembers = await memberRepository.saveManyCompanyMember(company.id, companyInputBody.members);
    }

    // save updated user
    authUser = await userRepository.findUserAndUpdate({
      id: authUser.id,
      userType: companyInputBody.userType,
      category: companyInputBody.category,
    });

    if (companyMembers) {
      company = company.toJSON();
      company.members = companyMembers;
    }

    let serviceErrorMsg = null
    if (serviceInputBody) {
      serviceInputBody.companyId = company.id;
      await serviceController.createServiceWithRegisteredUser(authUser, serviceInputBody, async (err, data) => {
        if (err) serviceErrorMsg = err;
      });
      if (serviceErrorMsg) return next(serviceErrorMsg);
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
  uploadLogoImage: async (req, res, next) => {
    const companyId = req.body?.id;
    const imageFile = req.files?.image;

    if (!imageFile) {
      return next(createError(400, errorMessages.IMAGE_NOT_UPLOADED));
    }

    if (!validateObjectId(companyId)) {
      return next(createError(400, errorMessages.INVALID_OBJECT_ID));
    }
    
    const company = await companyRepository.findCompanyById(companyId);

    if (!company) {
      return next(createError(400, errorMessages.COMPANY_NOT_EXIST_WITH_ID));
    }

    const fileValidationRes = validateFileUpload(imageFile, true);

    if (fileValidationRes) {
      return next(createError(400, fileValidationRes));
    }

    let fileData = await fileRepository.saveFile({
      relatedEntity: companyRepository.getModelName(),
      relatedEntityId: company.id,
      originalName: imageFile.name,
      mimeType: imageFile.mimetype,
      size: imageFile.size,
    });
    
    const fileName = fileData.id + getFileExtension(fileData.originalName);
    const filePath = path.join(__dirname, '../../public/images', fileName);

    imageFile.mv(filePath, async function(err) {
      if (err) {
        fileData = await fileRepository.findAndRemoveFileById(fileData.id);
        return next(err);
      }

      // convert to JSON and add 'imageUrl' into it
      fileData = fileData.toJSON();
      fileData.imageUrl = fileData.imageUrl(req);

      // add company's logo image
      await companyRepository.updateCompany(companyId, { logoImage: fileData.imageUrl });

      return res.json({ statusCode: 200, message: successMessages.FILE_UPLOADED });
    });
  },
  uploadDocuments: async (req, res, next) => {
    const companyId = req.body?.id;
    const brochureFile = req.files?.brochure;

    if (!brochureFile) {
      return next(createError(400, errorMessages.IMAGE_NOT_UPLOADED));
    }
    
    const fileValidationRes = validateFileUpload(brochureFile, false);

    if (fileValidationRes) {
      return next(createError(400, fileValidationRes));
    }

    if (!validateObjectId(companyId)) {
      return next(createError(400, errorMessages.INVALID_OBJECT_ID));
    }
    
    const company = await companyRepository.findCompanyById(companyId);

    if (!company) {
      return next(createError(400, errorMessages.COMPANY_NOT_EXIST_WITH_ID));
    }

    let fileData = await fileRepository.saveFile({
      relatedEntity: companyRepository.getModelName(),
      relatedEntityId: company.id,
      originalName: brochureFile.name,
      mimeType: brochureFile.mimetype,
      size: brochureFile.size,
    });
    
    const fileName = fileData.id + getFileExtension(fileData.originalName);
    const filePath = path.join(__dirname, '../../public/docs', fileName);

    brochureFile.mv(filePath, async function(err) {
      if (err) {
        fileData = await fileRepository.findAndRemoveFileById(fileData.id);
        return next(err);
      }

      // convert to JSON and add 'imageUrl' into it
      fileData = fileData.toJSON();
      fileData.imageUrl = fileData.imageUrl(req);

      // add company's logo image
      await companyRepository.updateCompany(companyId, { brochureLink: fileData.imageUrl });

      return res.json({ statusCode: 200, message: successMessages.FILE_UPLOADED });
    });
  },
  updateCompanyStatus: async (req, res, next) => {
    let authUser = req.auth.user;
    const { status, companyId } = req.body;
    const updateStatus = parseInt(status);

    authUser = await userRepository.findUserByQuery({ _id: authUser });

    // check if user exists
    if (!authUser) {
      return next(createError(400, errorMessages.USER_DOES_NOT_EXIST));
    }

    if (![userTypes.ADMIN, ...adminUserTypes].includes(authUser.userType)) {
      return next(createError(403, errorMessages.USER_NOT_AUTHORIZED));
    }

    let company = await companyRepository.findCompanyById(companyId);

    if (!company) {
      return next(createError(400, errorMessages.COMPANY_NOT_EXIST_WITH_ID));
    }
    
    if (
      company.status === undefined && updateStatus === companyStatus.CREATED ||
      company.status === companyStatus.CREATED && updateStatus === companyStatus.APPROVED ||
      company.status === companyStatus.CREATED && updateStatus === companyStatus.REJECTED ||
      company.status === companyStatus.REJECTED && updateStatus === companyStatus.APPROVED ||
      company.status === companyStatus.APPROVED && updateStatus === companyStatus.REJECTED
    ) {
      const updateCompany = { status: updateStatus };
      company = await companyRepository.updateCompany(companyId, updateCompany);
      return res.json({ statusCode: 200, data: company });
    }
    // return error if invalid status
    return next(createError(400, errorMessages.INVALID_STATUS));
  },
}