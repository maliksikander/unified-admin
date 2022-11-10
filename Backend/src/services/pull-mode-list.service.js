const httpStatus = require('http-status');
const { PullModeListModel } = require('../models');
const ApiError = require('../utils/ApiError');
const logger = require('../config/logger');

const getPullModeLists = async (coId) => {
    const result = await PullModeListModel.find();
    logger.info(`Get All Pull Mode Lists`, { className: "pull-mode-list.service", methodName: "getPullModeLists" , CID: coId });
    logger.debug(`[DATA] %o` + result,  { className: "pull-mode-list.service", methodName: "getPullModeLists", CID: coId });
    return result;
};

const getPullModeList = async (id,coId) => {

    if (id.match(/^[0-9a-fA-F]{24}$/)) { //check for id format
        const result = await PullModeListModel.findById(id);
        if (!result) {
            logger.error(`[NOT_FOUND] Not found`, { className: "pull-mode-list.service", methodName: "getPullModeList", CID: coId });
            throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
        }
        logger.info(`Get Single Pull Mode List`, { className: "pull-mode-list.service", methodName: "getPullModeList" , CID: coId });
        logger.debug(`[DATA] %o` + result,  { className: "pull-mode-list.service", methodName: "getPullModeList", CID: coId });
        return result;
    }
    else {
        logger.error(`[BAD_REQUEST] Invalid Request Parameter`, { className: "pull-mode-list.service", methodName: "getPullModeList", CID: coId });
        throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Request Parameter');
    }
};

const createPullModeList = async (reqBody,coId) => {
    const result = await PullModeListModel.create(reqBody);
    logger.info(`Create Pull Mode List`, { className: "pull-mode-list.service", methodName: "createPullModeList" , CID: coId });
    logger.debug(`[DATA] %o` + result,  { className: "pull-mode-list.service", methodName: "createPullModeList", CID: coId });
    return result;
};

const updatePullModeList = async (reqBody, id, coId) => {

    // const id = reqBody.id;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {   //check for id format
        const result = await PullModeListModel.findById(id);
        if (!result) {
            logger.error(`[NOT_FOUND] Not found`, { className: "pull-mode-list.service", methodName: "updatePullModeList", CID: coId });
            throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
        }
        Object.assign(result, reqBody);
        await result.save();
        logger.info(`Update Pull Mode List`, { className: "pull-mode-list.service", methodName: "updatePullModeList" , CID: coId });
        logger.debug(`[DATA] %o` + result,  { className: "pull-mode-list.service", methodName: "updatePullModeList", CID: coId });
        return result;
    }
    else {
        logger.error(`[BAD_REQUEST] Invalid Request Parameter`, { className: "pull-mode-list.service", methodName: "updatePullModeList", CID: coId });
        throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Request Parameter');
    }
};

const deletePullModeList = async (id,coId) => {

    if (id.match(/^[0-9a-fA-F]{24}$/)) { //check for id format
        const result = await PullModeListModel.findByIdAndDelete(id);
        if (!result) {
            logger.error(`[NOT_FOUND] Not found`, { className: "pull-mode-list.service", methodName: "deletePullModeList", CID: coId });
            throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
        }
        logger.info(`Delete Pull Mode Lists`, { className: "pull-mode-list.service", methodName: "deletePullModeList" , CID: coId });
        logger.debug(`[DATA] %o` + result,  { className: "pull-mode-list.service", methodName: "deletePullModeList", CID: coId });
        return result;
    }
    else {
        logger.error(`[BAD_REQUEST] Invalid Request Parameter`, { className: "pull-mode-list.service", methodName: "deletePullModeList", CID: coId });
        throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Request Parameter');
    }

};

module.exports = {
    getPullModeLists,
    getPullModeList,
    createPullModeList,
    updatePullModeList,
    deletePullModeList
};
