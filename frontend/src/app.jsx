
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";

import { SmartAlarmForm } from "./components/SmartAlarmForm";
import { MyAlarms } from "./pages/MyAlarms";
import { Profile } from "./pages/Profile";
import { DayConfig } from "./pages/DayConfig";
import AlarmRingingModal from "./components/AlarmRingingModal";

import "./app.css";
import { getUser, logout } from "./utils/auth";
import { Login } from "./pages/Login";


function NavLink({ to, children }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      style={{
        textDecoration: "none",
        color: isActive ? "#fff" : "#ccc",
        backgroundColor: isActive ? "#646cff" : "#333",
        padding: "10px 20px",
        borderRadius: "25px",
        fontWeight: "bold",
        transition: "all 0.3s",
        border: isActive ? "2px solid #fff" : "2px solid transparent",
      }}
    >
      {children}
    </Link>
  );
}

function App() {
  const [ringingAlarm, setRingingAlarm] = useState(null);

  // ✅ user "live" (se mettra à jour quand on dispatch auth-changed)
  const [user, setUser] = useState(() => getUser());
  const userId = user?.id;

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const socket = useMemo(() => {
    return io(API_URL, { transports: ["websocket"], withCredentials: true });
  }, [API_URL]);

  // ✅ écoute login/logout (quand tu feras window.dispatchEvent(new Event("auth-changed")))
  useEffect(() => {
    const refresh = () => setUser(getUser());
    window.addEventListener("auth-changed", refresh);
    return () => window.removeEventListener("auth-changed", refresh);
  }, []);

  useEffect(() => {
    const onConnect = () => {
      console.log("🟢 socket connected", socket.id);

      if (!userId) {
        console.log("⚠️ no userId (not logged in), not joining room");
        return;
      }

      socket.emit("join", { userId });
      console.log("👤 sent join for", userId);
    };

    const onConnectError = (err) => {
      console.log("❌ socket connect_error", err.message);
    };

    const onTriggered = (payload) => {
      console.log("🚨 alarm:triggered received", payload);
      setRingingAlarm(payload);
    };

    socket.on("connect", onConnect);
    socket.on("connect_error", onConnectError);
    socket.on("alarm:triggered", onTriggered);

    // Si déjà connecté et que userId change (login), on join tout de suite
    if (socket.connected && userId) {
      socket.emit("join", { userId });
      console.log("👤 (re)join for", userId);
    }

    return () => {
      socket.off("connect", onConnect);
      socket.off("connect_error", onConnectError);
      socket.off("alarm:triggered", onTriggered);
      // ⚠️ pas de disconnect ici (évite les soucis en dev)
    };
  }, [socket, userId]);

  const stop = () => setRingingAlarm(null);

  const snooze = async () => {
    try {
      if (!ringingAlarm?.id || ringingAlarm.id === "test") {
        setRingingAlarm(null);
        return;
      }

      console.log("➡️ calling snooze for", ringingAlarm.id);

      const r = await fetch(`${API_URL}/api/alarms/${ringingAlarm.id}/snooze`, {
        method: "POST",
      });

      console.log("⬅️ snooze status", r.status);
      setRingingAlarm(null);
    } catch (e) {
      console.log("❌ snooze error", e);
    }
  };

  return (
    <BrowserRouter>
      <nav
        style={{
          padding: "20px",
          marginBottom: "30px",
          display: "flex",
          gap: "15px",
          justifyContent: "center",
          backgroundColor: "#1a1a1a",
          borderRadius: "0 0 15px 15px",
        }}
      >
        <NavLink to="/">🏠 Accueil</NavLink>
        <NavLink to="/alarms">⏰ Alarmes</NavLink>
        <NavLink to="/config">⚙️ Config</NavLink>
        <NavLink to="/profile">👤 Profil</NavLink>
        <NavLink to="/login">🔐 Login</NavLink>
      </nav>

      <div className="content-container">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <h1>Smart Sleep 🌙</h1>
                <SmartAlarmForm />
              </>
            }
          />
          <Route path="/alarms" element={<MyAlarms />} />
          <Route path="/config" element={<DayConfig />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>

      <AlarmRingingModal alarm={ringingAlarm} onStop={stop} onSnooze={snooze} />
    </BrowserRouter>
  );
}

export default App;
