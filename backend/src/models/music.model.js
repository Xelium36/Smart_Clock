// Smart_Clock/backend/src/models/music.model.js

import mongoose from "mongoose";

const musicSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true,
      unique: true 
    },
    duration: { 
      type: String, // Durée de la piste
      required: false,
    },
    filePath: { // Chemin d'accès au fichier audio
      type: String,
      required: false,
    }
  },
  {
    timestamps: true,
  }
);

const Music = mongoose.model("Music", musicSchema);

export default Music;