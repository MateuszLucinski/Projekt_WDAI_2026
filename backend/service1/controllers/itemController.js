const Item = require("../common/models/Items");

exports.getAll = async (req, res) => {
  try {
    const items = await Item.findAll();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "Błąd serwera" });
  }
};

exports.getOne = async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    if (!item)
      return res.status(404).json({ error: "Nie znaleziono produktu" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: "Błąd serwera" });
  }
};

exports.create = async (req, res) => {
  try {
    const { title, description, price, stock, image } = req.body;
    if (!title || !price)
      return res.status(400).json({ error: "Brak tytułu lub ceny" });

    const newItem = await Item.create({
      title,
      description,
      price,
      stock,
      image,
    });
    res.status(201).json(newItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Nie udało się dodać" });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await Item.destroy({ where: { id: req.params.id } });
    if (!deleted)
      return res.status(404).json({ error: "Produkt nie istnieje" });
    res.json({ message: "Usunięto" });
  } catch (err) {
    res.status(500).json({ error: "Błąd usuwania" });
  }
};