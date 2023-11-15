const userTypes = {
  ADMIN: 1, // super admin user
  MANUFACTURER: 2, // company user
  DEALER: 3, // company user
  SERVICE_PROVIDER: 4, // company user
  RD_ORG: 5, // company user
  MEDICAL_PROF: 6, // non-company user
  BME_SENIOR: 7, // non-company user
  BME_STUDENT: 8, // non-company user
  OTHER: 9, // non-company user
  SUB_ADMIN: 10, // sub admin user
};

const companyUserTypes = [
  userTypes.MANUFACTURER,
  userTypes.DEALER,
  userTypes.SERVICE_PROVIDER,
  userTypes.RD_ORG,
];

const nonCompanyUserTypes = [
  userTypes.MEDICAL_PROF,
  userTypes.BME_SENIOR,
  userTypes.BME_STUDENT,
  userTypes.OTHER,
];

const adminUserTypes = [
  userTypes.SUB_ADMIN,
];

const otpPurpose = {
  SIGN_UP: 'Sign Up',
  FORGOT_PWD: 'Forgot Password',
}

const blogStatus = {
  INCOMPLETE: 1,
  APPROVED: 2,
  PUBLISHED: 3,
  UNPUBLISHED: 4,
}

const subscriptionPlanPeriods = {
  MONTHLY: 1,
  QUARTERLY: 3,
  HALF_YEARLY: 6,
  YEARLY: 12,
}

module.exports = {
  userTypes,
  companyUserTypes,
  nonCompanyUserTypes,
  otpPurpose,
  blogStatus,
  adminUserTypes,
  subscriptionPlanPeriods,
}
