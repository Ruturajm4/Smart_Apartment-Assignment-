require("dotenv").config();
const sequelize = require("../config/database");
const Room = require("../models/room");
const Sensor = require("../models/sensor");
const Reading = require("../models/reading");

const TEMP_MIN = Number(process.env.TEMP_MIN || 22.5);
const TEMP_MAX = Number(process.env.TEMP_MAX || 35.0);
const HUM_MIN  = Number(process.env.HUM_MIN  || 30.0);
const HUM_MAX  = Number(process.env.HUM_MAX  || 70.0);
const TICK_MS  = Number(process.env.TICK_MS  || 5000);

const pick = (min, max) =>
  Number((Math.random() * (max - min) + min).toFixed(2));

async function simulateOnce() {
  // Ensure DB ready and models loaded
  await sequelize.authenticate();

  // Pull Room 1 & Room 2 (per requirement)
  const rooms = await Room.findAll({ where: { name: ["Room 1", "Room 2"] } });
  if (rooms.length === 0) {
    console.log("[sim] No rooms named 'Room 1'/'Room 2' yet. Skip.");
    return;
  }
  const roomIds = rooms.map((r) => r.id);
  const byId = Object.fromEntries(rooms.map((r) => [r.id, r]));

  const sensors = await Sensor.findAll({ where: { room_id: roomIds } });
  if (!sensors.length) {
    console.log("[sim] No sensors under Room 1/2 yet. Skip.");
    return;
  }

  const now = new Date();

  const payloads = sensors.map((s) => {
    const roomName = byId[s.room_id].name;
    if (s.type === "temperature") {
      return {
        room: roomName,
        sensor: s.label || `Sensor ${s.id}`,
        sensor_id: s.id,
        timestamp: now,
        temperature: pick(TEMP_MIN, TEMP_MAX),
        humidity: null
      };
    }
    return {
      room: roomName,
      sensor: s.label || `Sensor ${s.id}`,
      sensor_id: s.id,
      timestamp: now,
      temperature: null,
      humidity: pick(HUM_MIN, HUM_MAX)
    };
  });

  await Reading.bulkCreate(payloads);
  console.log(`[sim] inserted ${payloads.length} readings @ ${now.toISOString()}`);
}

(async function main() {
  // Ensure tables exist before sim starts
  await sequelize.sync({ alter: true });
  console.log("✅ DB synced for simulator");
  console.log(`▶️  Simulator running every ${TICK_MS}ms ...`);

  setInterval(() => {
    simulateOnce().catch((e) => console.error("[sim]", e));
  }, TICK_MS);
})();
