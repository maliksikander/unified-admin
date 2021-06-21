const httpStatus = require('http-status');
const { FormValidationModel } = require('../models');
const ApiError = require('../utils/ApiError');

const getFormValidation = async () => {
    const result = await FormValidationModel.find();
    return result;
};


const createFormValidation = async (reqBody) => {
    const result = await FormValidationModel.create(reqBody);
    return result;
};

const updateFormValidation = async (reqBody) => {

    const id = reqBody.id;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {   //check for id format
        const result = await FormValidationModel.findById(id);
        if (!result) throw new ApiError(httpStatus.NOT_FOUND, 'Form not found');
        Object.assign(result, reqBody);
        await result.save();
        return result;
    }
    else {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Request Parameter');
    }
};

const deleteFormValidation = async (id) => {

    if (id.match(/^[0-9a-fA-F]{24}$/)) { //check for id format
        const result = await FormValidationModel.findByIdAndDelete(id);
        if (!result) throw new ApiError(httpStatus.NOT_FOUND, 'Form not found');
        return result;
    }
    else {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Request Parameter');
    }

};

module.exports = {
    getFormValidation,
    createFormValidation,
    updateFormValidation,
    deleteFormValidation
};
