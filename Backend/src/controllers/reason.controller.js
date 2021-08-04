const catchAsync = require('../utils/catchAsync');
const { reasonService } = require('../services');
// const logger = require('../config/logger');
// const httpStatus = require('http-status');
// const ApiError = require('../utils/ApiError');

const getReasons = catchAsync(async (req, res) => {

    let type;
    if (req.query && req.query.type) type = req.query.type.toUpperCase();
    let result = await reasonService.getReasons(type);
    res.send(result);
});

const getReasonByID = catchAsync(async (req, res) => {

    const id = req.params.reasonID;
    result = await reasonService.getReason(id);
    res.send(result);
});

const createReason = catchAsync(async (req, res) => {

    const result = await reasonService.createReason(req.body);
    res.send(result);
});

const updateReason = catchAsync(async (req, res) => {

    const id = req.params.reasonID;
    const { description, label, type } = req.body;
    let body = { description, label, type };
    const result = await reasonService.updateReason(body, id);
    res.send(result);
});

const deleteReason = catchAsync(async (req, res) => {

    const response = {
        code: "Deleted",
        message: "Deleted Successfully",
    };
    const id = req.params.reasonID;
    const result = await reasonService.deleteReason(id);
    if (result._id) {
        res.send(response);
    }
    else {
        res.send(result);
    }
});

module.exports = {
    getReasons,
    getReasonByID,
    createReason,
    updateReason,
    deleteReason
};
