/**
 * Express app configuration.
 * Responsibilities:
 *  - Base routes (/, /health)
 *  - Auto-mount all routers in src/routes/auto/*.route.js
 *  - Global error handler (consistent JSON for errors)
 */
import express from "express";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { errorHandler } from "./utils/errorHandler.js";
import musicRouter from './routes/api/music.route.js';
import alarmsRouter from './routes/api/alarm.route.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const publicPath = path.resolve(__dirname, "..", "public");
app.use(express.static(publicPath));
console.log("Serving public from:", publicPath);

app.get("/health", (_req, res) => res.status(200).send("OK"));

// Auto-mount all routers placed under src/routes/auto
const autoDir = path.join(__dirname, "routes", "auto");
if (fs.existsSync(autoDir)) {
  const files = fs.readdirSync(autoDir).filter(f => f.endsWith(".route.js"));
  for (const f of files) {
    const full = path.join(autoDir, f);
    const mod = await import(pathToFileURL(full).href);
    const router = mod.default;
    if (router) app.use("/", router);
  }
}

const uploadsPath = path.resolve(__dirname, "..", "uploads");
app.use("/uploads", express.static(uploadsPath));
console.log("Serving uploads from:", uploadsPath);

app.use('/api/v1/users/:userId/alarms', alarmsRouter);
app.use('/api/v1/musics', musicRouter);

app.get("/", (_req, res) => res.sendFile(path.join(publicPath, "upload.html")));

app.use(errorHandler);

export default app;
