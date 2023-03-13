const httpStatus = require('http-status');
const { FormsModel } = require('../models');
const mongoose = require('mongoose');
const ApiError = require('../utils/ApiError');
const logger = require('../config/logger');

const getForms = async (coId) => {
    const result = await FormsModel.find();
    logger.info(`Get Forms`, { className: "forms.service", methodName: "getForms", CID: coId  });
    logger.debug(`[DATA] %o` + result,  { className: "forms.service", methodName: "getForms", CID: coId });
    return result;
};

const getForm = async (id,coId) => {

    if (id.match(/^[0-9a-fA-F]{24}$/)) { //check for id format
        const result = await FormsModel.findById(id);
        if (!result) {
            logger.error(`[NOT_FOUND] Form not found`, { className: "forms.service", methodName: "getForm", CID: coId });
            throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
        }
        logger.info(`Get Form`, { className: "forms.service", methodName: "getForm" , CID: coId });
        logger.debug(`[DATA] %o` + result,  { className: "forms.service", methodName: "getForm", CID: coId });
        return result;
    }
    else {
        logger.error(`[BAD_REQUEST] Invalid Request Parameter`, { className: "forms.service", methodName: "getForm", CID: coId });
        throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Request Parameter');
    }
};

const createForm = async (reqBody,coId) => {
    reqBody["_id"] = new mongoose.Types.ObjectId();
    const result = await FormsModel.create(reqBody);
    logger.info(`Create Form`, { className: "forms.service", methodName: "createForm" , CID: coId });
    logger.debug(`[DATA] %o` + result,  { className: "forms.service", methodName: "createForm", CID: coId });
    return result;
};

const updateForm = async (reqBody,coId) => {

    const id = reqBody.id;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {   //check for id format
        const result = await FormsModel.findById(id);
        if (!result) {
            logger.error(`[NOT_FOUND] Form not found`, { className: "forms.service", methodName: "updateForm", CID: coId });
            throw new ApiError(httpStatus.NOT_FOUND, 'Form not found');
        }
        Object.assign(result, reqBody);
        await result.save();
        logger.info(`Update Form`, { className: "forms.service", methodName: "updateForm" , CID: coId });
        logger.debug(`[DATA] %o` + result,  { className: "forms.service", methodName: "updateForm", CID: coId });
        return result;
    }
    else {
        logger.error(`[BAD_REQUEST] Invalid Request Parameter`, { className: "forms.service", methodName: "updateForm", CID: coId });
        throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Request Parameter');
    }
};

const deleteForm = async (id , coId) => {

    if (id.match(/^[0-9a-fA-F]{24}$/)) { //check for id format
        const result = await FormsModel.findByIdAndDelete(id);
        if (!result) {
            logger.error(`[NOT_FOUND] Form not found`, { className: "forms.service", methodName: "deleteForm", CID: coId });
            throw new ApiError(httpStatus.NOT_FOUND, 'Form not found');
        }
        logger.info(`Delete Form`, { className: "forms.service", methodName: "deleteForm", CID: coId  });
        logger.debug(`[DATA] %o` + result,  { className: "forms.service", methodName: "deleteForm", CID: coId });
        return result;
    }
    else {
        logger.error(`[BAD_REQUEST] Invalid Request Parameter`, { className: "forms.service", methodName: "deleteForm", CID: coId });
        throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Request Parameter');
    }

};

module.exports = {
    getForms,
    getForm,
    createForm,
    updateForm,
    deleteForm
};
