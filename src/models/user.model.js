let users =  [];
let Id = 1;

export function getAllUsers() {
    return users;
}

export function getUserById(userId) {
    return users.find(u => u.userId === userId);
}

export function createUser(user) {
    const newUser = {userId : Id, ...user};
    Id++;
    users.push(newUser);
    return newUser;
}


export function updateUser(userId, data) {
    const userIndex = users.findIndex(u => u.userId === Number(userId));
    if (userIndex === -1) {
        return null;
    }
    users[userIndex] = { ...users[userIndex], ...data };
    return users[userIndex];
}



export function deleteUser(userId) {
    const userIndex = users.findIndex(u => u.userId === Number(userId));
    if (userIndex === -1) {
        return false;
    }
    users.splice(userIndex, 1);
    return true;
}