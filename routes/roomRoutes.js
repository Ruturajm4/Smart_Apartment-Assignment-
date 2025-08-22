const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/roomController");

router.get("/", ctrl.list);
router.get("/:id", ctrl.get);
router.post("/", ctrl.create);
router.put("/:id", ctrl.update);
router.delete("/:id", ctrl.remove);

// nested helper: sensors by room
router.get("/:id/sensors", ctrl.sensors);

module.exports = router;
