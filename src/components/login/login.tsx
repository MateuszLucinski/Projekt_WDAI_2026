import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface LoginCredentials {
  email: string;
  password: string;
}

function Login() {
  const [email, setEmail] = useState<string>("");
  const [password1, setPassword1] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tryingUser: LoginCredentials = { email: email, password: password1 };

    fetch("http://localhost:3003/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tryingUser),
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Błąd logowania");
        }
        return response.json();
      })
      .then((data) => {

        login(data.token, data.user);

        setMessage("Zalogowano poprawnie!");
        
        // Opcjonalnie: przekieruj użytkownika po zalogowaniu
        setTimeout(() => navigate("/account"), 1000); 
      })
      .catch((error) => {
        setMessage(error.message);
        console.error("Error:", error);
      });
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <h3>Logowanie</h3>
        <label>
          Email:{" "}
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <br />
        <label>
          Hasło:{" "}
          <input
            type="password"
            required
            value={password1}
            onChange={(e) => setPassword1(e.target.value)}
          />
        </label>
        <br />
        <div style={{ margin: "10px 0" }}>
          <Link to="/register">Nie masz konta? Zarejestruj się</Link>
        </div>
        {message && <p className="auth-message">{message}</p>}
        <input type="submit" value="Zaloguj się" />
      </form>
    </div>
  );
}

export default Login;