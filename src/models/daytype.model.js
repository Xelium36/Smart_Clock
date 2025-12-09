let daytypes = []; // stockage in-memory

export function getAllDayTypes() {
  return daytypes;
}

export function getDayType(id) {
  return daytypes.find(dt => dt.id === id);
}

export function createDayType(data) {
  const newDayType = { id: Date.now().toString(), ...data };
  daytypes.push(newDayType);
  return newDayType;
}

export function updateDayType(id, updates) {
  const index = daytypes.findIndex(dt => dt.id === id);
  if (index === -1) return null;

  daytypes[index] = { ...daytypes[index], ...updates };
  return daytypes[index];
}

export function deleteDayType(id) {
  const before = daytypes.length;
  daytypes = daytypes.filter(dt => dt.id !== id);
  return daytypes.length < before;
}
