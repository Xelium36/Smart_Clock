import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { SmartAlarmForm } from './components/SmartAlarmForm';
import { MyAlarms } from './pages/MyAlarms';
import { Profile } from './pages/Profile';
import { DayConfig } from './pages/DayConfig';
import './app.css';

// TON ID (Ne change pas si tu ne relances pas tout le serveur, sinon reprends-le du seed)
export const CURRENT_USER_ID = "695ea70efa32989d1a9d997a"; 

// Petit composant pour les liens du menu (Style bouton)
function NavLink({ to, children }) {
    const location = useLocation();
    const isActive = location.pathname === to;
    return (
        <Link to={to} style={{
            textDecoration: 'none',
            color: isActive ? '#fff' : '#ccc',
            backgroundColor: isActive ? '#646cff' : '#333',
            padding: '10px 20px',
            borderRadius: '25px',
            fontWeight: 'bold',
            transition: 'all 0.3s',
            border: isActive ? '2px solid #fff' : '2px solid transparent'
        }}>
            {children}
        </Link>
    );
}

function App() {
  return (
    <BrowserRouter>
      {/* Menu plus visible et espacé */}
      <nav style={{ 
          padding: '20px', 
          marginBottom: '30px', 
          display: 'flex', 
          gap: '15px', 
          justifyContent: 'center',
          backgroundColor: '#1a1a1a', // Fond sombre pour la barre
          borderRadius: '0 0 15px 15px'
      }}>
        <NavLink to="/">🏠 Accueil</NavLink>
        <NavLink to="/alarms">⏰ Alarmes</NavLink>
        <NavLink to="/config">⚙️ Config</NavLink>
        <NavLink to="/profile">👤 Profil</NavLink>
      </nav>

      <div className="content-container">
        <Routes>
            <Route path="/" element={<><h1>Smart Sleep 🌙</h1><SmartAlarmForm /></>} />
            <Route path="/alarms" element={<MyAlarms />} />
            <Route path="/config" element={<DayConfig />} />
            <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;