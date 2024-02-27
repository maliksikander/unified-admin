const express = require('express');
const router = express.Router();
const validate = require('../../middlewares/validate');
const emailSignatureValidation = require('../../validations/emailSignatures.validation');
const emailSignaturesController = require('../../controllers/emailSignatures.controller');

router.get('/', emailSignaturesController.getSignatures);

router.get('/:signatureId', emailSignaturesController.getSignatureByID);

router.put('/:signatureId', validate(emailSignatureValidation.updateEmailSignature), emailSignaturesController.updateSignature);

router.post('/', validate(emailSignatureValidation.createEmailSignature), emailSignaturesController.createSignature);

router.delete('/:signatureId', emailSignaturesController.deleteSignature);


module.exports = router;