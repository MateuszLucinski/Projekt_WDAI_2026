//service2

const express = require("express");
const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3002;

const sequelize = require("./common/database");
const defineOrder = require("./common/models/Orders");
const { where } = require("sequelize");
const  check  = require("./common/middlewares/IsAuthenticated");
const Order = defineOrder(sequelize);

const cors = require("cors");
app.use(cors());

app.get("/status", (req, res) => {
  res.json({
    status: "Running",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/orders/:userId", check.authenticate, async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.findAll({ where: { userId } });

    if (orders.length === 0) {
      return res.status(404).json("Nie znaleziono zamówień");
    }

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Błąd podczas pobierania zamówień" });
  }
});

app.post("/api/orders", check.authenticate, async (req, res) => {
  try {
    const { userId, itemId, quantity } = req.body;

    if (!userId || !itemId || !quantity) {
      return res.status(400).json({ error: "Brak wymaganych danych" });
    }

    // const response = await fetch(`http://localhost:3001/api/items/${itemId}`);
    // if (!response.ok) {
    //   return res.status(404).json({ error: "Produkt nie istnieje" });
    // }

    const order = await Order.create({
      userId,
      itemId,
      quantity,
    });

    res.status(201).json({ id: order.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Błąd podczas dodawania zamówień" });
  }
});

app.delete("/api/orders/:orderId", check.authenticate, async (req, res) => {
  try {
    const { orderId } = req.params;

    const destroyedOrder = await Order.destroy({
      where: { id: orderId },
    });
    if (!destroyedOrder) {
      return res.status(404).json({ error: "Zamówienie nie znalezione" });
    }
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Błąd podczas usuwania zamówień" });
  }
});

app.patch("/api/orders/:orderId", check.authenticate, async (req, res) => {
  try {
    const orderIdInt = parseInt(req.params.orderId, 10);
    const { quantity } = req.body;

    const order = await Order.findByPk(orderIdInt);
    if (!order) {
      return res.status(404).json({ error: "Zamówienie nie znalezione" });
    }

    order.quantity = quantity;
    await order.save();

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Błąd podczas aktualizacji zamówienia" });
  }
});

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Product service is currently running on port ${PORT}`);
  });
});
