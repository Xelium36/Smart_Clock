import mongoose from "mongoose";

const genreSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    // PDF: "liste id. musics"
    musics: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Music' 
    }]
  },
  { timestamps: true }
);

export default mongoose.model("Genre", genreSchema);