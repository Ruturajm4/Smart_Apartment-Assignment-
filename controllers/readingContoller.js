const Reading = require("../models/reading");
const Sensor = require("../models/sensor");
const { Op } = require("sequelize");

// Basic list with filters: room, sensor_id, from, to
exports.list = async (req, res) => {
  const { room, sensor_id, from, to, limit = 500 } = req.query;
  const where = {};
  if (room) where.room = room;
  if (sensor_id) where.sensor_id = Number(sensor_id);
  if (from || to) {
    where.timestamp = {};
    if (from) where.timestamp[Op.gte] = new Date(from);
    if (to) where.timestamp[Op.lte] = new Date(to);
  }

  const rows = await Reading.findAll({
    where,
    order: [["timestamp", "DESC"]],
    limit: Number(limit)
  });
  res.json(rows);
};

// Today stats for a room
exports.todayStats = async (req, res) => {
  const { room } = req.params;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const now = new Date();

  // Using raw SQL for concise aggregates
  const [stats] = await Reading.sequelize.query(
    `
    WITH filt AS (
      SELECT * FROM apartment_environment
      WHERE room = $1 AND timestamp BETWEEN $2 AND $3
    )
    SELECT
      MIN(temperature) AS temp_min,
      MAX(temperature) AS temp_max,
      AVG(temperature) AS temp_avg,
      MIN(humidity)    AS hum_min,
      MAX(humidity)    AS hum_max,
      AVG(humidity)    AS hum_avg
    FROM filt;
    `,
    { bind: [room, today, now], type: Reading.sequelize.QueryTypes.SELECT }
  );

  res.json(stats);
};
