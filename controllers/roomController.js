const Room = require("../models/room");
const Sensor = require("../models/sensor");

exports.list = async (req, res) => {
  const rooms = await Room.findAll({ order: [["id", "ASC"]] });
  res.json(rooms);
};

exports.get = async (req, res) => {
  const room = await Room.findByPk(req.params.id);
  if (!room) return res.status(404).json({ message: "Room not found" });
  res.json(room);
};

exports.create = async (req, res) => {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ message: "name is required" });
  const created = await Room.create({ name, description: description || null });
  res.status(201).json(created);
};

exports.update = async (req, res) => {
  const { name, description } = req.body;
  const room = await Room.findByPk(req.params.id);
  if (!room) return res.status(404).json({ message: "Room not found" });

  room.name = name ?? room.name;
  room.description = description ?? room.description;
  await room.save();
  res.json(room);
};

exports.remove = async (req, res) => {
  // Deleting a room cascades sensors due to FK
  const room = await Room.findByPk(req.params.id);
  if (!room) return res.status(404).json({ message: "Room not found" });

  await room.destroy();
  res.status(204).send();
};

exports.sensors = async (req, res) => {
  // List sensors in a room
  const roomId = req.params.id;
  const sensors = await Sensor.findAll({
    where: { room_id: roomId },
    order: [["id", "ASC"]]
  });
  res.json(sensors);
};
