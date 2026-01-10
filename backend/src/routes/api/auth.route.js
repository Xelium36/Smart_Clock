import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../models/user.model.js";

const router = Router();

function signToken(userId) {
  return jwt.sign({}, process.env.JWT_SECRET, {
    subject: String(userId),
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

function looksLikeBcryptHash(s) {
  return typeof s === "string" && (s.startsWith("$2a$") || s.startsWith("$2b$") || s.startsWith("$2y$"));
}

// ✅ REGISTER
router.post("/register", async (req, res) => {
  try {
    const { email, password, prenom, nom, date_de_naissance } = req.body;

    if (!email || !password || !date_de_naissance) {
    return res.status(400).json({ message: "email, password, date_de_naissance required" });
    }

    const existing = await User.findOne({ Email: email });
    if (existing) return res.status(409).json({ message: "Email already used" });

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      Email: email,
      Mot_de_passe: hash,
      Prenom: prenom || "",
      Nom: nom || "",
      Date_de_naissance: new Date(date_de_naissance),
    });

    const token = signToken(user._id);

    return res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.Email,
        prenom: user.Prenom,
        nom: user.Nom,
      },
    });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
});

// ✅ LOGIN (accepte password seed en clair + upgrade en hash)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "email and password required" });
    }

    const user = await User.findOne({ Email: email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const stored = user.Mot_de_passe;

    let ok = false;

    if (looksLikeBcryptHash(stored)) {
      ok = await bcrypt.compare(password, stored);
    } else {
      ok = password === stored;

      if (ok) {
        user.Mot_de_passe = await bcrypt.hash(password, 10);
        await user.save();
      }
    }

    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = signToken(user._id);

    return res.json({
      token,
      user: {
        id: user._id,
        email: user.Email,
        prenom: user.Prenom,
        nom: user.Nom,
      },
    });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
});

export default router;
