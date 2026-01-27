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


const { Op, fn, col } = require("sequelize");

/**
 * GET all reviews + stats for item + user email
 */
app.get("/api/items/:itemId/reviews", async (req, res) => {
  try {
    const { itemId } = req.params;

    // pobranie opinii
    const reviews = await Order.findAll({
      where: {
        itemId,
        reviewStars: { [Op.not]: null },
      },
      attributes: ["id", "userId", "reviewStars", "reviewContent", "createdAt"],
    });

    if (reviews.length === 0) {
      return res.status(404).json({
        message: "Brak opinii dla tego produktu",
        reviewsCount: 0,
        averageRating: null,
        reviews: [],
      });
    }

    // agregaty
    const stats = await Order.findOne({
      where: {
        itemId,
        reviewStars: { [Op.not]: null },
      },
      attributes: [
        [fn("AVG", col("reviewStars")), "averageRating"],
        [fn("COUNT", col("reviewStars")), "reviewsCount"],
      ],
      raw: true,
    });

    // pobranie emaili dla wszystkich userId
    const mappedReviews = await Promise.all(
      reviews.map(async (r) => {
        let userEmail = "Anonim";
        try {
          const response = await fetch(`http://localhost:3003/api/users/${r.userId}/email`);
          if (response.ok) {
            const data = await response.json();
            userEmail = data.email || "Anonim";
          }
        } catch (err) {
          console.error(`Nie udało się pobrać emaila dla userId=${r.userId}`, err);
        }

        return {
          id: r.id,
          userId: r.userId,
          userEmail,
          reviewStars: r.reviewStars,
          reviewContent: r.reviewContent,
          createdAt: r.createdAt,
        };
      })
    );

    res.json({
      itemId: Number(itemId),
      reviewsCount: Number(stats.reviewsCount),
      averageRating: Number(Number(stats.averageRating).toFixed(2)),
      reviews: mappedReviews,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Błąd podczas pobierania opinii o produkcie",
    });
  }
});





app.post("/api/orders", check.authenticate, async (req, res) => {
  try {
    const { userId, itemId, quantity } = req.body;

    if (!userId || !itemId || !quantity) {
      return res.status(400).json({ error: "Brak wymaganych danych" });
    }

    const response = await fetch(`http://localhost:3001/api/items/${itemId}`);
    if (!response.ok) {
      return res.status(404).json({ error: "Produkt nie istnieje" });
    }
    if (response.quantity<quantity) {
      return res.status(404).json({ error: "Za małą ilość produktu w magazynie" });
    }

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


/**
 * ADD review to order
 */
app.post(
  "/api/orders/:orderId/review",
  check.authenticate,
  async (req, res) => {
    try {
      const orderId = parseInt(req.params.orderId, 10);
      const { reviewStars, reviewContent } = req.body;

      if (!reviewStars || reviewStars < 1 || reviewStars > 5) {
        return res.status(400).json({
          error: "Ocena musi być liczbą od 1 do 5",
        });
      }

      const order = await Order.findByPk(orderId);

      if (!order) {
        return res.status(404).json({
          error: "Zamówienie nie znalezione",
        });
      }


      if (order.userId !== req.user.userId) {
        return res.status(403).json({
          error: "Brak uprawnień do dodania opinii",
        });
      }

      if (order.reviewStars !== null) {
        return res.status(409).json({
          error: "Opinia do tego zamówienia już istnieje",
        });
      }

      order.reviewStars = reviewStars;
      order.reviewContent = reviewContent || null;

      await order.save();

      res.status(201).json({
        message: "Opinia została dodana",
        review: {
          orderId: order.id,
          itemId: order.itemId,
          reviewStars: order.reviewStars,
          reviewContent: order.reviewContent,
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        error: "Błąd podczas dodawania opinii",
      });
    }
  }
);



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
