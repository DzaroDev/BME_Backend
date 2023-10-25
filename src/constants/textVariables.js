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
  INVALID_USER_PWD: 'Incorrect password.',
  USER_NOT_ACTIVE: 'Account de-activated. Please contact Admin.',
  USER_NOT_VERIFIED: 'User is not verified.',
  INVALID_TOKEN: 'Invalid token was provided',
  INVALID_USR_PROFILE: 'Invalid user profile',
  COMPANY_EXIST_WITH_REG_NUM: 'Company already exist with registration number',
  COMPANY_NOT_EXIST_WITH_ID: 'Company does not exist',
  SERVICE_NOT_EXIST_WITH_ID: 'Service does not exist',
  BLOG_DOES_NOT_EXIST: 'Blog does not exist',
}

const successMessages = {
  MOBILE_OTP_SENT: 'OTP sent to your mobile.',
  EMAIL_OTP_SENT: 'OTP sent to your email.',
  MOBILE_OTP_VERIFIED: 'Mobile verification successful.',
  EMAIL_OTP_VERIFIED: 'Email verification successful.',
  BLOG_DELETED: 'Blog deleted successfully',
}

module.exports = {
  errorMessages,
  successMessages,
}
