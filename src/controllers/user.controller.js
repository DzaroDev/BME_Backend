const { isString, isNil } = require('lodash');
const path = require('path');

// config
const config = require('../config');

// constants
const { userTypes, nonCompanyUserTypes, adminUserTypes, companyUserTypes } = require('../constants');

// helpers
const createError = require('../helpers/createError');

// repositories
const userRepository = require('../repositories/user.repository');
const { errorMessages, successMessages } = require('../constants/textVariables');
const fileRepository = require('../repositories/file.repository');
const getFileExtension = require('../helpers/getFileExtension');
const validateFileUpload = require('../helpers/validateFileUpload');
const companyRepository = require('../repositories/company.repository');

module.exports = {
  createDefaultAdmin: async () => {
    let user = await userRepository.findAdminUser();
    if (user) return false;
    user = await userRepository.saveUser({
      firstName: 'Admin',
      email: config.adminUser.name,
      isActive: true,
      isVerified: true,
      password: config.adminUser.pwd,
      userType: userTypes.ADMIN,
    });
    return user;
  },
  getUserByToken: async (req, res, next) => {
    let user = req.params?.userId || req?.auth?.user;

    if (!user) {
      return next(createError(400, errorMessages.SOMETHING_WENT_WRONG));
    }

    user = await userRepository.findUserByQuery({ _id: user });

    if (!user) {
      return next(createError(400, errorMessages.USER_DOES_NOT_EXIST));
    }

    if (!user.isVerified) {
      return next(createError(400, errorMessages.USER_NOT_VERIFIED));
    }

    if (!user.isActive) {
      return next(createError(400, errorMessages.USER_NOT_ACTIVE));
    }

    user = user.toJSON()
    const company = await companyRepository.findCompanyByQuery({ user: user.id });

    return res.json({ statusCode: 200, data: { ...user, company } });
  },
  createUser: async (req, res, next) => {
    const inputBody = req.body;
    let userObj = null;
    if (isNil(inputBody.userType)) {
      return next(createError(400, errorMessages.SOMETHING_WENT_WRONG));
    }

    // check if user with mobile
    if (isString(inputBody.mobile)) {
      userObj = await userRepository.findOneByMobile(inputBody.mobile);
      if (!userObj) {
        return next(createError(400, errorMessages.MOBILE_NOT_VERIFIED));
      }
      if (userObj.isVerified) {
        return next(createError(400, errorMessages.MOBILE_ALREADY_VERIFIED));
      }
    }
    // check if user with email
    if (isString(inputBody.email)) {
      userObj = await userRepository.findOneByEmail(inputBody.email);
      
      // check if admin user type
      if (adminUserTypes.includes(inputBody.userType)) {
        if (userObj) {
          return next(createError(400, errorMessages.USER_ALREADY_EXIST));
        }
        // save new user
        userObj = await userRepository.createVerifiedUser(inputBody);
        return res.json({ statusCode: 200, data: userObj });
      }

      if (!userObj) {
        return next(createError(400, errorMessages.EMAIL_NOT_VERIFIED));
      }
      if (userObj.isVerified) {
        return next(createError(400, errorMessages.EMAIL_ALREADY_VERIFIED));
      }
    }

    // save new user
    userObj = await userRepository.createVerifiedUser(inputBody);

    return res.json({ statusCode: 200, data: userObj });
  },
  updateUser: async (req, res, next) => {
    let user = req.body;
    user.id = req?.auth?.user;
    
    if (!user?.id) {
      return next(createError(400, errorMessages.INVALID_TOKEN));
    }

    user = await userRepository.findUserAndUpdate(user);

    return res.json({ data: user });
  },
  updateUserProfile: async (req, res, next) => {
    const userType = req.body.profileType;
    let user = req.params.userId;
    
    user = await userRepository.findUserByQuery({ _id: user });

    if (!user) {
      return next(createError(400, errorMessages.USER_DOES_NOT_EXIST));
    }

    if (!nonCompanyUserTypes.includes(user.userType)) {
      return next(createError(400, errorMessages.INVALID_USR_PROFILE));
    }
    
    // update user type
    user.userType = userType;

    // save user
    user = await userRepository.findUserAndUpdate(user);

    return res.json({ statusCode: 200, data: user });
  },
  updateAdminUserProfile: async (req, res, next) => {
    const inputBody = req.body;
    let user = req.params.userId;
    user = await userRepository.findUserByQuery({ _id: user });
    if (!user || !adminUserTypes.includes(user.userType)) {
      return next(createError(400, errorMessages.USER_DOES_NOT_EXIST));
    }
    // update user
    if (isString(inputBody.firstName)) user.firstName = inputBody.firstName;
    if (isString(inputBody.lastName)) user.lastName = inputBody.lastName;
    // save user
    user = await userRepository.findUserAndUpdate(user);
    return res.json({ statusCode: 200, data: user });
  },
  listAllUsers: async (req, res, next) => {
    const query = {
      userType: {
        $in: [ ...companyUserTypes, ...nonCompanyUserTypes ]
      }
    }

    if (req.query.onlyAdmin) {
      query.userType = {
        $in: [ ...adminUserTypes ]
      }
    }

    const users = await userRepository.findAllUsers(query);
    return res.json({ statusCode: 200, data: users });
  },
  resetAdminUserPassword: async (req, res, next) => {
    const { password } = req.body;
    let user = req.params.userId;
    user = await userRepository.findUserByQuery({ _id: user });
    if (!user || !adminUserTypes.includes(user.userType)) {
      return next(createError(400, errorMessages.USER_DOES_NOT_EXIST));
    }
    // update user password
    user.password = password;
    user.save()
    return res.json({ statusCode: 200, data: user });
  },
  uploadProfileImage: async (req, res, next) => {
    const imageFile = req.files?.image;

    if (!imageFile) {
      return next(createError(400, errorMessages.IMAGE_NOT_UPLOADED));
    }

    const fileValidationRes = validateFileUpload(imageFile, true);

    if (fileValidationRes) {
      return next(createError(400, fileValidationRes));
    }

    const userId = req.auth.user;

    let fileData = await fileRepository.saveFile({
      relatedEntity: userRepository.getModelName(),
      relatedEntityId: userId,
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

      const imageUrl = fileData.imageUrl(req);

      // convert to JSON and add 'imageUrl' into it
      fileData = fileData.toJSON();
      fileData.imageUrl = imageUrl;

      // add user's image
      await userRepository.findUserAndUpdate({ id: userId, profileImage: imageUrl });

      return res.json({ statusCode: 200, message: successMessages.FILE_UPLOADED });
    });
  },
}