import { describe, it, expect } from "vitest";
import { isValidUser } from "../../src/utils/userValidation.js";

describe("isValidUser", () => {
    const validUser = {
        Nom: "Doe",
        Prenom: "John",
        Email: "john.doe@example.com",
        Mot_de_passe: "securePass123",
        Date_de_naissance: new Date("1990-01-01"),
    };

    it("returns true for a valid user object", () => {
        expect(isValidUser(validUser)).toBe(true);
    });

    it("returns false if Nom is missing", () => {
        const user = { ...validUser, Nom: undefined };
        expect(isValidUser(user)).toBe(false);
    });

    it("returns false if Email is not a valid string format (missing @)", () => {
        const user = { ...validUser, Email: "invalidemail.com" };
        expect(isValidUser(user)).toBe(false);
    });
    
    it("returns false if Prenom is an empty string", () => {
        const user = { ...validUser, Prenom: "   " };
        expect(isValidUser(user)).toBe(false);
    });
});