import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  Uid: { type: Number, required: false }, 
  Nom: { type: String, required: true },
  Prenom: { type: String, required: true },
  Date_de_naissance: { type: Date, required: true },
  Email: { type: String, required: true, unique: true },
  Mot_de_passe: { type: String, required: true },
  
  // Champ flexible pour les statistiques (PDF: "Coption stats")
  Stats: { 
    type: Map, 
    of: String, 
    required: false 
  },
  
  Date_de_creation: { type: Date, default: Date.now }
});

export default mongoose.model("Users", userSchema, "Users");