import { useEffect, useState } from 'react';
import { getUser } from "../utils/auth"; // adapte le chemin si besoin


export function Profile() {
  const [user, setUser] = useState(null);
  const userId = getUser()?.id;

  useEffect(() => {
    if (!userId) return;
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(setUser)
      .catch(console.error);
  }, []);

  if (!user) return <div style={{color:'white', padding:'20px'}}>Chargement du profil...</div>;

  return (
    <div style={{maxWidth: '500px', margin: '0 auto', padding: '20px'}}>
      <div style={{
          background: '#2c2c2c',
          padding: '30px',
          borderRadius: '15px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
          textAlign: 'center'
      }}>
          {/* Avatar simple */}
          <div style={{fontSize: '4em', marginBottom: '10px'}}>👤</div>
          
          <h2 style={{margin: '10px 0', color: '#fff'}}>{user.Prenom} {user.Nom}</h2>
          <p style={{color: '#aaa', marginTop: 0}}>{user.Email}</p>
          
          <hr style={{margin: '25px 0', borderColor: '#444'}}/>
          
          <h3 style={{textAlign: 'left', color: '#646cff'}}>📊 Vos Statistiques</h3>
          
          {user.Stats ? (
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', textAlign: 'left'}}>
                  
                  <div style={{background: '#333', padding: '15px', borderRadius: '10px'}}>
                      <div style={{fontSize: '0.8em', color: '#888'}}>Sommeil Moyen</div>
                      <div style={{fontSize: '1.2em', fontWeight: 'bold', color: '#fff'}}>🌙 {user.Stats.sommeil}</div>
                  </div>

                  <div style={{background: '#333', padding: '15px', borderRadius: '10px'}}>
                      <div style={{fontSize: '0.8em', color: '#888'}}>Qualité</div>
                      <div style={{fontSize: '1.2em', fontWeight: 'bold', color: '#4caf50'}}>✨ {user.Stats.qualite}</div>
                  </div>

                  <div style={{background: '#333', padding: '15px', borderRadius: '10px'}}>
                      <div style={{fontSize: '0.8em', color: '#888'}}>Dette Sommeil</div>
                      <div style={{fontSize: '1.2em', fontWeight: 'bold', color: '#ff9800'}}>⚠️ {user.Stats.dette}</div>
                  </div>

                  <div style={{background: '#333', padding: '15px', borderRadius: '10px'}}>
                      <div style={{fontSize: '0.8em', color: '#888'}}>Heure Coucher</div>
                      <div style={{fontSize: '1.2em', fontWeight: 'bold', color: '#eceff1ff'}}>🛌 {user.Stats.coucher}</div>
                  </div>

              </div>
          ) : (
              <p style={{color: '#aaa'}}>Aucune statistique disponible.</p>
          )}
      </div>
    </div>
  );
}