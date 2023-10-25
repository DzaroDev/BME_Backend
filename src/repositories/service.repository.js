const serviceModel = require('../models/service.model');

module.exports = {
  saveService: async (service) => {
    service.isActive = true; // active by default
    service.company = service.companyId; // assign company Id
    service = new serviceModel(service);
    return await service.save();
  },
  findOneServiceByQuery: async (query) => {
    const output = await serviceModel.findOne(query).exec();
    return output;
  },
  findServiceById: async (serviceId) => {
    const output = await serviceModel.findById(serviceId);
    return output;
  },
  findAndUpdateServiceById: async (serviceId, updateService) => {
    const output = await serviceModel.findByIdAndUpdate(serviceId, updateService, { new: true });
    return output;
  },
}
