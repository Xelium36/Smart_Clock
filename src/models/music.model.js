import { ObjectId } from "mongodb";
import { getDb } from "../db/mongo.js";

const COLLECTION = "musics";

/**
 * GET all musics
 */
export async function getAllMusics() {
  const db = getDb();
  return db.collection(COLLECTION).find().toArray();
}

/**
 * GET by id
 */
export async function getMusicById(musicId) {
  const db = getDb();

  if (!ObjectId.isValid(musicId)) return null;

  return db.collection(COLLECTION).findOne({
    _id: new ObjectId(musicId),
  });
}

/**
 * CREATE
 */
export async function createMusic({ name, fileUrl, mime, size }) {
  const db = getDb();

  const doc = {
    name,
    fileUrl,
    mime,
    size,
    createdAt: new Date(),
  };

  const result = await db.collection(COLLECTION).insertOne(doc);

  return { _id: result.insertedId, ...doc };
}

/**
 * UPDATE (safe fields only)
 */
export async function updateMusic(musicId, updates) {
  const db = getDb();

  if (!ObjectId.isValid(musicId)) return null;

  const allowed = {};
  if (updates.name) allowed.name = updates.name;
  if (updates.fileUrl) allowed.fileUrl = updates.fileUrl;

  if (Object.keys(allowed).length === 0) return null;

  const result = await db.collection(COLLECTION).findOneAndUpdate(
    { _id: new ObjectId(musicId) },
    { $set: allowed },
    { returnDocument: "after" }
  );

  return result.value;
}

/**
 * DELETE
 */
export async function deleteMusic(musicId) {
  const db = getDb();

  if (!ObjectId.isValid(musicId)) return false;

  const result = await db.collection(COLLECTION).deleteOne({
    _id: new ObjectId(musicId),
  });

  return result.deletedCount === 1;
}
