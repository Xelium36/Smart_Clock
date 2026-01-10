import "dotenv/config";
import http from "http";
import { Server } from "socket.io";
import { connectToDb } from "./db/mongo.js";
import app from "./app.js";
import { setIO } from "./socket.js";
import { initAlarmScheduling } from "./utils/alarmScheduler.js";

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  },
});

setIO(io);

io.on("connection", (socket) => {
  console.log("🟢 Socket connected:", socket.id);

  socket.on("join", ({ userId }) => {
    console.log("👤 join room request:", userId);
    if (userId) socket.join(String(userId));
    console.log("✅ joined room:", String(userId));
  });

  socket.on("disconnect", () => {
    console.log("🔴 Socket disconnected:", socket.id);
  });
});

async function start() {
  await connectToDb();
  await initAlarmScheduling();

  server.listen(PORT, () => {
    console.log(`API running at http://localhost:${PORT}`);
  });
}

start();
