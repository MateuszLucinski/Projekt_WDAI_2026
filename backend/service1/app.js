require('dotenv').config();
const express = require("express");
const cors = require('cors');
const sequelize = require("./common/database");
const { check } = require("./common/middlewares/IsAuthenticated");
const bookController = require("./controllers/bookController");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/books', bookController.getAll);
app.get('/api/books/:id', bookController.getOne);

app.post('/api/books', check, bookController.create);
app.delete('/api/books/:id', check, bookController.delete);


app.get("/status", (req, res) => {
  res.json({ status: "OK", service: "BookService" });
});


sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Service 1 (Books) działa na porcie ${PORT}`);
  });
}).catch(err => {
  console.error("Błąd bazy danych:", err);
});