import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Box,
  CircularProgress
} from "@mui/material";

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
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

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

    setLoading(true);
    setError(null);
    setResultMessage("");

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
      setResultMessage("Zarejestrowano użytkownika pomyślnie. Możesz się teraz zalogować.");
      console.log("Zarejestrowano:", data);
    } catch (err: any) {
      setError(err.message || "Błąd dodawania użytkownika");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '80vh' }}>
      <Paper
        elevation={6}
        sx={{
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(30, 30, 30, 0.8)', // Consistent with theme/Login
          borderRadius: 4
        }}
      >
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
            Rejestracja
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Utwórz nowe konto
          </Typography>
        </Box>

        {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}
        {resultMessage && <Alert severity="success" sx={{ width: '100%', mb: 2 }}>{resultMessage}</Alert>}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Adres Email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            error={email !== "" && !emailPattern.test(email)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Hasło"
            type="password"
            id="password"
            value={password1}
            onChange={(e) => setPassword1(e.target.value)}
            disabled={loading}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Powtórz Hasło"
            type="password"
            id="confirmPassword"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            disabled={loading}
            error={password2 !== "" && password1 !== password2}
            helperText={password2 !== "" && password1 !== password2 ? "Hasła muszą być identyczne" : ""}
          />

          {!isValid && message && (
            <Alert severity="warning" sx={{ mt: 2, width: '100%' }}>
              {message}
            </Alert>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={!isValid || loading}
            sx={{ mt: 3, mb: 2, py: 1.5, fontSize: '1.1rem' }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Utwórz konto"}
          </Button>

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Link to="/login" style={{ textDecoration: 'none', color: '#2196f3' }}>
              <Typography variant="body2">
                Masz już konto? Zaloguj się
              </Typography>
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default Register;
