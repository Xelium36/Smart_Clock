import { useEffect, useState } from 'react';
import { CURRENT_USER_ID } from '../app';

export function MyAlarms() {
  const [alarms, setAlarms] = useState([]);

  useEffect(() => {
    if(!CURRENT_USER_ID) return;
    fetch(`/api/alarms/user/${CURRENT_USER_ID}`)
      .then(res => res.json())
      .then(setAlarms)
      .catch(console.error);
  }, []);

  return (
    <div className="card">
      <h2>⏰ Mes Alarmes</h2>
      {alarms.length === 0 ? <p>Aucune alarme programmée.</p> : (
        <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
          {alarms.map(a => (
            <div key={a._id} style={{border: '1px solid #555', borderRadius: '8px', padding: '10px', textAlign: 'left', background: '#2a2a2a'}}>
              <div style={{fontWeight: 'bold', fontSize: '1.1em'}}>{a.label}</div>
              <div>🎯 Cible : {a.targetWakeUpTime}</div>
              <div style={{color: '#646cff'}}>🔔 Smart Réveil : {new Date(a.scheduledWakeUpTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
              <div style={{fontSize: '0.9em', color: '#aaa'}}>🎵 {a.musicId?.name || "Aucune"}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}