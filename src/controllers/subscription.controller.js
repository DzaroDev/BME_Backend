const { addDays } = require('date-fns');
const config = require('../config')

const { adminUserTypes, userTypes } = require('../constants');
const { errorMessages, successMessages } = require('../constants/textVariables');
const createError = require('../helpers/createError');
const subscriptionRepository = require('../repositories/subscription.repository');
const userRepository = require('../repositories/user.repository');

const ADMIN_USER_TYPES = [ userTypes.ADMIN, ...adminUserTypes ]

module.exports = {
  createDefaultSubscriptionPlan: async () => {
    let plan = await subscriptionRepository.findPlanByQuery({ name: config.subscription.name })
    if (!plan) {
      // save default free plan
      plan = await subscriptionRepository.savePlan({
        name: config.subscription.name,
        description: config.subscription.name,
        price: "0",
        durationDays: config.subscription.durationDays,
      });
    }
    return plan
  },
  createSubscriptionPlan: async (req, res, next) => {
    const inputBody = req.body;
    let authUser = req.auth.user;

    authUser = await userRepository.findUserByQuery({ _id: authUser });

    if (!ADMIN_USER_TYPES.includes(authUser.userType)) {
      return next(createError(403, errorMessages.USER_NOT_AUTHORIZED));
    }

    let plan = await subscriptionRepository.findPlanByQuery({ name: { $regex : new RegExp(inputBody?.name, "i") } });

    if (plan) {
      return next(createError(400, errorMessages.PLAN_ALREADY_EXIST_WITH_NAME));
    }

    plan = await subscriptionRepository.savePlan(inputBody);

    res.status(200).json({ statusCode: 200, data: plan });
  },
  updateSubscriptionPlan: async (req, res, next) => {
    const inputBody = req.body;
    const planId = req.params?.planId;
    let authUser = req.auth.user;

    authUser = await userRepository.findUserByQuery({ _id: authUser });

    if (!ADMIN_USER_TYPES.includes(authUser.userType)) {
      return next(createError(403, errorMessages.USER_NOT_AUTHORIZED));
    }

    let plan = await subscriptionRepository.findPlanByQuery({ _id: planId })

    if (!plan) {
      return next(createError(400, errorMessages.PLAN_DOES_NOT_EXIST));
    }

    plan = await subscriptionRepository.updatePlanById(planId, inputBody);

    res.status(200).json({ message: successMessages.PLAN_UPDATED, data: plan });
  },
  getSubscriptionPlans: async (req, res, next) => {
    let authUser = req.auth.user;
    authUser = await userRepository.findUserByQuery({ _id: authUser });
    let plans = []

    if (ADMIN_USER_TYPES.includes(authUser.userType)) {
      plans = await subscriptionRepository.findAllPlans({});
    } else {
      plans = await subscriptionRepository.findAllPlans({ 
        name: { $not: { $regex : new RegExp("Free Trial", "i") } },
        isActive: true,
      });
    }

    res.status(200).json({ statusCode: 200, data: plans });
  },
  applyPlanToVerifiedUser: async (user) => {
    user = await userRepository.findUserByQuery({ _id: user.id });
    if (!user || !user?.isVerified || user?.subscription) return
    const defaultPlan = await subscriptionRepository.findPlanByQuery({ name: config.subscription.name })
    let subscription = await subscriptionRepository.saveSubscription({
      user: user.id,
      plan: defaultPlan.id,
      subscriptionStartedAt: new Date(),
      subscriptionExpiredAt: addDays(new Date(), defaultPlan.durationDays),
    })
    // subscription = subscription.populate('plan')
    // subscription.plan = subscription.plan.name
    // subscription.description = subscription.plan.description
    // subscription.price = subscription.plan.price
    // subscription.durationDays = subscription.plan.durationDays
    // subscription = subscription.toJSON()
    // const { _id, user: u, ...rest } = subscription
    return subscription
  },
  getSubscriptionPlanForAuthUser: async (user) => {
    let plan = await subscriptionRepository.findUserPlanByQuery({ user: user.id })
    if (!plan) return
    return plan;
  }
}
