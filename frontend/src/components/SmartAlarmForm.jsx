import { useState, useEffect } from 'react';
import { CURRENT_USER_ID } from '../app';
import { useNavigate } from 'react-router-dom';

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

  // État pour afficher le résultat du calcul
  const [calculatedSmartTime, setCalculatedSmartTime] = useState(null);
  // Petit message pour dire si on a trouvé un cycle ou si on a "coupé"
  const [smartMessage, setSmartMessage] = useState("");

  useEffect(() => {
     fetch('/api/musics').then(r=>r.json()).then(setMusics);
     fetch('/api/daytypes').then(r=>r.json()).then(data => {
         setDayTypes(data);
         if(data.length > 0) handleDayTypeChange(data[0]._id, data);
     });
  }, []);

  // --- NOUVELLE LOGIQUE (Fenêtre de 30 min) ---
  const calculateSmartWakeUp = (start, end) => {
    const [hStart, mStart] = start.split(':').map(Number);
    const [hEnd, mEnd] = end.split(':').map(Number);

    let dateStart = new Date();
    dateStart.setHours(hStart, mStart, 0, 0);

    let dateEnd = new Date(); // L'heure cible pile (ex: 07:00)
    dateEnd.setHours(hEnd, mEnd, 0, 0);

    // Gestion du passage au lendemain
    if (dateStart > dateEnd) {
        dateEnd.setDate(dateEnd.getDate() + 1);
    }
    if (dateEnd < dateStart) {
        dateEnd.setDate(dateEnd.getDate() + 1);
    }

    // Fenêtre d'acceptation : entre [Cible - 30min] et [Cible]
    // Ex: Si cible est 07h00, on cherche un cycle qui finit entre 06h30 et 07h00.
    const windowStart = new Date(dateEnd.getTime() - 30 * 60000);

    // On commence le calcul (Coucher + 15 min d'endormissement)
    let cycleTime = new Date(dateStart.getTime() + 15 * 60000);
    
    let foundOptimalTime = null;

    // On boucle tant qu'on n'a pas dépassé l'heure de réveil
    while (cycleTime <= dateEnd) {
        // Est-ce que ce cycle finit dans la fenêtre magique ?
        if (cycleTime >= windowStart) {
            foundOptimalTime = new Date(cycleTime.getTime());
            break; // On a trouvé le meilleur moment, on arrête !
        }
        // Sinon on ajoute 90 min et on continue
        cycleTime = new Date(cycleTime.getTime() + 90 * 60000);
    }

    if (foundOptimalTime) {
        setSmartMessage("✅ Fin de cycle parfaite trouvée !");
        return foundOptimalTime;
    } else {
        setSmartMessage("⚠️ Aucun cycle dans la fenêtre (-30min). Réveil à l'heure pile.");
        return dateEnd; // On renvoie l'heure cible par défaut
    }
  };

  // Mettre à jour l'affichage en temps réel
  useEffect(() => {
    const smart = calculateSmartWakeUp(bedTime, wakeUpTime);
    setCalculatedSmartTime(smart);
  }, [bedTime, wakeUpTime]);

  // --- (Le reste ne change pas) ---
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
      const dayObject = allDays.find(d => d._id === id);
      pickRandomMusic(dayObject);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const smartDate = calculateSmartWakeUp(bedTime, wakeUpTime);
    
    const payload = { userId: CURRENT_USER_ID, bedTime, targetWakeUpTime: wakeUpTime, scheduledWakeUpTime: smartDate, dayTypeId: selectedDayType, musicId: selectedMusic, label: alarmName };
    await fetch('/api/alarms', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(payload) });
    navigate('/alarms');
  };

  const currentMusicName = musics.find(m => m._id === selectedMusic)?.name || "Aucune";

  return (
    <form onSubmit={handleSubmit} className="card">
      <h2 style={{marginTop:0}}>⏰ Réveil Intelligent</h2>
      
      <label>Nom de l'alarme</label>
      <input type="text" value={alarmName} onChange={e => setAlarmName(e.target.value)} />

      <div style={{display: 'flex', gap: '15px'}}>
        <div style={{flex: 1}}>
            <label>Coucher 🛌</label>
            <input type="time" value={bedTime} onChange={e => setBedTime(e.target.value)} />
        </div>
        <div style={{flex: 1}}>
            <label>Limite Réveil ☀️</label>
            <input type="time" value={wakeUpTime} onChange={e => setWakeUpTime(e.target.value)} />
        </div>
      </div>

      <label>Type de journée</label>
      <select value={selectedDayType} onChange={(e) => handleDayTypeChange(e.target.value)}>
        {dayTypes.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
      </select>
      
      <div style={{marginBottom: '15px', fontSize: '0.85em', color: '#aaa', fontStyle:'italic'}}>
          Playlist : {possibleMusicsDisplay.map(m => m.name).join(', ') || "Vide"}
      </div>

      <div style={{
          padding: '15px',
          background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
          color: 'white',
          borderRadius: '10px',
          fontWeight: 'bold', 
          marginBottom: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
      }}>
          <div style={{display:'flex', justifyContent:'space-between', borderBottom:'1px solid rgba(255,255,255,0.3)', paddingBottom:'5px'}}>
            <span>🎲 Musique :</span>
            <span>{currentMusicName}</span>
          </div>
          
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <span style={{textAlign:'left'}}>
                ✨ Réveil calculé :<br/>
                <small style={{fontWeight:'normal', fontSize:'0.7em', opacity:0.9, color: '#ffcc80'}}>
                    {smartMessage}
                </small>
            </span>
            <span style={{fontSize:'1.5em', color:'#4caf50'}}>
                {calculatedSmartTime ? calculatedSmartTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '--:--'}
            </span>
          </div>
      </div>

      <button type="submit">Enregistrer</button>
    </form>
  );
}