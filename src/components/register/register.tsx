import { useState, useMemo } from "react";

interface User {
  email: string;
  password: string;
}

function Register() {
  const emailPattern =
    /^[a-zA-Z0-9._%+\-ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]+@[a-zA-Z0-9.\-ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]+\.[a-zA-Z]{2,}$/;

  const passwordPattern =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=[\]{};:'",.<>?/\\|`~]).{8,}$/;

  const [email, setEmail] = useState<string>("");
  const [password1, setPassword1] = useState<string>("");
  const [password2, setPassword2] = useState<string>("");
  const [resultMessage, setResultMessage] = useState<string>("");

  // Walidacja formularza
  const { message, isValid } = useMemo(() => {
    if (email === "" || password1 === "" || password2 === "") {
      return { message: "Podaj wszystkie wymagane dane", isValid: false };
    }
    if (!emailPattern.test(email)) {
      return { message: "Niepoprawny adres Email", isValid: false };
    }
    if (password1 !== password2) {
      return { message: "Hasła nie są zgodne", isValid: false };
    }
    if (!passwordPattern.test(password1)) {
      return {
        message:
          "Hasło musi mieć min. 8 znaków, 1 dużą literę, 1 cyfrę i 1 znak specjalny",
        isValid: false,
      };
    }
    return { message: "", isValid: true };
  }, [email, password1, password2]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    const tryingUser: User = { email, password: password1 };

    try {
      const response = await fetch("http://localhost:3003/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tryingUser),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Błąd rejestracji");
      }

      const data = await response.json();
      setEmail("");
      setPassword1("");
      setPassword2("");
      setResultMessage("Zarejestrowano użytkownika");
      console.log("Zarejestrowano:", data);
    } catch (error) {
      setResultMessage("Błąd dodawania użytkownika");
      console.error("Error:", error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label>
          Podaj email:{" "}
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label>
          Podaj hasło:{" "}
          <input
            type="password"
            value={password1}
            onChange={(e) => setPassword1(e.target.value)}
          />
        </label>

        <label>
          Powtórz hasło:{" "}
          <input
            type="password"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
          />
        </label>

        {message && <p style={{ color: "red" }}>{message}</p>}
        {resultMessage && <p>{resultMessage}</p>}

        <input type="submit" disabled={!isValid} value="Zarejestruj się" />
      </form>
    </>
  );
}

export default Register;
