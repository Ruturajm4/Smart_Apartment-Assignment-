const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Room = sequelize.define(
  "Room",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    description: { type: DataTypes.TEXT }
  },
  {
    tableName: "rooms",
    timestamps: false
  }
);

module.exports = Room;
