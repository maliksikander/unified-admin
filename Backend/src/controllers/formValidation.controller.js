const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { formValidationService } = require('../services');

const getFormValidation = catchAsync(async (req, res) => {
    let result = await formValidationService.getFormValidation();
    try {
        result.forEach((item) => {
            item.regex = decodeURI(item.regex)
        });
        res.send(result);
    }
    catch (e) {
        res.send(e);
    }

});

const createFormValidation = catchAsync(async (req, res) => {
    const result = await formValidationService.createFormValidation(req.body);
    res.send(result);
});

const updateFormValidation = catchAsync(async (req, res) => {
    const result = await formValidationService.updateFormValidation(req.body);
    res.send(result);
});

const deleteFormValidation = catchAsync(async (req, res) => {

    const response = {
        code: "Deleted",
        message: "Deleted Successfully",
    };
    const id = req.params.formID;
    const result = await formValidationService.deleteFormValidation(id);
    if (result._id) {
        res.send(response);
    }
    else {
        res.send(result);
    }
});

module.exports = {
    getFormValidation,
    createFormValidation,
    updateFormValidation,
    deleteFormValidation
};
