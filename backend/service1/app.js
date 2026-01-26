const express = require("express");
const app = express();

const sequelize = require("./common/database");
const defineBook = require("./common/models/Books");
const { where } = require("sequelize");
const  check  = require("./common/middlewares/IsAuthenticated");
const Book = defineBook(sequelize);

const cors = require("cors");
app.use(cors());

app.use(express.json());
const PORT = process.env.PORT || 3001;

app.get("/status", (req, res) => {
  res.json({ status: "Running", timestamp: new Date().toISOString() });
});

app.get("/api/books", async (req, res) => {
  try {
    const books = await Book.findAll();
    res.json(books);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Błąd podczas pobierania książek" });
  }
});

app.get("/api/books/:bookId", async (req, res) => {
  try {
    const { bookId } = req.params;

    const foundBook = await Book.findByPk(bookId);
    if (!foundBook) {
      return res.status(404).json({ error: "Książka nie znaleziona" });
    }
    res.json(foundBook);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Błąd podczas pobierania książek" });
  }
});

app.post("/api/books", check.authenticate, async (req, res) => {
  try {
    const { title, author, year } = req.body;

    if (!title || !author || !year) {
      return res.status(400).json({ error: "Brak wymaganych danych" });
    }
    const [book, created] = await Book.findOrCreate({
      where: { title, author },
      defaults: { year },
    });

    if (!created) {
      return res.status(409).json({ error: "Książka już istnieje w bazie" });
    }
    res.status(201).json({ id: book.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Błąd podczas dodawania książek" });
  }
});

app.delete("/api/books/:bookId", check.authenticate, check.isAdmin, async (req, res) => {
  try {
    const { bookId } = req.params;

    const destroyedBook = await Book.destroy({
      where: { id: bookId },
    });
    if (!destroyedBook) {
      return res.status(404).json({ error: "Książka nie znaleziona" });
    }
    res.json({ "Usunięto książkę": bookId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Błąd podczas usuwania książek" });
  }
});

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Product service is currently running on port ${PORT}`);
  });
});
