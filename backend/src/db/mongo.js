import mongoose from "mongoose";

const uri = process.env.MONGO_URI;

if (!uri) {
  throw new Error("MONGO_URI est undefined. Problem with file .env");
}

export async function connectToDb() {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB via Mongoose");
  } catch (err) {
    console.error("Could not connect to MongoDB:", err);
    throw err;
  }
}