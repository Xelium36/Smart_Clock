import { 
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
} from '../models/user.model.js';

export function listUsers(req, res) {
    res.json(getAllUsers());
}

export function getOneUser(req, res) {
    const {userId} = req.params;
    const user = getUserById(userId);

    if (!user) {
        return res.status(404).json({message: 'User not found'});
    }
    res.json(user);
}

export function createOneUser(req, res) {
    const created = createUser(req.body);
    res.status(201).json(created);
}

export function updateOneUser(req, res) {
    const { userId } = req.params;
    const updatedUser = updateUser(userId, req.body); 

    if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
    }
    res.json(updatedUser);
}

export function deleteOneUser(req, res) {
    const { userId } = req.params;
    const success = deleteUser(userId);

    if (!success) {
        return res.status(404).json({ error: "User not found" });
    }
    res.status(204).send(); 
}