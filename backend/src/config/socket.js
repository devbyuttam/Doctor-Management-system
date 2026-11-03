const socketIo = require("socket.io");

let io;

module.exports = {
  init: (server) => {
    io = socketIo(server, {
      cors: {
        origin: process.env.CLIENT_URL,
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    io.on("connection", (socket) => {
      console.log("New client connected:", socket.id);

      socket.on("join:patient", (patientId) => {
        socket.join(`patient_${patientId}`);
      });

      socket.on("join:doctor", (doctorId) => {
        socket.join(`doctor_${doctorId}`);
      });

      socket.on("join:queue", ({ doctorId, date }) => {
        socket.join(`queue_${doctorId}_${date}`);
      });

      socket.on("join:admin", () => {
        socket.join("admin_room");
      });

      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
      });
    });

    return io;
  },
  getIo: () => {
    if (!io) {
      throw new Error("Socket.io not initialized");
    }
    return io;
  },
};
