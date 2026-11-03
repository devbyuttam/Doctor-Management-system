require("dotenv").config();
const http = require("http");
const app = require("./app");
const connectDB = require("./config/db");
const socketConfig = require("./config/socket");

const PORT = process.env.PORT || 5000;

// Connect Database
connectDB().then(() => {
  const { ensureDoctorRegistrySeeded } = require("./services/doctorRegistryService");
  ensureDoctorRegistrySeeded();
}).catch(() => {});

const server = http.createServer(app);

// Initialize Socket.io
socketConfig.init(server);

server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
