const httpStatus = require('http-status');
const { FormValidationModel } = require('../models');
const ApiError = require('../utils/ApiError');
const logger = require('../config/logger');

const getFormValidation = async (coId) => {
    const result = await FormValidationModel.find();
    logger.info(`Get Form Validation`, { className: "formValidation.service", methodName: "getFormValidation" , CID: coId });
    logger.debug(`[DATA] %o` + result,  { className: "formValidation.service", methodName: "getFormValidation", CID: coId });
    return result;
};


const createFormValidation = async (reqBody, coId) => {
    const result = await FormValidationModel.create(reqBody);
    logger.info(`Create Form Validation`, { className: "formValidation.service", methodName: "createFormValidation" , CID: coId });
    logger.debug(`[DATA] %o` + result,  { className: "formValidation.service", methodName: "createFormValidation", CID: coId });
    return result;
};

const updateFormValidation = async (reqBody,coId) => {

    const id = reqBody.id;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {   //check for id format
        const result = await FormValidationModel.findById(id);
        if (!result) {
            logger.error(`[NOT_FOUND] Form not found`, { className: "formValidation.service", methodName: "updateFormValidation", CID: coId });
            throw new ApiError(httpStatus.NOT_FOUND, 'Form not found');
        }
        Object.assign(result, reqBody);
        await result.save();
        logger.info(`Update Form Validation`, { className: "formValidation.service", methodName: "updateFormValidation" , CID: coId });
        logger.debug(`[DATA] %o` + result,  { className: "formValidation.service", methodName: "updateFormValidation", CID: coId });
        return result;
    }
    else {
        logger.error(`[BAD_REQUEST] Invalid Request Parameter`, { className: "formValidation.service", methodName: "updateFormValidation", CID: coId });
        throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Request Parameter');
    }
};

const deleteFormValidation = async (id,coId) => {

    if (id.match(/^[0-9a-fA-F]{24}$/)) { //check for id format
        const result = await FormValidationModel.findByIdAndDelete(id);
        if (!result) {
            logger.error(`[NOT_FOUND] Form not found`, { className: "formValidation.service", methodName: "deleteFormValidation", CID: coId });
            throw new ApiError(httpStatus.NOT_FOUND, 'Form not found');
        }
        logger.info(`Delete Form Validation`, { className: "formValidation.service", methodName: "deleteFormValidation" , CID: coId });
        logger.debug(`[DATA] %o` + result,  { className: "formValidation.service", methodName: "deleteFormValidation", CID: coId });
        return result;
    }
    else {
        logger.error(`[BAD_REQUEST] Invalid Request Parameter`, { className: "formValidation.service", methodName: "deleteFormValidation", CID: coId });
        throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Request Parameter');
    }

};

module.exports = {
    getFormValidation,
    createFormValidation,
    updateFormValidation,
    deleteFormValidation
};
