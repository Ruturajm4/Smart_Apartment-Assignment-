const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/readingContoller");

router.get("/", ctrl.list);
router.get("/today-stats/:room", ctrl.todayStats);

module.exports = router;
