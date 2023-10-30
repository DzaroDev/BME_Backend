const { userTypes } = require('../constants');
const { errorMessages, successMessages } = require('../constants/textVariables');
const createError = require('../helpers/createError');
const notificationRepository = require('../repositories/notification.repository');
const userRepository = require('../repositories/user.repository');

module.exports = {
  listAllNotifications: async (req, res, next) => {
    const user = req.auth.user;

    let notifications = await notificationRepository.findAllUnreadNotificationsByUser(user);
    
    return res.json({ statusCode: 200, data: notifications });
  },
  createNotification: async (req, res, next) => {
    const inputBody = req.body;
    let authUser = req.auth.user;

    // check if admin user
    authUser = await userRepository.findUserByQuery({ _id: authUser });

    if (authUser.userType !== userTypes.ADMIN) {
      return next(createError(403));
    }

    let notifications = [];

    for (let i = 0; i < inputBody.receivedByUsers.length; i++) {
      const notification = {
        title: inputBody.title,
        body: inputBody.body,
        notifyType: inputBody.notifyType,
        receivedByUser: inputBody.receivedByUsers[i],
        sentByUser: req.auth.user,
      }
      
      // check if user notify enabled
      const userNotifyEnabled = await userRepository.findUserByQuery({
        _id: notification.receivedByUser,
        'preferences.pushNotification': true,
      });

      if (userNotifyEnabled) {
        notifications.push(notification);
      }
    }

    notifications = await notificationRepository.saveMultipleNotifications(notifications);
    
    return res.json({ statusCode: 200, message: successMessages.NOTIFICATIONS_SAVED });
  },
  updateNotification: async (req, res, next) => {
    const inputBody = req.body;
    const notificationId = req.params.notificationId;
    let notification = null;
    
    notification = await notificationRepository.findOneNotification({ _id: notificationId });
    
    if (!notification) {
      return next(createError(400, errorMessages.NOTIFICATION_DOES_NOT_EXIST));
    }

    notification = await notificationRepository.updateOneNotification({ _id: notificationId }, inputBody);
    
    return res.json({ statusCode: 200, data: notification });
  },
  updateAllNotifications: async (req, res, next) => {
    const inputBody = req.body;
    let authUser = req.auth.user;
    
    // update all notifications
    await notificationRepository.updateAllUnreadNotificationsByUser(authUser, inputBody);
    
    return res.json({ statusCode: 200, message: successMessages.NOTIFICATIONS_UPDATED });
  },
}