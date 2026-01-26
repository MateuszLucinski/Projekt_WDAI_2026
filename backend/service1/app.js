//service1

require('dotenv').config();
const express = require("express");
const cors = require('cors');
const sequelize = require("./common/database");
const  check  = require("./common/middlewares/IsAuthenticated");
const itemController = require("./controllers/itemController");

const app = express();
const PORT = process.env.PORT || 3001;


app.use(cors());
app.use(express.json());

app.get('/api/items', itemController.getAll);
app.get('/api/items/:id', itemController.getOne);

app.post('/api/items', check.authenticate , check.isAdmin, itemController.create);
app.delete('/api/items/:id', check.authenticate, check.isAdmin, itemController.delete);


app.get("/status", (req, res) => {
  res.json({ status: "OK", service: "ItemService" });
});


sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Service 1 (Items) działa na porcie ${PORT}`);
  });
}).catch(err => {
  console.error("Błąd bazy danych:", err);
});