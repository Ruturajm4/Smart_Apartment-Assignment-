const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Room = require("./room");

const Sensor = sequelize.define(
  "Sensor",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    type: {
      type: DataTypes.ENUM("temperature", "humidity"),
      allowNull: false
    },
    label: { type: DataTypes.STRING(50), allowNull: true },
    room_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "rooms",
        key: "id"
      },
      onDelete: "CASCADE"
    }
  },
  { tableName: "sensors", timestamps: false }
);

// Associations
Room.hasMany(Sensor, { foreignKey: "room_id", onDelete: "CASCADE" });
Sensor.belongsTo(Room, { foreignKey: "room_id" });

module.exports = Sensor;
