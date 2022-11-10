const catchAsync = require('../utils/catchAsync');
const { reasonService } = require('../services');
const httpStatus = require('http-status');
const logger = require('../config/logger');
const { v4: uuidv4 } = require("uuid");
// const logger = require('../config/logger');
// const httpStatus = require('http-status');
// const ApiError = require('../utils/ApiError');

const getReasons = catchAsync(async (req, res) => {

    let type;
    if (req.query && req.query.type) type = req.query.type.toUpperCase();
    const coId = req.header("correlationId".toLowerCase()) ? req.header("correlationId".toLowerCase()) : uuidv4();
    res.setHeader("correlationId", coId);
    try {
        logger.info(`Get reasons`, { className: "reason.controller", methodName: "getReasons", CID: coId });
        logger.debug(`[REQUEST] : %o` + req.body, { className: "reason.controller", methodName: "getReasons", CID: coId });

        let result = await reasonService.getReasons(type,coId);
        res.send(result);
    } catch (error) {
        logger.error(`[ERROR on getReasons %o` + error, { className: "reason.controller", methodName: "getReasons", CID: coId });
    }
});

const getReasonByID = catchAsync(async (req, res) => {

    const id = req.params.reasonID;
    const coId = req.header("correlationId".toLowerCase()) ? req.header("correlationId".toLowerCase()) : uuidv4();
    res.setHeader("correlationId", coId);
    try {
        logger.info(`Get reason by ID`, { className: "reason.controller", methodName: "getReasonByID", CID: coId });
        logger.debug(`[REQUEST] : %o` + req.body, { className: "reason.controller", methodName: "getReasonByID", CID: coId });

        result = await reasonService.getReason(id,coId);
        res.send(result);
    } catch (error) {
        logger.error(`[ERROR on get Reason By ID %o` + error, { className: "reason.controller", methodName: "getReasonByID", CID: coId });
    }
});

const createReason = catchAsync(async (req, res) => {
    const coId = req.header("correlationId".toLowerCase()) ? req.header("correlationId".toLowerCase()) : uuidv4();
    res.setHeader("correlationId", coId);
    try {
        logger.info(`Create reason`, { className: "reason.controller", methodName: "createReason", CID: coId });
        logger.debug(`[REQUEST] : %o` + req.body, { className: "reason.controller", methodName: "createReason", CID: coId });

        await reasonService.createReason(req.body, res, coId);
    } catch (error) {
        logger.error(`[ERROR on create reason %o` + error , { className: "reason.controller", methodName: "createReason", CID: coId });
    }
});

const updateReason = catchAsync(async (req, res) => {
    const id = req.params.reasonID;
    const { description, name, type } = req.body;
    let body = { description, name, type };
    const coId = req.header("correlationId".toLowerCase()) ? req.header("correlationId".toLowerCase()) : uuidv4();
    res.setHeader("correlationId", coId);
    try {
        logger.info(`Update reason`, { className: "reason.controller", methodName: "updateReason", CID: coId });
        logger.debug(`[REQUEST] : %o` + req.body , { className: "reason.controller", methodName: "updateReason", CID: coId });

        await reasonService.updateReason(body, id, res,coId);
        // res.send(result);
    } catch (error) {
        logger.error(`[ERROR on update reason %o` + error, { className: "reason.controller", methodName: "updateReason", CID: coId });
    }
});

const deleteReason = catchAsync(async (req, res) => {


    const response = {
        code: "Deleted",
        message: "Deleted Successfully",
    };
    const id = req.params.reasonID;
    if (id == '62ffc95cf12b6ccf1594d781' || id == '62ffc9e9f12b6ccf1594d88b') {
        res.status(httpStatus.METHOD_NOT_ALLOWED).send({ error: "NOT_ALLOWED", message: "Default reason code cannot be deleted" });
    }
    else {
        const coId = req.header("correlationId".toLowerCase()) ? req.header("correlationId".toLowerCase()) : uuidv4();
        res.setHeader("correlationId", coId);
        try {
            logger.info(`Delete reason`, { className: "reason.controller", methodName: "deleteReason", CID: coId });
            logger.debug(`[REQUEST] : %o` + req.body, { className: "reason.controller", methodName: "deleteReason", CID: coId });

            const result = await reasonService.deleteReason(id,coId);
            if (result._id) {
                res.send(response);
            }
            else {
                res.send(result);
            }
        } catch (error) {
            logger.error(`[ERROR on delete reason %o` + error, { className: "reason.controller", methodName: "deleteReason", CID: coId });
        }
    }
});

module.exports = {
    getReasons,
    getReasonByID,
    createReason,
    updateReason,
    deleteReason
};
