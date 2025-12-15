import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI;

if (!uri) {
  throw new Error("MONGO_URI est undefined. Vérifie ton fichier .env");
}

const client = new MongoClient(uri);
let db;

export async function connectToDb() {
  await client.connect();
  db = client.db();
  console.log("Connected to MongoDB :", db.databaseName);
}

export function getDb() {
  if (!db) {
    throw new Error("Database not initialized. Call connectToDb() first.");
  }
  return db;
}
