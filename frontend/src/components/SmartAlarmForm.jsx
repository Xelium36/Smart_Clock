import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "../utils/auth";

export function SmartAlarmForm() {
  const navigate = useNavigate();

  const [bedTime, setBedTime] = useState("23:00");
  const [wakeUpTime, setWakeUpTime] = useState("07:00");
  const [alarmName, setAlarmName] = useState("Réveil");

  const [dayTypes, setDayTypes] = useState([]);
  const [musics, setMusics] = useState([]);
  const [selectedDayType, setSelectedDayType] = useState("");
  const [selectedMusic, setSelectedMusic] = useState("");
  const [possibleMusicsDisplay, setPossibleMusicsDisplay] = useState([]);

  const [calculatedSmartTime, setCalculatedSmartTime] = useState(null);
  const [smartMessage, setSmartMessage] = useState("");

  // ✅ userId depuis localStorage (auth)
  const userId = getUser()?.id;

  useEffect(() => {
    fetch("/api/musics")
      .then((r) => r.json())
      .then(setMusics)
      .catch(console.error);

    fetch("/api/daytypes")
      .then((r) => r.json())
      .then((data) => {
        setDayTypes(data);
        if (data.length > 0) handleDayTypeChange(data[0]._id, data);
      })
      .catch(console.error);
  }, []);

  const calculateSmartWakeUp = (start, end) => {
    const [hStart, mStart] = start.split(":").map(Number);
    const [hEnd, mEnd] = end.split(":").map(Number);

    const dateStart = new Date();
    dateStart.setHours(hStart, mStart, 0, 0);

    const dateEnd = new Date();
    dateEnd.setHours(hEnd, mEnd, 0, 0);

    if (dateStart > dateEnd) {
      dateEnd.setDate(dateEnd.getDate() + 1);
    }
    if (dateEnd < dateStart) {
      dateEnd.setDate(dateEnd.getDate() + 1);
    }

    const windowStart = new Date(dateEnd.getTime() - 30 * 60000);

    let cycleTime = new Date(dateStart.getTime() + 15 * 60000);
    let foundOptimalTime = null;

    while (cycleTime <= dateEnd) {
      if (cycleTime >= windowStart) {
        foundOptimalTime = new Date(cycleTime.getTime());
        break;
      }
      cycleTime = new Date(cycleTime.getTime() + 90 * 60000);
    }

    if (foundOptimalTime) {
      setSmartMessage("✅ Fin de cycle parfaite trouvée !");
      return foundOptimalTime;
    } else {
      setSmartMessage("⚠️ Aucun cycle dans la fenêtre (-30min). Réveil à l'heure pile.");
      return dateEnd;
    }
  };

  useEffect(() => {
    const smart = calculateSmartWakeUp(bedTime, wakeUpTime);
    setCalculatedSmartTime(smart);
  }, [bedTime, wakeUpTime]);

  const pickRandomMusic = (dayObject) => {
    if (dayObject && dayObject.musics && dayObject.musics.length > 0) {
      const songs = dayObject.musics;
      const randomIndex = Math.floor(Math.random() * songs.length);
      setSelectedMusic(songs[randomIndex]._id);
      setPossibleMusicsDisplay(songs);
    } else {
      setSelectedMusic("");
      setPossibleMusicsDisplay([]);
    }
  };

  const handleDayTypeChange = (id, allDays = dayTypes) => {
    setSelectedDayType(id);
    const dayObject = allDays.find((d) => d._id === id);
    pickRandomMusic(dayObject);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      alert("Tu dois être connecté(e) pour créer une alarme.");
      navigate("/login");
      return;
    }

    const smartDate = calculateSmartWakeUp(bedTime, wakeUpTime);

    const payload = {
      userId,
      bedTime,
      targetWakeUpTime: wakeUpTime,
      scheduledWakeUpTime: smartDate, // Date -> sera sérialisée en ISO par JSON.stringify
      dayTypeId: selectedDayType,
      musicId: selectedMusic,
      label: alarmName,
    };

    try {
      const res = await fetch("/api/alarms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const txt = await res.text();
        console.error("Create alarm failed:", res.status, txt);
        alert("Erreur: impossible de créer l’alarme.");
        return;
      }

      navigate("/alarms");
    } catch (err) {
      console.error(err);
      alert("Erreur réseau lors de la création.");
    }
  };

  const currentMusicName = musics.find((m) => m._id === selectedMusic)?.name || "Aucune";

  return (
    <form onSubmit={handleSubmit} className="card">
      <h2 style={{ marginTop: 0 }}>⏰ Réveil Intelligent</h2>

      <label>Nom de l'alarme</label>
      <input type="text" value={alarmName} onChange={(e) => setAlarmName(e.target.value)} />

      <div style={{ display: "flex", gap: "15px" }}>
        <div style={{ flex: 1 }}>
          <label>Coucher 🛌</label>
          <input type="time" value={bedTime} onChange={(e) => setBedTime(e.target.value)} />
        </div>
        <div style={{ flex: 1 }}>
          <label>Limite Réveil ☀️</label>
          <input type="time" value={wakeUpTime} onChange={(e) => setWakeUpTime(e.target.value)} />
        </div>
      </div>

      <label>Type de journée</label>
      <select value={selectedDayType} onChange={(e) => handleDayTypeChange(e.target.value)}>
        {dayTypes.map((d) => (
          <option key={d._id} value={d._id}>
            {d.name}
          </option>
        ))}
      </select>

      <div style={{ marginBottom: "15px", fontSize: "0.85em", color: "#aaa", fontStyle: "italic" }}>
        Playlist : {possibleMusicsDisplay.map((m) => m.name).join(", ") || "Vide"}
      </div>

      <div
        style={{
          padding: "15px",
          background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
          color: "white",
          borderRadius: "10px",
          fontWeight: "bold",
          marginBottom: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderBottom: "1px solid rgba(255,255,255,0.3)",
            paddingBottom: "5px",
          }}
        >
          <span>🎲 Musique :</span>
          <span>{currentMusicName}</span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ textAlign: "left" }}>
            ✨ Réveil calculé :<br />
            <small style={{ fontWeight: "normal", fontSize: "0.7em", opacity: 0.9, color: "#ffcc80" }}>
              {smartMessage}
            </small>
          </span>
          <span style={{ fontSize: "1.5em", color: "#4caf50" }}>
            {calculatedSmartTime
              ? calculatedSmartTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
              : "--:--"}
          </span>
        </div>
      </div>

      <button type="submit">Enregistrer</button>
    </form>
  );
}
