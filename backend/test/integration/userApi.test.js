// tests/integration/userApi.test.js

import request from "supertest"; // Pour simuler les requêtes HTTP 
import { describe, it, expect, beforeEach } from "vitest";
import app from "../../src/app.js"; // Assurez-vous d'exporter votre application Express ici
import User from "../../src/models/user.model.js"; // Votre modèle Mongoose

// Définissez un point de terminaison d'API, par exemple '/api/users'
const API_ENDPOINT = "/api/users"; 

describe("Users API (integration)", () => {
    // Nettoyer la base de données avant chaque test [cite: 184, 186]
    beforeEach(async () => {
        await User.deleteMany({}); 
    });

    it("creates a user and then returns it in the list", async () => {
        const newUser = {
            Nom: "TestIntegration",
            Prenom: "API",
            Email: "api.test@example.com",
            Mot_de_passe: "securePass123",
            Date_de_naissance: "1995-11-20" 
        };

        // 1. Créer un nouvel utilisateur (POST /api/users)
        const createRes = await request(app)
            .post(API_ENDPOINT)
            .send(newUser);
            
        expect(createRes.status).toBe(201); [cite: 193]
        expect(createRes.body).toHaveProperty("_id"); [cite: 194]
        expect(createRes.body.Nom).toBe(newUser.Nom);

        // 2. Lister tous les utilisateurs (GET /api/users)
        const listRes = await request(app).get(API_ENDPOINT);

        expect(listRes.status).toBe(200); [cite: 197]
        expect(Array.isArray(listRes.body)).toBe(true); [cite: 198]
        expect(listRes.body.length).toBe(1); [cite: 199]
        expect(listRes.body[0].Nom).toBe(newUser.Nom);
    });

    it("returns 404 if a user is not found when fetching by ID", async () => {
        // Tenter de récupérer un ID non existant
        const res = await request(app).get(`${API_ENDPOINT}/60d5ec49c6f2a2001c9c7f69`);
        
        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty("message", "User not found");
    });
});