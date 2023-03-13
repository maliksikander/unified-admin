const express = require('express');
const router = express.Router();
const validate = require('../../middlewares/validate');
const formsValidation = require('../../validations/forms.validation');
const formsController = require('../../controllers/forms.controller');

router.get('/', formsController.getForms);

router.get('/:formID', formsController.getFormByID);

router.put('/', validate(formsValidation.updateForm), formsController.updateForm);

router.post('/', validate(formsValidation.createForm), formsController.createForm);

router.delete('/:formID', formsController.deleteForm);



module.exports = router;