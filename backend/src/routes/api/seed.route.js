import { Router } from 'express';
import User from '../../models/user.model.js';
import DayType from '../../models/daytype.model.js';
import Music from '../../models/music.model.js';
import Alarm from '../../models/alarm.model.js';
import Genre from '../../models/genre.model.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    // 1. Nettoyage
    await User.deleteMany({});
    await DayType.deleteMany({});
    await Music.deleteMany({});
    await Alarm.deleteMany({});
    await Genre.deleteMany({});

    // 2. Musiques
    const m = await Music.insertMany([
    { name: "Chant des oiseaux 🐦", duration: "05:00", filePath: "/sounds/birds.mp3" },
    { name: "Rivière calme 🌊", duration: "10:00", filePath: "/sounds/water.mp3" },
    { name: "Piano Doux 🎹", duration: "04:30", filePath: "/sounds/piano.mp3" },
    { name: "Rock Énergique 🎸", duration: "03:00", filePath: "/sounds/rock.mp3" },
    { name: "Pluie sur le toit 🌧️", duration: "15:00", filePath: "/sounds/rain.mp3" },
    { name: "Techno Sport 🏃", duration: "05:00", filePath: "/sounds/techno.mp3" }
  ]);


    // 3. Types de journée
    await DayType.insertMany([
      { name: "Travail 💼", isWorkingDay: true, musics: [m[2]._id, m[3]._id, m[5]._id] },
      { name: "Week-end 🌴", isWorkingDay: false, musics: [m[0]._id, m[1]._id, m[4]._id] },
      { name: "Télétravail 🏠", isWorkingDay: true, musics: [m[0]._id, m[2]._id] }
    ]);

    // 4. Utilisateur (AVEC LES CLÉS CORRIGÉES)
    const user = await User.create({
      Uid: 1,
      Nom: "Dupont",
      Prenom: "Julie",
      Email: "julie@example.com",
      Mot_de_passe: "secret",
      Date_de_naissance: new Date("1998-05-20"),
      Stats: { 
          sommeil: "7h 42min", 
          qualite: "85/100 ⭐",
          dette: "-30 min",
          coucher: "23h15"
      }
    });

    res.json({ message: "✅ Base corrigée !", userId: user._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;