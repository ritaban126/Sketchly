import "dotenv/config";
import express from "express";
import cors from "cors";
import "./config/redis";
import {createServer} from "http";
import {Server} from "socket.io";
import { toNodeHandler } from "better-auth/node";
import {auth} from "@repo/auth";
import {initWebSocket} from "./websocket";

import boardRoutes from "./modules/board/board.route";
import drawingRoutes from "./modules/drawing/drawing.route";
import historyRoutes from "./modules/history/history.route";
import fileRoutes from "./modules/file/file.route";
import notificationRoutes from "./modules/notifications/notification.route";
import { errorHandler } from "./middleware/errorHandler";

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  process.env.CLIENT_URL,
  process.env.BETTER_AUTH_URL,
  process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : undefined,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
].filter((value): value is string => Boolean(value));

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      const isAllowed =
        allowedOrigins.includes(origin) ||
        origin.includes(".vercel.app") ||
        origin.includes("localhost");

      if (isAllowed) {
        callback(null, true);
        return;
      }

      callback(new Error(`Origin not allowed by CORS: ${origin}`));
    },
    credentials: true,
  })
);
app.use(express.json());

// Better Auth — handles signup/login/logout/session
app.all("/api/auth/*splat", toNodeHandler(auth));

app.get("/health", (_req, res) => res.json({ status: "ok" }));

// Feature routes
app.use("/api/boards", boardRoutes);
app.use("/api/boards", drawingRoutes);
app.use("/api/boards", historyRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/notifications", notificationRoutes);


app.use(errorHandler);

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      const isAllowed =
        allowedOrigins.includes(origin) ||
        origin.includes(".vercel.app") ||
        origin.includes("localhost");

      if (isAllowed) {
        callback(null, true);
        return;
      }

      callback(new Error(`Origin not allowed by CORS: ${origin}`));
    },
    credentials: true,
  },
});

initWebSocket(io);


const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
// app.listen(process.env.PORT || 3001, () => {
//   console.log(`Server is running on port ${process.env.PORT || 3001}`);
// });

