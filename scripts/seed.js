require("dotenv").config();
const sequelize = require("../config/database");
const Room = require("../models/room");
const Sensor = require("../models/sensor");

(async function seed() {
  try {
    await sequelize.sync({ alter: true });

    // Upsert Rooms
    const [r1] = await Room.findOrCreate({
      where: { name: "Room 1" },
      defaults: { description: "Living room" }
    });
    const [r2] = await Room.findOrCreate({
      where: { name: "Room 2" },
      defaults: { description: "Bedroom" }
    });

    // Ensure at least one temp & humidity per room
    const ensureSensors = async (room, roomName) => {
      await Sensor.findOrCreate({
        where: { room_id: room.id, type: "temperature", label: `Temp Sensor ${roomName}-A` },
        defaults: { room_id: room.id, type: "temperature", label: `Temp Sensor ${roomName}-A` }
      });
      await Sensor.findOrCreate({
        where: { room_id: room.id, type: "humidity", label: `Humidity Sensor ${roomName}-A` },
        defaults: { room_id: room.id, type: "humidity", label: `Humidity Sensor ${roomName}-A` }
      });
    };

    await ensureSensors(r1, "R1");
    await ensureSensors(r2, "R2");

    console.log("✅ Seed complete");
    process.exit(0);
  } catch (e) {
    console.error("❌ Seed failed", e);
    process.exit(1);
  }
})();
