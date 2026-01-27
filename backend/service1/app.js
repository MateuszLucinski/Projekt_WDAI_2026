//sevice1

const express = require("express");
const app = express();

const sequelize = require("./common/database");
const Item = require("./common/models/Item");
const check = require("./common/middlewares/IsAuthenticated");

const cors = require("cors");
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

app.get("/status", (req, res) => {
  res.json({ status: "Running", timestamp: new Date().toISOString() });
});

/**
 * GET all items
 */
app.get("/api/items", async (req, res) => {
  try {
    const items = await Item.findAll();
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Błąd podczas pobierania produktów" });
  }
});

/**
 * GET item by ID
 */
app.get("/api/items/:itemId", async (req, res) => {
  try {
    const { itemId } = req.params;

    const item = await Item.findByPk(itemId);
    if (!item) {
      return res.status(404).json({ error: "Produkt nie znaleziony" });
    }

    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Błąd podczas pobierania produktu" });
  }
});

/**
 * CREATE item
 */
app.post("/api/items",check.authenticate, check.isAdmin, async (req, res) => {
  try {
    const { title, description, price, stock, image, category } = req.body;

    if (!title || price == null || !category) {
      return res.status(400).json({ error: "Brak wymaganych danych" });
    }

    const [item, created] = await Item.findOrCreate({
      where: { title, category },
      defaults: {
        description,
        price,
        stock,
        image,
      },
    });

    if (!created) {
      return res
        .status(409)
        .json({ error: "Produkt już istnieje w tej kategorii" });
    }

    res.status(201).json({ id: item.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Błąd podczas dodawania produktu" });
  }
});

/**
 * DELETE item
 */
app.delete(
  "/api/items/:itemId",
  check.authenticate,
  check.isAdmin,
  async (req, res) => {
    try {
      const { itemId } = req.params;

      const deleted = await Item.destroy({
        where: { id: itemId },
      });

      if (!deleted) {
        return res.status(404).json({ error: "Produkt nie znaleziony" });
      }

      res.json({ message: "Usunięto produkt", id: itemId });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Błąd podczas usuwania produktu" });
    }
  }
);

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Item service running on port ${PORT}`);
  });
});
