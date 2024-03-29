const errorMessages = {
  SOMETHING_WENT_WRONG: 'Something went wrong! Please try again.',
  MOBILE_ALREADY_VERIFIED: 'Mobile is already verified.',
  EMAIL_ALREADY_VERIFIED: 'Email is already verified.',
  MOBILE_OTP_DOES_NOT_EXIST: 'OTP does not exist with mobile.',
  EMAIL_OTP_DOES_NOT_EXIST: 'OTP does not exist with email.',
  OTP_DOES_NOT_MATCH: 'Incorrect OTP.',
  MOBILE_NOT_VERIFIED: 'Mobile is not verified.',
  EMAIL_NOT_VERIFIED: 'Email is not verified.',
  USER_DOES_NOT_EXIST: 'User does not exist.',
  USER_ALREADY_EXIST: 'User already exist.',
  USER_NOT_ALLOWED: 'Already a company user.',
  INVALID_USER_PWD: 'Incorrect password.',
  USER_NOT_ACTIVE: 'Account de-activated. Please contact Admin.',
  USER_NOT_VERIFIED: 'User is not verified.',
  USER_ALREADY_VERIFIED: 'User is already verified.',
  INVALID_TOKEN: 'Invalid token was provided',
  INVALID_USR_PROFILE: 'Already a company profile type',
  COMPANY_EXIST_WITH_REG_NUM: 'Company already exist with registration number',
  COMPANY_EXIST_WITH_MOBILE_EMAIL: 'Company already exist with mobile or email',
  COMPANY_NOT_EXIST_WITH_ID: 'Company does not exist',
  SERVICE_NOT_EXIST_WITH_ID: 'Service does not exist',
  BLOG_DOES_NOT_EXIST: 'Blog does not exist',
  NOTIFICATION_DOES_NOT_EXIST: 'Notification does not exist',
  INVALID_STATUS: 'Invalid status was provided',
  USER_NOT_AUTHORIZED: 'User not authorized',
  IMAGE_NOT_UPLOADED: 'No files were uploaded',
  FILE_NOT_FOUND: 'File not found',
  INVALID_OBJECT_ID: 'Invalid ID was provided',
  JOB_POST_DOES_NOT_EXIST: 'Job post does not exist',
  PLAN_DOES_NOT_EXIST: 'Plan does not exist',
  PLAN_ALREADY_EXIST_WITH_NAME: 'Plan already exist with the name',
  CREATE_COMPANY_NOT_ALLOWED: 'Selected profile is not allowed to create company.',
  USER_NOT_SUBSCRIBED_TO_ANY_PLAN: 'User not subscribed to any plan',
  POST_DOES_NOT_EXIST: 'Post does not exist',
  CAT_DOES_NOT_EXIST: 'Category does not exist',
}

const successMessages = {
  MOBILE_OTP_SENT: 'OTP sent to your mobile.',
  EMAIL_OTP_SENT: 'OTP sent to your email.',
  MOBILE_OTP_VERIFIED: 'Mobile verified.',
  EMAIL_OTP_VERIFIED: 'Email verified.',
  BLOG_DELETED: 'Blog deleted successfully',
  NOTIFICATIONS_SAVED: 'Notifications saved successfully',
  NOTIFICATIONS_UPDATED: 'Notifications updated successfully',
  FILE_UPLOADED: 'File uploaded successfully',
  RESET_PWD: 'Reset password successful',
  USER_REGISTERED: 'User registered successfully',
  PLAN_CREATED: 'Plan created successfully',
  PLAN_UPDATED: 'Plan updated successfully',
  CAT_DELETED: 'Category deleted successfully',
}

module.exports = {
  errorMessages,
  successMessages,
}
