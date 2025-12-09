// src/models/daytype.model.js
import mongoose from "mongoose";

const dayTypeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    isWorkingDay: { type: Boolean, default: true }
  },
  { timestamps: true }
);

const DayType = mongoose.model("DayType", dayTypeSchema);

export default DayType;
