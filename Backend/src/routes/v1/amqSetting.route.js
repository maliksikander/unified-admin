const express = require('express');

const router = express.Router();
const validate = require('../../middlewares/validate');
const amqValidation = require('../../validations/amqSetting.validation');
const amqSettingController = require('../../controllers/amqSetting.controller');

const app = express();
const keycloak_init = require('../../config/keycloak.config').initKeycloak();
app.use(keycloak_init.middleware());
const keycloak = require('../../config/keycloak.config').getKeycloak();

router.get('/', amqSettingController.getSettings);
router.put('/', validate(amqValidation.updateSetting), amqSettingController.updateSettings);
router.post('/', validate(amqValidation.createSetting), amqSettingController.createSettings);

module.exports = router;
