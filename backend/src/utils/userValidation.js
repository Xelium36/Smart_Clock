export function isValidUser(data) {
    if (!data) return false;
    
    // Vérification basique des champs requis pour la création
    if (!data.Nom || typeof data.Nom !== "string" || data.Nom.trim() === "") return false;
    if (!data.Prenom || typeof data.Prenom !== "string" || data.Prenom.trim() === "") return false;
    if (!data.Email || typeof data.Email !== "string" || !data.Email.includes('@')) return false;
    
    // Vous pouvez ajouter des vérifications plus complexes ici (format email, date, etc.)
    
    return true;
}