const express = require("express");
const logLevelController = require("../../controllers/logLevel.controller");

const router = express.Router();

router.route("/:level").put(logLevelController.updateLogLevel);

module.exports = router;
