import { useState } from "react";
import { Link } from "react-router-dom";

interface User {
  email: string;
  password: string;
}

function Login() {
  const [email, setEmail] = useState<string>("");
  const [password1, setPassword1] = useState<string>("");
  const [message, setMessage] = useState<string>("");

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
        const session = { //informacje o zalogowaniu w localstorage
          user: data.user,
          token: data.token,
          expiresAt: Date.now() + 60 * 60 * 1000, // godzina w milisekundach
        };

        localStorage.setItem("session", JSON.stringify(session));

        setEmail("");
        setPassword1("");
        setMessage("Zalogowane poprawnie");
        console.log("Zalogowano:", data);
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
