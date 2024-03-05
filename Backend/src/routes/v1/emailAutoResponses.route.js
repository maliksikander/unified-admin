const express = require('express');
const router = express.Router();
const validate = require('../../middlewares/validate');
const emailAutoResponsesValidation = require('../../validations/emailResponses.validation');
const emailAutoResponsesController = require('../../controllers/emailAutoResponses.controller');

router.get('/', emailAutoResponsesController.getAutoResponses);

router.get('/:signatureId', emailAutoResponsesController.getResponsesByID);

router.put('/:signatureId', validate(emailAutoResponsesValidation.updateEmailSignature), emailAutoResponsesController.updateResponse);

router.post('/', validate(emailAutoResponsesValidation.createEmailSignature), emailAutoResponsesController.createResponse);

router.delete('/:signatureId', emailAutoResponsesController.deleteResponse);


module.exports = router;