const path = require('path')
const dotenv = require('dotenv')

const envFilePath = path.resolve(
  __dirname,
  '..',
  '..',
  `.env.${process.env.NODE_ENV}`
)
const envConfig = dotenv.config({ path: envFilePath })

if (envConfig.error) {
  throw new Error(`Environment file config error: ${envConfig.error}`)
}

const config = {
  env: process.env.NODE_ENV,
  addr: process.env.SERVER_ADDR,
  port: process.env.SERVER_PORT,
  apiKey: process.env.API_KEY,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN_SEC,
  db: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    pwd: encodeURIComponent(process.env.DB_PWD),
    name: process.env.DB_NAME,
    debugMode: process.env.DB_DEBUG,
  },
  adminUser: {
    name: process.env.ADMIN_USER,
    pwd: process.env.ADMIN_PWD,
  },
  email: {
    name: process.env.EMAIL_SENDER_NAME,
    address: process.env.EMAIL_ADDR,
    pwd: process.env.EMAIL_PWD,
  },
  file: {
    allowedImgFileSize: process.env.ALLOWED_IMAGE_FILE_SIZE,
    allowedDocFileSize: process.env.ALLOWED_DOCUMENT_FILE_SIZE,
    allowedImgFileTypes: process.env.ALLOWED_IMAGE_FILE_TYPES,
    allowedDocFileTypes: process.env.ALLOWED_DOCUMENT_FILE_TYPES,
  }
}

module.exports = config
