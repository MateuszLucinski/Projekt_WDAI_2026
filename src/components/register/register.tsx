import { useState } from "react";

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

  let message: string = "Podaj dane do rejestracji";
  if (email != "" && !emailPattern.test(email)) {
    message = "Niepoprawny adres Email";
  }

  if (!(password1 == password2)) {
    message = "Hasła nie są zgodne";
  } 

  if (password1 !== "" && !passwordPattern.test(password1)) {
    message =
      "Hasło musi mieć min. 8 znaków, 1 dużą literę, 1 cyfrę i 1 znak specjalny";
  }

  if (
    password1 == password2 &&
    password1 != "" &&
    email != "" &&
    emailPattern.test(email)
  ) {
    message = "";
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tryingUser: User = { email: email, password: password1 };

    //register the new user
    fetch("http://localhost:3003/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tryingUser),
    })
      .then(async (response) => {
        if (!response.ok) {
          // jeśli backend zwraca np. 401
          const errorData = await response.json();
          throw new Error(errorData.error || "Błąd rejestracji");
        }
        return response.json();
      })
      .then((data) => {
        setEmail("");
        setPassword1("");
        setPassword2("");
        setResultMessage("Zarejestrowane użykownika");
        console.log("Zarejestrowano:", data);
      })
      .catch((error) => {
        setResultMessage(error.message);
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
            value={password1}
            onChange={(e) => setPassword1(e.target.value)}
          />
        </label>
        <label>
          Powtórz haslo:{" "}
          <input
            type="password"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
          />
        </label>
        {message != "" && <p>{message}</p>}
        {resultMessage != "" && <p>{resultMessage}</p>}
        <input
          type="submit"
          disabled={message != ""}
          value={"Zarejestruj się"}
        />
      </form>
    </>
  );
}

export default Register;
