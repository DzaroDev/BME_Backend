const planModel = require('../models/subscriptionPlan.model');
const subscriptionModel = require('../models/userSubscription.model');

module.exports = {
  getPlanModelName: async () => {
    return planModel.modelName;
  },
  getUserSubsciptionModelName: async () => {
    return subscriptionModel.modelName;
  },
  savePlan: async (plan) => {
    plan.isActive = true; // active by default
    plan = new planModel(plan);
    return await plan.save();
  },
  findPlanByQuery: async (query) => {
    const output = await planModel.findOne(query).exec();
    return output;
  },
  updatePlanById: async (planId, updatePlan) => {
    const output = await planModel.findByIdAndUpdate(planId, updatePlan, { new: true });
    return output;
  },
  findAllPlans: async (query) => {
    query = { ...query, isDeleted: false };
    return await planModel.find(query);
  },
  
  saveSubscription: async (subscription) => {
    subscription.isActive = true; // active by default
    subscription = new subscriptionModel(subscription);
    return await subscription.save();
  },
  findUserPlanByQuery: async (query) => {
    const output = await subscriptionModel.findOne(query).populate('subscriptionplan').exec();
    return output;
  },
}
