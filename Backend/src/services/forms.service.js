const httpStatus = require('http-status');
const { FormsModel } = require('../models');
const ApiError = require('../utils/ApiError');

const getForms = async () => {
    const result = await FormsModel.find();
    return result;
};

const getForm = async (id) => {

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        const result = await FormsModel.findById(id);
        return result;
    }
    else {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Request Parameter');
    }
};

const createForm = async (reqBody) => {
    const result = await FormsModel.create(reqBody);
    return result;
};

const updateForm = async (reqBody) => {

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        const result = await FormsModel.findById(reqBody.id);
        if (!result) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Form not found');
        }
        Object.assign(form, reqBody);
        await result.save();
        return result;
    }
    else {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Request Parameter');
    }
};

const deleteForm = async (id) => {

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        const result = await FormsModel.findByIdAndDelete(id);
        if (!result) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Form not found');
        }
        return result;
    }
    else {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Request Parameter');
    }

};

module.exports = {
    getForms,
    getForm,
    createForm,
    updateForm,
    deleteForm
};
