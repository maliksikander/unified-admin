const catchAsync = require('../utils/catchAsync');
const { pullModeListService } = require('../services');
// const logger = require('../config/logger');
// const httpStatus = require('http-status');
// const ApiError = require('../utils/ApiError');

const getPullModeLists = catchAsync(async (req, res) => {

    let result = await pullModeListService.getPullModeLists();
    res.send(result);
});

const getPullModeListByID = catchAsync(async (req, res) => {

    const id = req.params.listID;
    result = await pullModeListService.getPullModeList(id);
    res.send(result);
});

const createPullModeList = catchAsync(async (req, res) => {

    const result = await pullModeListService.createPullModeList(req.body);
    res.send(result);
});

const updatePullModeList = catchAsync(async (req, res) => {

    const id = req.params.listID;
    const { name, description } = req.body;
    let body = { name, description };
    const result = await pullModeListService.updatePullModeList(body, id);
    res.send(result);
});

const deletePullModeList = catchAsync(async (req, res) => {

    const response = {
        code: "Deleted",
        message: "Deleted Successfully",
    };
    const id = req.params.listID;
    const result = await pullModeListService.deletePullModeList(id);
    if (result._id) {
        res.send(response);
    }
    else {
        res.send(result);
    }
});

module.exports = {
    getPullModeLists,
    getPullModeListByID,
    createPullModeList,
    updatePullModeList,
    deletePullModeList
};
