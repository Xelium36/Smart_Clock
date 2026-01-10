import { useState, useEffect } from 'react';

export function DayConfig() {
  const [dayTypes, setDayTypes] = useState([]);
  const [musics, setMusics] = useState([]);

  useEffect(() => {
    fetch('/api/musics').then(r => r.json()).then(setMusics);
    fetch('/api/daytypes').then(r => r.json()).then(setDayTypes);
  }, []);

  const toggleMusic = async (day, musicId) => {
    const currentMusicIds = day.musics.map(m => m._id);
    let newMusicIds;

    if (currentMusicIds.includes(musicId)) {
        newMusicIds = currentMusicIds.filter(id => id !== musicId);
    } else {
        newMusicIds = [...currentMusicIds, musicId];
    }

    const newMusicsObjects = musics.filter(m => newMusicIds.includes(m._id));
    
    setDayTypes(dayTypes.map(d => 
        d._id === day._id ? { ...d, musics: newMusicsObjects } : d
    ));

    try {
        await fetch(`/api/daytypes/${day._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ musics: newMusicIds })
        });
    } catch (err) { console.error(err); }
  };

  return (
    <div style={{maxWidth: '800px', margin: '0 auto'}}>
      <h2>⚙️ Configuration des Playlists</h2>
      <p style={{marginBottom: '20px', color: '#ccc'}}>Sélectionnez les musiques autorisées pour chaque moment.</p>
      
      <div style={{display: 'flex', flexDirection: 'column', gap: '25px'}}>
        {dayTypes.map(day => (
          <div key={day._id} style={{
              background: '#2c2c2c', // Fond de carte plus clair
              padding: '20px', 
              borderRadius: '15px', 
              border: '1px solid #555',
              boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
              textAlign: 'left'
          }}>
            <h3 style={{marginTop: 0, color: '#fff', borderBottom: '1px solid #444', paddingBottom: '10px'}}>
                {day.name} 
                <span style={{fontSize:'0.6em', marginLeft:'10px', backgroundColor:'#444', padding:'3px 8px', borderRadius:'10px'}}>
                    {day.isWorkingDay ? "Travail" : "Repos"}
                </span>
            </h3>
            
            <div style={{display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '15px'}}>
                {musics.map(music => {
                    const isChecked = day.musics.some(m => m._id === music._id);
                    return (
                        <div key={music._id} onClick={() => toggleMusic(day, music._id)} style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            // COULEURS VISIBLES ICI
                            backgroundColor: isChecked ? '#2e7d32' : '#424242', // Vert si coché, Gris si non
                            color: 'white',
                            border: isChecked ? '2px solid #4caf50' : '2px solid transparent',
                            padding: '8px 16px', 
                            borderRadius: '25px', 
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            fontWeight: isChecked ? 'bold' : 'normal',
                            userSelect: 'none'
                        }}>
                            <span>{isChecked ? "✅" : "⚪"}</span>
                            <span>{music.name}</span>
                        </div>
                    );
                })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}