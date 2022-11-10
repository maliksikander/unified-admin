const httpStatus = require('http-status');
const { ReasonCodeModel } = require('../models');
const ApiError = require('../utils/ApiError');
const mongoose = require('mongoose');
const logger = require('../config/logger');

const getReasons = async (type,coId) => {

    if (type == 'LOGOUT' || type == 'NOT_READY') {
        const filtered = await ReasonCodeModel.find({ 'type': { $lte: type } });
        return filtered;
    }

    const result = await ReasonCodeModel.find();
    logger.info(`Get All Reason Codes`, { className: "reason.service", methodName: "getReasons" , CID: coId });
    logger.debug(`[DATA] %o` + result,  { className: "reason.service", methodName: "getReasons", CID: coId });
    return result;
};

const getReason = async (id,coId) => {

    if (id.match(/^[0-9a-fA-F]{24}$/)) { //check for id format
        const result = await ReasonCodeModel.findById(id);
        if (!result) {
            logger.error(`[NOT_FOUND] Not Found`, { className: "reason.service", methodName: "getReason", CID: coId });
            throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
        }
        logger.info(`Get Single Reason Code`, { className: "reason.service", methodName: "getReason" , CID: coId });
        logger.debug(`[DATA] %o` + result,  { className: "reason.service", methodName: "getReason", CID: coId });
        return result;
    }
    else {
        logger.error(`[BAD_REQUEST] Invalid Request Parameter`, { className: "reason.service", methodName: "getReason", CID: coId });
        throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Request Parameter');
    }
};

const createReason = async (reqBody, res,coId) => {
    reqBody["_id"] = new mongoose.Types.ObjectId();
    ReasonCodeModel.find({ name: reqBody.name, type: reqBody.type }, async (err, reasonCode) => {
        if (err) {
            logger.error(`[INTERNAL_SERVER_ERROR] %o` + err, { className: "reason.service", methodName: "createReason", CID: coId });
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, err);
        }
        if (reasonCode.length == 0) {
            const result = await ReasonCodeModel.create(reqBody);
            logger.info(`Create Reason Code`, { className: "reason.service", methodName: "createReason" , CID: coId });
            logger.debug(`[DATA] %o` + result,  { className: "reason.service", methodName: "createReason", CID: coId });
            res.send(result);
        }
        else {
            logger.error(`[REASON_NAME_CONFLICT] Name Already Exists`, { className: "reason.service", methodName: "createReason", CID: coId });
            res.status(httpStatus.CONFLICT).send({ error: "REASON_NAME_CONFLICT", message: "Name Already Exists" })
        }
    });


};

const updateReason = async (reqBody, id, res, coId) => {
    // const id = reqBody.id;
    ReasonCodeModel.find({ name: reqBody.name, type: reqBody.type }, async (err, reasonCode) => {
        if (err) {
            logger.error(`[INTERNAL_SERVER_ERROR] %o` + err, { className: "reason.service", methodName: "updateReason", CID: coId });
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, err);
        }
        if (reasonCode.length == 0 || (reasonCode.length >= 0 && checkForUniqueness(reqBody, id, reasonCode))) {
            if (id.match(/^[0-9a-fA-F]{24}$/)) {   //check for id format
                const result = await ReasonCodeModel.findById(id);
                if (!result) {
                    logger.error(`[NOT_FOUND] Not found`, { className: "reason.service", methodName: "updateReason", CID: coId });
                    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
                }
                Object.assign(result, reqBody);
                await result.save();
                logger.info(`Update Reason Code`, { className: "reason.service", methodName: "updateReason" , CID: coId });
                logger.debug(`[DATA] %o` + result,  { className: "reason.service", methodName: "updateReason", CID: coId });
                res.send(result);
            }
            else {
                logger.error(`[BAD_REQUEST] Invalid Request Parameter`, { className: "reason.service", methodName: "updateReason", CID: coId });
                throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Request Parameter');
            }

        }
        else {
            logger.error(`[REASON_NAME_CONFLICT] Name Already Exists`, { className: "reason.service", methodName: "updateReason", CID: coId });
            res.status(httpStatus.CONFLICT).send({ error: "REASON_NAME_CONFLICT", message: "Name Already Exists" })
        }
    });


};


function checkForUniqueness(reqBody, id, reasonCodes) {
    try {
        for (let i = 0; i < reasonCodes.length; i++) {
            if (reasonCodes[i]._id == id || (reasonCodes[i].description != reqBody.description)) return true;
        }
        return false;
    } catch (e) {
        logger.error(`INTERNAL_SERVER_ERROR: %o` + e, { className: "reason.service", methodName: "deleteReason", CID: coId });
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, e);
    }
}

const deleteReason = async (id,coId) => {

    if (id.match(/^[0-9a-fA-F]{24}$/)) { //check for id format
        const result = await ReasonCodeModel.findByIdAndDelete(id);
        if (!result) {
            logger.error(`[NOT_FOUND] Not found`, { className: "reason.service", methodName: "deleteReason", CID: coId });
            throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
        }
        logger.info(`Delete Reason Code`, { className: "reason.service", methodName: "deleteReason" , CID: coId });
        logger.debug(`[DATA] %o` + result,  { className: "reason.service", methodName: "deleteReason", CID: coId });
        return result;
    }
    else {
        logger.error(`[BAD_REQUEST] Invalid Request Parameter`, { className: "reason.service", methodName: "deleteReason", CID: coId });
        throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Request Parameter');
    }

};

module.exports = {
    getReasons,
    getReason,
    createReason,
    updateReason,
    deleteReason
};
