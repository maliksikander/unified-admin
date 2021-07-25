const catchAsync = require('../utils/catchAsync');
const { reasonService } = require('../services');
const logger = require('../config/logger');

const getReasons = catchAsync(async (req, res) => {
    let result = await reasonService.getReasons();
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
    const result = await reasonService.updateReason(req.body);
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
