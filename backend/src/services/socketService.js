const socketConfig = require("../config/socket");

const emitToUser = (userId, event, data) => {
  try {
    const io = socketConfig.getIo();
    io.to(`patient_${userId}`).to(`doctor_${userId}`).emit(event, data);
  } catch (err) {
    console.error("Socket error:", err.message);
  }
};

const emitToQueue = (doctorId, date, event, data) => {
  try {
    const io = socketConfig.getIo();
    io.to(`queue_${doctorId}_${date}`).emit(event, data);
  } catch (err) {
    console.error("Socket error:", err.message);
  }
};

const emitToAdmin = (event, data) => {
  try {
    const io = socketConfig.getIo();
    io.to("admin_room").emit(event, data);
  } catch (err) {
    console.error("Socket error:", err.message);
  }
};

module.exports = { emitToUser, emitToQueue, emitToAdmin };
