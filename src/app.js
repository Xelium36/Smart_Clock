// src/app.js

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
// Assurez-vous d'avoir installé 'body-parser' ou utilisez le middleware intégré d'Express
// pour gérer les requêtes POST/PATCH JSON
import userRoutes from './routes/routes/user.route.js';
import { getPackageInfo, getAppStatus } from './utils/appInfo.js'; // Ces utilitaires sont nécessaires pour les tests /info et /version
import { boomHandler, errorHandler } from './middlewares/errorHandler.js'; // Middleware d'erreur pour /boom

// Chargez les variables d'environnement (si ce n'est pas déjà fait dans index.js)
dotenv.config();

const app = express();

// --- 1. Middleware Global ---
// Permet à Express de lire le corps des requêtes en JSON
app.use(express.json()); 
// Permet de gérer les requêtes venant d'origines différentes (utile pour le frontend)
app.use(cors()); 

// --- 2. Routes de l'Application ---
// Montez vos routes spécifiques (ici, les routes CRUD pour l'entité User)
app.use('/api/users', userRoutes); 

// --- 3. Routes Requises par les Tests ---
// Ces routes sont nécessaires pour faire passer les tests /info, /version et /boom

// GET /version
app.get('/version', (req, res) => {
    // getPackageInfo() doit lire le nom et la version du package.json
    const { version } = getPackageInfo(); 
    res.status(200).json({ version });
});

// GET /info
app.get('/info', (req, res) => {
    // getAppStatus() doit fournir les infos demandées (name, version, node, uptime)
    res.status(200).json(getAppStatus());
});

// GET /boom (Simule une erreur)
app.get('/boom', (req, res, next) => {
    // Déclenche une erreur qui sera capturée par le middleware d'erreur
    // Ce test vérifie si le handler d'erreur renvoie bien 500
    next(new Error('Simulated internal server error')); 
});

// --- 4. Gestion des Erreurs (DOIT ÊTRE LA DERNIÈRE CHOSE) ---
// Gère l'erreur générée par /boom et renvoie 500
app.use(boomHandler); 
// Gère toutes les autres erreurs non-capturées ou les erreurs 404
app.use(errorHandler); 

// --- 5. Exportation de l'Application ---
// L'application est exportée pour être utilisée dans src/index.js et par Supertest dans les tests d'intégration
export default app;