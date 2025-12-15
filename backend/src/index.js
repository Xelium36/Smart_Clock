import "dotenv/config";
import { connectToDb } from "./db/mongo.js";
import app from "./app.js";

const PORT = process.env.PORT || 3000;

async function start() {
  await connectToDb();
  app.listen(PORT, () => {
    console.log(`API running at http://localhost:${PORT}`);
  });
}

start();
