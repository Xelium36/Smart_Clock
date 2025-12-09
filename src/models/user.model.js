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

import mongoose from " mongoose ";

const userSchema = new mongoose.Schema (
{
Uid : { type : Number , required : true } ,
Nom : { type : String , required : true } ,
Prenom : { type : String , required : true },
Date_de_naissance : { type : Date , required : true} ,
Email : { type : String , required : true} ,
Mot_de_passe : { type : String , required : true },
Date_de_creation : { type : Date , default : Date . now }
}
) ;
export default mongoose . model (" Users ", userSchema , " Users ") ;