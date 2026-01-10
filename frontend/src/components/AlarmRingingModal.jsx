import { useEffect, useRef, useState } from "react";

export default function AlarmRingingModal({ alarm, onStop, onSnooze }) {
  const audioRef = useRef(null);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    console.log("🎵 alarm music payload:", alarm?.music);
    if (!alarm) return;

    // ✅ Utilise la musique envoyée par le backend, sinon fallback
    const src = alarm?.music?.filePath || "/sounds/piano.mp3";

    // Stoppe l'ancienne musique si une autre alarme arrive
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    const a = new Audio(src);
    a.loop = true;
    a.volume = 0.9;
    audioRef.current = a;

    a.play()
      .then(() => setBlocked(false))
      .catch(() => setBlocked(true));

    return () => {
      a.pause();
      a.currentTime = 0;
    };
  }, [alarm?.id]); // si l'id change => nouvelle alarme => nouvelle musique

  if (!alarm) return null;

  const stopSound = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const enableSound = () => {
    audioRef.current?.play().then(() => setBlocked(false)).catch(() => {});
  };

  return (
    <div style={styles.backdrop}>
      <div style={styles.card}>
        <h2 style={{ margin: 0 }}>⏰ ALARME</h2>

        <div style={{ marginTop: 10, fontSize: 18 }}>
          <strong>{alarm.label || "Réveil"}</strong>
        </div>

        {/* ✅ Affiche la musique choisie */}
        <div style={{ marginTop: 8, opacity: 0.9, fontSize: 14 }}>
          🎵 {alarm.music?.name || "Musique par défaut"}
        </div>

        <div style={{ marginTop: 6, opacity: 0.85, fontSize: 14 }}>
          Déclenchée :{" "}
          {alarm.scheduledWakeUpTime
            ? new Date(alarm.scheduledWakeUpTime).toLocaleString()
            : ""}
        </div>

        {blocked && (
          <div style={styles.warning}>
            Ton navigateur a bloqué l’autoplay. Clique sur “Activer le son”.
          </div>
        )}

        <div style={styles.row}>
          <button
            style={styles.btnStop}
            onClick={() => {
              stopSound();
              onStop?.();
            }}
          >
            Stop
          </button>

          <button
            style={styles.btnSnooze}
            onClick={() => {
              stopSound();
              onSnooze?.();
            }}
          >
            Snooze 10 min
          </button>

          <button style={styles.btnSound} onClick={enableSound}>
            🔊 Activer le son
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  backdrop: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.65)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },
  card: {
    width: "min(560px, 92vw)",
    background: "#1f1f1f",
    color: "white",
    padding: 22,
    borderRadius: 18,
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
    textAlign: "center",
  },
  row: {
    display: "flex",
    gap: 12,
    justifyContent: "center",
    flexWrap: "wrap",
    marginTop: 18,
  },
  btnStop: { padding: "10px 18px", borderRadius: 12, fontWeight: 800 },
  btnSnooze: { padding: "10px 18px", borderRadius: 12, fontWeight: 700 },
  btnSound: { padding: "10px 18px", borderRadius: 12 },
  warning: {
    marginTop: 14,
    padding: 10,
    borderRadius: 12,
    background: "rgba(255,200,0,0.15)",
    border: "1px solid rgba(255,200,0,0.25)",
    fontSize: 14,
  },
};
