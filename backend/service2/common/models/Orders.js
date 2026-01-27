const { DataTypes } = require('sequelize');

const OrdersModel = {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER, allowNull: false},
  itemId: { type: DataTypes.INTEGER, allowNull: false},
  quantity: { type: DataTypes.INTEGER, allowNull: false},
  reviewStars : { type: DataTypes.INTEGER, allowNull: true},
  reviewContent: { type: DataTypes.STRING, allowNull: true}
};

module.exports = (sequelize) => sequelize.define('orders', OrdersModel);