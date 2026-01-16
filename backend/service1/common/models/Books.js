const { DataTypes } = require("sequelize");

const BookModel = {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  author: { type: DataTypes.STRING, allowNull: false },
  year: { type: DataTypes.DATE, allowNull: false },
};

module.exports = (sequelize) => sequelize.define('book', BookModel);