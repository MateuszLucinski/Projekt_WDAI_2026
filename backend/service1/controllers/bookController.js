const Book = require("../common/models/Books");

exports.getAll = async (req, res) => {
  try {
    const books = await Book.findAll();
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: "Błąd serwera" });
  }
};

exports.getOne = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book)
      return res.status(404).json({ error: "Nie znaleziono produktu" });
    res.json(book);
  } catch (err) {
    res.status(500).json({ error: "Błąd serwera" });
  }
};

exports.create = async (req, res) => {
  try {
    const { title, description, price, stock, image } = req.body;
    if (!title || !price)
      return res.status(400).json({ error: "Brak tytułu lub ceny" });

    const newBook = await Book.create({
      title,
      description,
      price,
      stock,
      image,
    });
    res.status(201).json(newBook);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Nie udało się dodać" });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await Book.destroy({ where: { id: req.params.id } });
    if (!deleted)
      return res.status(404).json({ error: "Produkt nie istnieje" });
    res.json({ message: "Usunięto" });
  } catch (err) {
    res.status(500).json({ error: "Błąd usuwania" });
  }
};
