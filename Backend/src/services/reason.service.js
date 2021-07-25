const httpStatus = require('http-status');
const { ReasonCodeModel } = require('../models');
const ApiError = require('../utils/ApiError');

const getReasons = async () => {
    const result = await ReasonCodeModel.find();
    return result;
};

const getReason = async (id) => {

    if (id.match(/^[0-9a-fA-F]{24}$/)) { //check for id format
        const result = await ReasonCodeModel.findById(id);
        if (!result) throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
        return result;
    }
    else {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Request Parameter');
    }
};

const createReason = async (reqBody) => {
    const result = await ReasonCodeModel.create(reqBody);
    return result;
};

const updateReason = async (reqBody) => {

    const id = reqBody.id;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {   //check for id format
        const result = await ReasonCodeModel.findById(id);
        if (!result) throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
        Object.assign(result, reqBody);
        await result.save();
        return result;
    }
    else {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Request Parameter');
    }
};

const deleteReason = async (id) => {

    if (id.match(/^[0-9a-fA-F]{24}$/)) { //check for id format
        const result = await ReasonCodeModel.findByIdAndDelete(id);
        if (!result) throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
        return result;
    }
    else {
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
