const Sensor = require("../models/sensor");
const Room = require("../models/room");
const Reading = require("../models/reading");

exports.list = async (req, res) => {
  const { roomId } = req.query;
  const where = roomId ? { room_id: Number(roomId) } : undefined;
  const sensors = await Sensor.findAll({
    where,
    include: [{ model: Room }],
    order: [["id", "ASC"]]
  });
  res.json(sensors);
};

exports.get = async (req, res) => {
  const sensor = await Sensor.findByPk(req.params.id, { include: [Room] });
  if (!sensor) return res.status(404).json({ message: "Sensor not found" });
  res.json(sensor);
};

exports.create = async (req, res) => {
  const { room_id, type, label } = req.body;
  if (!room_id || !type)
    return res.status(400).json({ message: "room_id and type are required" });

  // validate type
  if (!["temperature", "humidity"].includes(type))
    return res.status(400).json({ message: "type must be temperature|humidity" });

  const exists = await Room.findByPk(room_id);
  if (!exists) return res.status(400).json({ message: "room_id invalid" });

  const created = await Sensor.create({ room_id, type, label: label || null });
  res.status(201).json(created);
};

exports.update = async (req, res) => {
  const { room_id, type, label } = req.body;
  const sensor = await Sensor.findByPk(req.params.id);
  if (!sensor) return res.status(404).json({ message: "Sensor not found" });

  if (room_id) {
    const exists = await Room.findByPk(room_id);
    if (!exists) return res.status(400).json({ message: "room_id invalid" });
    sensor.room_id = room_id;
  }
  if (type) {
    if (!["temperature", "humidity"].includes(type))
      return res.status(400).json({ message: "type must be temperature|humidity" });
    sensor.type = type;
  }
  if (label !== undefined) sensor.label = label;

  await sensor.save();
  res.json(sensor);
};

exports.remove = async (req, res) => {
  const sensor = await Sensor.findByPk(req.params.id);
  if (!sensor) return res.status(404).json({ message: "Sensor not found" });

  // Remove readings for this sensor
  await Reading.destroy({ where: { sensor_id: sensor.id } });
  await sensor.destroy();
  res.status(204).send();
};
