// service3/app.js

const express = require("express");
const app = express();

const sequelize = require("./common/database");
const defineUser = require("./common/models/User");
const { where } = require("sequelize");
const User = defineUser(sequelize);

const cors = require("cors");
app.use(cors());

app.use(express.json());
const PORT = process.env.PORT || 3003;

app.get("/status", (req, res) => {
  res.json({ status: "Running", timestamp: new Date().toISOString() });
});

app.post("/api/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Brak wymaganych danych" });
    }


    const [user, created] = await User.findOrCreate({
      where: { email },
      defaults: { password: hashedPassword },
    });

    if (!created) {
      return res
        .status(409)
        .json({ error: "Uzytkownik o podanym adresie już istnieje w bazie" });
    }
    res.status(201).json({ id: user.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Błąd podczas dodawania użytkowników" });
  }
});

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const generateAccessToken = (email, userId) =>
  jwt.sign({ email, userId }, "your-secret-key", { expiresIn: "24h" });

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Brak wymaganych danych" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Niepoprawne dane logowania" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Niepoprawne dane logowania" });
    }

    const accessToken = generateAccessToken(user.email, user.id);
    res.json({ token: accessToken , user:{email: user.email, id:user.id}});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Błąd podczas logowania" });
  }
});

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Product service is currently running on port ${PORT}`);
  });
});
