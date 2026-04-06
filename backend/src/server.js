require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
const app = require("./app");
const { setIO } = require("./config/socket");
const Appointment = require("./models/Appointment");
const ensureAdminUser = require("./utils/ensureAdminUser");

const PORT = process.env.PORT || 5000;
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const startServer = async () => {
  await connectDB();
  const adminResult = await ensureAdminUser();
  await Appointment.syncIndexes();

  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      methods: ["GET", "POST"],
    },
  });

  setIO(io);

  io.on("connection", (socket) => {
    socket.on("queue:join", ({ doctorId, date }) => {
      socket.join(`queue:${doctorId}:${date}`);
    });

    socket.on("queue:leave", ({ doctorId, date }) => {
      socket.leave(`queue:${doctorId}:${date}`);
    });
  });

  server.listen(PORT, () => {
    console.log(
      adminResult.created
        ? `Seeded admin user: ${adminResult.email}`
        : `Admin user already present: ${adminResult.email}`
    );
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
