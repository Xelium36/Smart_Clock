// Emplacement: src/models/music.model.js

let musics = []; // A remplacer pour DB

/**
 * Retourne toutes les musiques
 */
export function getAllMusics() {
  return musics;
}

/**
 * Retourne une musique spécifique par son ID
 *  */ 
export function getMusicById(musicId) {
  return musics.find(m => m.id === musicId);
}

/**
 * Crée une nouvelle musique. Data attendu de la forme (à voir si on change) : { name: string, duration: string/number }
 */
export function createMusic(data) {
  const newMusic = { 
    id: Date.now().toString(), // Génération d'ID simple
    ...data 
  };
  musics.push(newMusic);
  return newMusic;
}

/**
 * Met à jour une musique existante
 *  */ 
export function updateMusic(musicId, updates) {
  const idx = musics.findIndex(m => m.id === musicId);
  if (idx === -1) return null;
  
  musics[idx] = { ...musics[idx], ...updates };
  return musics[idx];
}

/**
 * Supprime une musique
 *  */ 
export function deleteMusic(musicId) {
  const before = musics.length;
  musics = musics.filter(m => m.id !== musicId);
  return musics.length < before;
}