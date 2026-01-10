import { useEffect, useState } from "react";
import { getUser } from "../utils/auth";
const userId = getUser()?.id;

const DAY_NAMES = { 0: "Dim", 1: "Lun", 2: "Mar", 3: "Mer", 4: "Jeu", 5: "Ven", 6: "Sam" };

function formatRepeatDays(arr) {
  if (!arr || arr.length === 0) return "Unique";
  // Order days as Mon..Sun for display (1..6,0)
  const order = [1,2,3,4,5,6,0];
  return arr
    .slice()
    .sort((a,b)=> order.indexOf(a)-order.indexOf(b))
    .map((d)=> DAY_NAMES[d] || d)
    .join(", ");
}

export function MyAlarms() {
  const [alarms, setAlarms] = useState([]);

  useEffect(() => {
    if (!userId) return;

    fetch(`/api/alarms/user/${userId}`)
      .then((res) => res.json())
      .then(setAlarms)
      .catch(console.error);
  }, []);

  const handleDelete = async (alarmId, label) => {
    const ok = window.confirm(`Supprimer l’alarme "${label}" ?\n(Action irréversible)`);
    if (!ok) return;

    try {
      const res = await fetch(`/api/alarms/${alarmId}`, { method: "DELETE" });

      if (!res.ok) {
        console.error("Delete failed:", res.status);
        alert("Impossible de supprimer l’alarme.");
        return;
      }

      setAlarms((prev) => prev.filter((a) => a._id !== alarmId));
    } catch (e) {
      console.error(e);
      alert("Erreur réseau lors de la suppression.");
    }
  };

  return (
    <div className="card">
      <h2>⏰ Mes Alarmes</h2>

      {alarms.length === 0 ? (
        <p>Aucune alarme programmée.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {alarms.map((a) => (
            <div
              key={a._id}
              style={{
                border: "1px solid #555",
                borderRadius: "8px",
                padding: "14px",
                textAlign: "left",
                background: "#2a2a2a",
              }}
            >
              {/* ✅ Header: titre à gauche, poubelle à droite */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 6,
                }}
              >
                <div style={{ fontWeight: "bold", fontSize: "1.1em" }}>{a.label}</div>

                <div
                  onClick={() => handleDelete(a._id, a.label)}
                  title="Supprimer"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") handleDelete(a._id, a.label);
                  }}
                  style={{
                    marginLeft: "auto",     // ✅ pousse à droite
                    cursor: "pointer",
                    fontSize: 20,
                    padding: 6,
                    lineHeight: 1,
                    opacity: 0.85,
                    userSelect: "none",
                  }}
                >
                  🗑️
                </div>
              </div>

              <div>🎯 Cible : {a.targetWakeUpTime}</div>
              <div style={{ color: "#646cff" }}>
                🔔 Smart Réveil :{" "}
                {a.scheduledWakeUpTime
                  ? new Date(a.scheduledWakeUpTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "—"}
              </div>
              <div>🔁 Répète : {a.repeatDays && a.repeatDays.length > 0 ? formatRepeatDays(a.repeatDays) : "Unique"}</div>
              <div style={{ fontSize: "0.9em", color: "#aaa" }}>
                🎵 {a.musicId?.name || "Aucune"}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
