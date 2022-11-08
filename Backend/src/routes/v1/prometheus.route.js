const express = require("express");
const prometheusController = require("../../controllers/prometheus.controller");

const router = express.Router();

router.route("/").get(prometheusController.getDefaultMetrics);
module.exports = router;
