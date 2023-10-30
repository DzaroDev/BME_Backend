const notificationModel = require('../models/notification.model');

module.exports = {
  saveNotification: async (notification) => {
    notification = new notificationModel(notification);
    return await notification.save();
  },
  saveMultipleNotifications: async (notifications) => {
    return notificationModel.insertMany(notifications);
  },
  findOneNotificationById: async (notificationId) => {
    const output = await notificationModel.findById(notificationId);
    return output;
  },
  findOneNotification: async (query) => {
    const output = await notificationModel.findOne(query);
    return output;
  },
  updateOneNotification: async (query, updateNotification) => {
    const output = await notificationModel.findOneAndUpdate(query, updateNotification, { new: true });
    return output;
  },
  findAllUnreadNotificationsByUser: async (userId) => {
    const output = await notificationModel.find({ receivedByUser: userId, isRead: false });
    return output;
  },
  updateAllUnreadNotificationsByUser: async (userId, update) => {
    const output = await notificationModel.updateMany({ receivedByUser: userId, isRead: false }, update);
    return output;
  },
}
