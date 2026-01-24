import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface User {
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
    const tryingUser: User = { email: email, password: password1 };

    //login
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
        // Use AuthContext to update global state
        login(data.token, data.user);

        setEmail("");
        setPassword1("");
        setMessage("Zalogowane poprawnie");
        console.log("Zalogowano:", data);

        // Redirect to homepage or previous protected route
        setTimeout(() => navigate("/"), 500);
      })
      .catch((error) => {
        setMessage(error.message);
        console.error("Error:", error);
      });
  };

  return (
    <>
      <form onSubmit={(e) => handleSubmit(e)}>
        <label>
          Podaj email:{" "}
          <input
            type="text"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          Podaj haslo:{" "}
          <input
            type="password"
            required
            value={password1}
            onChange={(e) => setPassword1(e.target.value)}
          />
        </label>
        <Link to="/register">Nie masz konta?</Link>
        {message}
        <input type="submit" value={"Zaloguj się"} />
      </form>
    </>
  );
}

export default Login;
