const { DataTypes } = require('sequelize');

const OrdersModel = {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER, allowNull: false},
  bookId: { type: DataTypes.INTEGER, allowNull: false},
  quantity: { type: DataTypes.INTEGER, allowNull: false}
};

module.exports = (sequelize) => sequelize.define('orders', OrdersModel);