// Smart_Clock/backend/src/controllers/user.controller.js

import User from '../models/user.model.js';
// Note: Les fonctions en mémoire getAllUsers, getUserById, etc. ont été supprimées des importations.

export async function listUsers(req, res, next) {
    try {
        const users = await User.find();
        res.json(users);
    } catch (e) {
        next(e);
    }
}

export async function getOneUser(req, res, next) {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (e) {
        next(e);
    }
}

export async function createOneUser(req, res, next) {
    try {
        // La validation (isValidUser) devrait idéalement être ajoutée ici.
        const created = await User.create(req.body);
        res.status(201).json(created);
    } catch (e) {
        next(e);
    }
}

export async function updateOneUser(req, res, next) {
    try {
        const { userId } = req.params;
        const updatedUser = await User.findByIdAndUpdate(
            userId, 
            req.body, 
            { new: true, runValidators: true } // new: true pour retourner le document mis à jour, runValidators pour vérifier les contraintes du schéma
        );

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(updatedUser);
    } catch (e) {
        next(e);
    }
}

export async function deleteOneUser(req, res, next) {
    try {
        const { userId } = req.params;
        const deleted = await User.findByIdAndDelete(userId);

        if (!deleted) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(204).send();
    } catch (e) {
        next(e);
    }
}