const catchAsync = require('../utils/catchAsync');
const { reasonService } = require('../services');
const httpStatus = require('http-status');
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
    await reasonService.createReason(req.body, res);
});

const updateReason = catchAsync(async (req, res) => {

    const id = req.params.reasonID;
    const { description, label, type } = req.body;
    let body = { description, label, type };
    await reasonService.updateReason(body, id, res);
    // res.send(result);
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
        const result = await reasonService.deleteReason(id);
        if (result._id) {
            res.send(response);
        }
        else {
            res.send(result);
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
