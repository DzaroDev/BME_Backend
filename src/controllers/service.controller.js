const { errorMessages } = require('../constants/textVariables');
const createError = require('../helpers/createError');
const companyRepository = require('../repositories/company.repository');
const serviceRepository = require('../repositories/service.repository');

module.exports = {
  createServiceWithRegisteredUser: async (registeredUser, serviceInputBody, callback = () => {}) => {
    if (!registeredUser || !registeredUser?.id || !serviceInputBody?.companyId) {
      return callback(createError(400, errorMessages.SOMETHING_WENT_WRONG), null);
    }
    
    // assign user
    serviceInputBody.user = registeredUser.id;

    // check if company exists
    const company = await companyRepository.findCompanyById(serviceInputBody.companyId);

    if (!company) {
      return callback(createError(400, errorMessages.COMPANY_NOT_EXIST_WITH_ID));
    }

    const service = await serviceRepository.saveService(serviceInputBody);
    
    return callback(null, service);
  },
  createService: async (req, res, next) => {
    const inputBody = req.body;

    // assign user
    inputBody.user = req.auth.user;

    // check if company exists
    const company = await companyRepository.findCompanyById(inputBody.companyId);

    if (!company) {
      return next(createError(400, errorMessages.COMPANY_NOT_EXIST_WITH_ID));
    }

    const service = await serviceRepository.saveService(inputBody);
    
    return res.json({ statusCode: 200, data: service });
  },
  updateService: async (req, res, next) => {
    const serviceId = req.params.serviceId;
    const inputBody = req.body;

    // check if service exists
    let service = await serviceRepository.findServiceById(serviceId);

    if (!service) {
      return next(createError(400, errorMessages.SERVICE_NOT_EXIST_WITH_ID));
    }

    service = await serviceRepository.findAndUpdateServiceById(serviceId, inputBody);
    
    return res.json({ statusCode: 200, data: service });
  },
}