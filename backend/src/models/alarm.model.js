import mongoose from "mongoose";

const alarmSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
    label: { type: String, default: "Réveil" },
    
    // PDF: "date. ini" (Heure du coucher)
    bedTime: { type: String, required: true }, 

    // PDF: "date reveil" (Heure cible)
    targetWakeUpTime: { type: String, required: true },

    // Résultat du calcul intelligent
    scheduledWakeUpTime: { type: Date },

    dayTypeId: { type: mongoose.Schema.Types.ObjectId, ref: 'DayType' },
    musicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Music' },

    // PDF: "Max acceptable-time interval"
    duration_interv: { type: String, default: "30" },

    vibration: { type: Boolean, default: true },
    
    // PDF: "SHODE" (Snooze)
    snooze: { type: Boolean, default: false },

    enabled: { type: Boolean, default: true },

    // Jours de répétition (0 = Dimanche, 1 = Lundi, ..., 6 = Samedi)
    repeatDays: { type: [Number], default: [] }
  },
  { timestamps: true }
);

export default mongoose.model("Alarm", alarmSchema);