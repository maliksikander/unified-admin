const express = require('express');
const router = express.Router();
const validate = require('../../middlewares/validate');
const reasonValidation = require('../../validations/reason.validation');
const reasonController = require('../../controllers/reason.controller');


router.get('/', reasonController.getReasons);

router.get('/:reasonID', reasonController.getReasonByID);

router.put('/:reasonID', validate(reasonValidation.updateReason), reasonController.updateReason);

router.post('/', validate(reasonValidation.createReason), reasonController.createReason);

router.delete('/:reasonID', reasonController.deleteReason);

module.exports = router;