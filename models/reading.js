const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Sensor = require("./sensor");
const Room = require("./room");

/**
 * apartment_environment table
 * - Denormalized columns `room`, `sensor` for easier Grafana queries
 * - `sensor_id` FK for joins / integrity
 */
const Reading = sequelize.define(
  "Reading",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    room: { type: DataTypes.STRING(50), allowNull: false },
    sensor: { type: DataTypes.STRING(50), allowNull: true },
    timestamp: { type: DataTypes.DATE, allowNull: false },
    temperature: { type: DataTypes.DECIMAL(5, 2), allowNull: true },
    humidity: { type: DataTypes.DECIMAL(5, 2), allowNull: true }
  },
  { tableName: "apartment_environment", timestamps: false }
);

// FK
Sensor.hasMany(Reading, { foreignKey: "sensor_id", onDelete: "SET NULL" });
Reading.belongsTo(Sensor, { foreignKey: "sensor_id" });

module.exports = Reading;
