const httpStatus = require('http-status');
const { PullModeListModel } = require('../models');
const ApiError = require('../utils/ApiError');

const getPullModeLists = async () => {

    const result = await PullModeListModel.find();
    return result;
};

const getPullModeList = async (id) => {

    if (id.match(/^[0-9a-fA-F]{24}$/)) { //check for id format
        const result = await PullModeListModel.findById(id);
        if (!result) throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
        return result;
    }
    else {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Request Parameter');
    }
};

const createPullModeList = async (reqBody) => {
    const result = await PullModeListModel.create(reqBody);
    return result;
};

const updatePullModeList = async (reqBody, id) => {

    // const id = reqBody.id;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {   //check for id format
        const result = await PullModeListModel.findById(id);
        if (!result) throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
        Object.assign(result, reqBody);
        await result.save();
        return result;
    }
    else {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Request Parameter');
    }
};

const deletePullModeList = async (id) => {

    if (id.match(/^[0-9a-fA-F]{24}$/)) { //check for id format
        const result = await PullModeListModel.findByIdAndDelete(id);
        if (!result) throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
        return result;
    }
    else {
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
