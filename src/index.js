// src/app.js

import express from 'express';
import usersRouter from './routes/routes/user.route.js';

const app = express();
const PORT = 3000;

// Middleware pour analyser le corps des requêtes en JSON
app.use(express.json());

// 🔗 Brancher les routes des utilisateurs
// Toutes les requêtes vers /api/v1/users vont vers usersRouter
app.use('/api/v1/users', usersRouter);

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});