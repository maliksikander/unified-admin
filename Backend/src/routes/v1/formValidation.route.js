const express = require('express');
const router = express.Router();
// const validate = require('../../middlewares/validate');
// const formsValidation = require('../../validations/forms.validation');
const formValidationController = require('../../controllers/formValidation.controller');


router.get('/', formValidationController.getFormValidation);




module.exports = router;