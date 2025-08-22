const express = require("express");
const cors = require("cors");
require("dotenv").config();

const sequelize = require("./config/database");

// Models must be imported once so associations register
require("./models/room");
require("./models/sensor");
require("./models/reading");

const roomRoutes = require("./routes/roomRoutes");
const sensorRoutes = require("./routes/sensorRoutes");
const readingRoutes = require("./routes/readingRoutes");

const app = express();
app.use(express.json());
app.use(cors({ origin: (process.env.CORS_ORIGIN || "*").split(",") }));

app.get("/health", (req, res) => res.json({ ok: true }));

app.use("/api/rooms", roomRoutes);
app.use("/api/sensors", sensorRoutes);
app.use("/api/readings", readingRoutes);

const PORT = Number(process.env.PORT || 4000);

// Auto-sync DB and start server
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("✅ Database synced");
    app.listen(PORT, () => console.log(`🚀 API listening on port:${PORT}`));
  })
  .catch((e) => {
    console.error("❌ DB sync failed", e);
    process.exit(1);
  });
