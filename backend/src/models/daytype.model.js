import mongoose from "mongoose";

const dayTypeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    isWorkingDay: { type: Boolean, default: true },
    defaultGenreId: { type: mongoose.Schema.Types.ObjectId, ref: 'Genre' },
    
    musics: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Music' 
    }]
  },
  { timestamps: true }
);

export default mongoose.model("DayType", dayTypeSchema);