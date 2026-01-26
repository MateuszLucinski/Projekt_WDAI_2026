const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

const UserModel = {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  isAdmin: { type: DataTypes.BOOLEAN, defaultValue: false },
  userStarReview: { type: DataTypes.INTEGER, allowNull: true }, 
  userContentReview: { type: DataTypes.TEXT, allowNull: true }
};

module.exports = (sequelize) => {
  const User = sequelize.define('user', UserModel);

  User.beforeCreate(async (user) => {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  });

  User.beforeUpdate(async (user) => {
    if (user.changed('password')) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    }
  });

  return User;
};