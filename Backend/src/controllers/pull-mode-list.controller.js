const catchAsync = require('../utils/catchAsync');
const { pullModeListService } = require('../services');
const logger = require('../config/logger');
const { v4: uuidv4 } = require("uuid");
// const logger = require('../config/logger');
// const httpStatus = require('http-status');
// const ApiError = require('../utils/ApiError');

const getPullModeLists = catchAsync(async (req, res) => {
    const coId = req.header("correlationId".toLowerCase()) ? req.header("correlationId".toLowerCase()) : uuidv4();
    res.setHeader("correlationId", coId);
    try {
        logger.info(`Get pull mode lists`, { className: "pull-mode-list.controller", methodName: "getPullModeLists", CID: coId });
        logger.debug(`[REQUEST] : %o` + req.body, { className: "pull-mode-list.controller", methodName: "getPullModeLists", CID: coId });

        let result = await pullModeListService.getPullModeLists(coId);
        res.send(result);
    } catch (error) {
        logger.error(`[ERROR] on getPullModeLists %o` + error, { className: "pull-mode-list.controller", methodName: "getPullModeLists", CID: coId });
    }
});

const getPullModeListByID = catchAsync(async (req, res) => {
    const coId = req.header("correlationId".toLowerCase()) ? req.header("correlationId".toLowerCase()) : uuidv4();
    res.setHeader("correlationId", coId);
    try {
        logger.info(`Get pull mode list by ID`, { className: "pull-mode-list.controller", methodName: "getPullModeListByID", CID: coId });
        logger.debug(`[REQUEST] : %o` + req.body, { className: "pull-mode-list.controller", methodName: "getPullModeListByID", CID: coId });

        const id = req.params.listID;
        result = await pullModeListService.getPullModeList(id,coId);
        res.send(result);
    } catch (error) {
        logger.error(`[ERROR] on getPullModeListByID %o` + error, { className: "pull-mode-list.controller", methodName: "getPullModeListByID", CID: coId });
    }
});

const createPullModeList = catchAsync(async (req, res) => {
    const coId = req.header("correlationId".toLowerCase()) ? req.header("correlationId".toLowerCase()) : uuidv4();
    res.setHeader("correlationId", coId);
    try {
        logger.info(`Create pull mode list`, { className: "pull-mode-list.controller", methodName: "createPullModeList", CID: coId });
        logger.debug(`[REQUEST] : %o` + req.body, { className: "pull-mode-list.controller", methodName: "createPullModeList", CID: coId });

        const result = await pullModeListService.createPullModeList(req.body,coId);
        res.send(result);
    } catch (error) {
        logger.error(`[ERROR] on createPullModeList %o` + error, { className: "pull-mode-list.controller", methodName: "createPullModeList", CID: coId });
    }
});

const updatePullModeList = catchAsync(async (req, res) => {
    const coId = req.header("correlationId".toLowerCase()) ? req.header("correlationId".toLowerCase()) : uuidv4();
    res.setHeader("correlationId", coId);
    try {
        logger.info(`Update pull mode list`, { className: "pull-mode-list.controller", methodName: "updatePullModeList", CID: coId });
        logger.debug(`[REQUEST] : %o` + req.body, { className: "pull-mode-list.controller", methodName: "updatePullModeList", CID: coId });

        const id = req.params.listID;
        const { name, description } = req.body;
        let body = { name, description };
        const result = await pullModeListService.updatePullModeList(body, id , coId);
        res.send(result);
    } catch (error) {
        logger.error(`[ERROR] on updatePullModeList %o` + error, { className: "pull-mode-list.controller", methodName: "updatePullModeList", CID: coId });
    }
});

const deletePullModeList = catchAsync(async (req, res) => {

    const response = {
        code: "Deleted",
        message: "Deleted Successfully",
    };
    const coId = req.header("correlationId".toLowerCase()) ? req.header("correlationId".toLowerCase()) : uuidv4();
    res.setHeader("correlationId", coId);
    try {
        logger.info(`Delete pull mode list`, { className: "pull-mode-list.controller", methodName: "deletePullModeList", CID: coId });
        logger.debug(`[REQUEST] : %o` + req.body, { className: "pull-mode-list.controller", methodName: "deletePullModeList", CID: coId });

        const id = req.params.listID;
        const result = await pullModeListService.deletePullModeList(id,coId);
        if (result._id) {
            res.send(response);
        }
        else {
            res.send(result);
        }
    } catch (error) {
        logger.error(`[ERROR] on deletePullModeList %o` + error, { className: "pull-mode-list.controller", methodName: "deletePullModeList", CID: coId });
    }
});

module.exports = {
    getPullModeLists,
    getPullModeListByID,
    createPullModeList,
    updatePullModeList,
    deletePullModeList
};
