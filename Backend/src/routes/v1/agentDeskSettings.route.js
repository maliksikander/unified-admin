const express = require('express');
const router = express.Router();
const validate = require('../../middlewares/validate');
const agentDeskSettingsValidation = require('../../validations/agentDeskSettings.validation');
const agentDeskSettingsController = require('../../controllers/agentDeskSettings.controller');

router.get('/', agentDeskSettingsController.getSettings);
router.put('/', validate(agentDeskSettingsValidation.updateSetting), agentDeskSettingsController.updateSettings);




module.exports = router;