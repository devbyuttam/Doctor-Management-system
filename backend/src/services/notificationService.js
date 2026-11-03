const Notification = require("../models/Notification");
const { emitToUser } = require("./socketService");

const createNotification = async (
  userId,
  title,
  message,
  type,
  relatedId,
  relatedModel,
) => {
  try {
    const notification = await Notification.create({
      userId,
      title,
      message,
      type,
      relatedId,
      relatedModel,
    });

    emitToUser(userId, "notification:new", notification);
    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
  }
};

module.exports = { createNotification };
