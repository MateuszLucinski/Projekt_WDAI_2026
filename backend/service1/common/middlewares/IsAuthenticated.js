const jwt = require('jsonwebtoken');
const SECRET_KEY = 'your-secret-key'; // W przyszłości trzymaj to w .env

// Sprawdza, czy użytkownik jest w ogóle zalogowany
exports.authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ error: 'Brak nagłówka autoryzacji' });
  }

  const [type, token] = authHeader.split(' ');
  if (type !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Niepoprawny format tokena (użyj Bearer)' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; // Tutaj mamy id, email i isAdmin z tokena
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token nieaktywny lub wygasł' });
  }
};

// Sprawdza, czy zalogowany użytkownik ma rangę admina
exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin === true) {
    next();
  } else {
    res.status(403).json({ error: 'Wymagane uprawnienia administratora' });
  }
};