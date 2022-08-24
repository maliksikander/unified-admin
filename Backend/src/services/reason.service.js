const httpStatus = require('http-status');
const { ReasonCodeModel } = require('../models');
const ApiError = require('../utils/ApiError');
const mongoose = require('mongoose');

const getReasons = async (type) => {


    if (type == 'LOGOUT' || type == 'NOT_READY') {
        const filtered = await ReasonCodeModel.find({ 'type': { $lte: type } });
        return filtered;
    }

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

const createReason = async (reqBody, res) => {
    reqBody["_id"] = new mongoose.Types.ObjectId();
    ReasonCodeModel.find({ name: reqBody.name, type: reqBody.type }, async (err, reasonCode) => {
        if (err) {
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, err);
        }
        if (reasonCode.length == 0) {
            const result = await ReasonCodeModel.create(reqBody);
            res.send(result);
        }
        else {
            res.status(httpStatus.CONFLICT).send({ error: "REASON_NAME_CONFLICT", message: "Name Already Exists" })
        }
    });


};

const updateReason = async (reqBody, id, res) => {
    // const id = reqBody.id;
    ReasonCodeModel.find({ name: reqBody.name, type: reqBody.type }, async (err, reasonCode) => {
        if (err) {
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, err);
        }
        if (reasonCode.length == 0) {
            if (id.match(/^[0-9a-fA-F]{24}$/)) {   //check for id format
                const result = await ReasonCodeModel.findById(id);
                if (!result) throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
                Object.assign(result, reqBody);
                await result.save();
                res.send(result);
            }
            else {
                throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Request Parameter');
            }

        }
        else {
            res.status(httpStatus.CONFLICT).send({ error: "REASON_NAME_CONFLICT", message: "Name Already Exists" })
        }
    });


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
