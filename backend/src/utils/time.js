
export function nextDateAtTimeHHmm(hhmm, baseDate = new Date()) {
  // hhmm: "07:00"
  const [hStr, mStr] = String(hhmm).split(":");
  const h = Number(hStr);
  const m = Number(mStr);

  if (!Number.isFinite(h) || !Number.isFinite(m)) {
    throw new Error(`Invalid time format: ${hhmm}`);
  }

  const d = new Date(baseDate);
  d.setSeconds(0, 0);
  d.setHours(h, m, 0, 0);

  // si l'heure est déjà passée aujourd'hui => demain
  if (d.getTime() <= baseDate.getTime()) {
    d.setDate(d.getDate() + 1);
  }
  return d;
}
