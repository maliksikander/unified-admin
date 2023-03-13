const express = require('express');
const router = express.Router();
const healthController = require('../../controllers/healthCheck.controller');

router.get('/', healthController.getHealth);

module.exports = router;