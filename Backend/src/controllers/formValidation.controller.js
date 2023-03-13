const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { formValidationService } = require('../services');
const logger = require('../config/logger');
const { v4: uuidv4 } = require("uuid");

const getFormValidation = catchAsync(async (req, res) => {
    const coId = req.header("correlationId".toLowerCase()) ? req.header("correlationId".toLowerCase()) : uuidv4();
    res.setHeader("correlationId", coId);
    let result = await formValidationService.getFormValidation(coId);
    try {
        logger.info(`Get form validation`, { className: "formValidation.controller", methodName: "getFormValidation"});
        logger.debug(`[REQUEST] : %o` + req, { className: "formValidation.controller", methodName: "getFormValidation"});
        result.forEach((item) => {
            item.regex = decodeURI(item.regex)
        });
        res.send(result);
    }
    catch (e) {
        logger.error(`[ERROR] on get form validation : %o` + e, { className: "formValidation.controller", methodName: "getFormValidation"});
        res.send(e);
    }

});

const createFormValidation = catchAsync(async (req, res) => {
  const coId = req.header("correlationId".toLowerCase()) ? req.header("correlationId".toLowerCase()) : uuidv4();
  res.setHeader("correlationId", coId);
  try {
    logger.info(`Create form validation`, { className: "formValidation.controller", methodName: "createFormValidation", CID: coId });
    logger.debug(`[REQUEST] : %o` + req.body, { className: "formValidation.controller", methodName: "createFormValidation", CID: coId });

    const result = await formValidationService.createFormValidation(req.body, coId);
    res.send(result);
  } catch (error) {
    logger.error(`[ERROR] on create form validation: %o` + error, { className: "formValidation.controller", methodName: "createFormValidation", CID: coId });
  } 
});

const updateFormValidation = catchAsync(async (req, res) => {
  const coId = req.header("correlationId".toLowerCase()) ? req.header("correlationId".toLowerCase()) : uuidv4();
  res.setHeader("correlationId", coId);
  try {
    logger.info(`Update form validation`, { className: "formValidation.controller", methodName: "updateFormValidation", CID: coId });
    logger.debug(`[REQUEST] : %o` + req.body, { className: "formValidation.controller", methodName: "updateFormValidation", CID: coId });

    const result = await formValidationService.updateFormValidation(req.body, coId);
    res.send(result);
  } catch (error) {
    logger.error(`[ERROR] on update form validation: %o` + error, { className: "formValidation.controller", methodName: "updateFormValidation", CID: coId });
  } 
});

const deleteFormValidation = catchAsync(async (req, res) => {
    
    const response = {
        code: "Deleted",
        message: "Deleted Successfully",
    };
    const id = req.params.formID;
    const result = await formValidationService.deleteFormValidation(id);
    if (result._id) {
        logger.info(`${response.message}`, { className: "formValidation.controller", methodName: "deleteFormValidation" });
        logger.debug(`[REQUEST] : %o` + response, { className: "formValidation.controller", methodName: "deleteFormValidation"});
        res.send(response);
    }
    else {
        logger.info(`${response.message}`, { className: "formValidation.controller", methodName: "deleteFormValidation", CID: coId });
        logger.debug(`[REQUEST] : %o` + response, { className: "formValidation.controller", methodName: "deleteFormValidation"});
        res.send(result);
    }
});

module.exports = {
    getFormValidation,
    createFormValidation,
    updateFormValidation,
    deleteFormValidation
};
