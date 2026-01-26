const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const Item = sequelize.define("item", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  price: { type: DataTypes.REAL, allowNull: false },
  stock: { type: DataTypes.INTEGER, defaultValue: 0 },
  image: { type: DataTypes.STRING, allowNull: true },
  category: { type: DataTypes.STRING, allowNull: false },
});

module.exports = Item;