import { useState } from "react";
import { setAuth } from "../utils/auth";

export function Login() {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const isRegister = mode === "register";

  const [email, setEmail] = useState("julie@example.com");
  const [password, setPassword] = useState("secret");

  // champs register
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [dateNaissance, setDateNaissance] = useState(""); // YYYY-MM-DD

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const url = isRegister
        ? `${API_URL}/api/auth/register`
        : `${API_URL}/api/auth/login`;

      const payload = isRegister
        ? {
            email,
            password,
            prenom,
            nom,
            date_de_naissance: dateNaissance,
          }
        : { email, password };

      // validations simples côté front
      if (isRegister && !dateNaissance) {
        setError("Date de naissance obligatoire.");
        setLoading(false);
        return;
      }

      const r = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await r.json();

      if (!r.ok) {
        setError(data?.message || "Erreur");
        setLoading(false);
        return;
      }

      setAuth(data.token, data.user); // ✅ déclenche auth-changed
    } catch (err) {
      setError("Erreur réseau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: 700, margin: "0 auto" }}>
      <h2 style={{ marginBottom: 14 }}>
        {isRegister ? "🆕 Créer un compte" : "🔐 Connexion"}
      </h2>

      {/* Toggle */}
      <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 16 }}>
        <button
          type="button"
          onClick={() => setMode("login")}
          style={{
            padding: "10px 16px",
            borderRadius: 12,
            fontWeight: 800,
            border: mode === "login" ? "2px solid #fff" : "2px solid transparent",
            background: mode === "login" ? "#646cff" : "#333",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Login
        </button>

        <button
          type="button"
          onClick={() => setMode("register")}
          style={{
            padding: "10px 16px",
            borderRadius: 12,
            fontWeight: 800,
            border: mode === "register" ? "2px solid #fff" : "2px solid transparent",
            background: mode === "register" ? "#646cff" : "#333",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Register
        </button>
      </div>

      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {isRegister && (
          <>
            <div style={{ display: "flex", gap: 10 }}>
              <input
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                placeholder="Prénom"
                style={{ flex: 1 }}
              />
              <input
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                placeholder="Nom"
                style={{ flex: 1 }}
              />
            </div>

            <input
              value={dateNaissance}
              onChange={(e) => setDateNaissance(e.target.value)}
              type="date"
              placeholder="Date de naissance"
            />
          </>
        )}

        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />

        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mot de passe"
          type="password"
        />

        <button type="submit" disabled={loading}>
          {loading ? "..." : isRegister ? "Créer le compte" : "Se connecter"}
        </button>
      </form>

      {error && (
        <p style={{ color: "tomato", marginTop: 12, textAlign: "center" }}>
          {error}
        </p>
      )}

      {!error && (
        <p style={{ opacity: 0.7, marginTop: 12, textAlign: "center" }}>
          {isRegister
            ? "Crée un compte puis tu seras connecté automatiquement."
            : "Connecte-toi pour activer la gestion des alarmes et les notifications."}
        </p>
      )}
    </div>
  );
}
