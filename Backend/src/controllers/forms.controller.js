const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { formsService } = require('../services');

const getForms = catchAsync(async (req, res) => {

    const param = req.query;
    let result;
    if (param.constructor === Object) {
        if (Object.entries(param).length === 0) {
            result = await formsService.getForms();
        }
        else {
            result = await formsService.getForm(param.formID);
        }
    }
    res.send(result);
});

const createForm = catchAsync(async (req, res) => {
    const result = await formsService.createForm(req.body);
    res.send(result);
});

const updateForm = catchAsync(async (req, res) => {
    const result = await formsService.updateForm(req.body);
    res.send(result);
});

const deleteForm = catchAsync(async (req, res) => {

    const response = {
        code: "Deleted",
        message: "Deleted Successfully",
    };
    const id = req.params.formID;
    const result = await formsService.deleteForm(id);
    if (result._id) {
        res.send(response);
    }
    else {
        res.send(result);
    }
});

module.exports = {
    getForms,
    createForm,
    updateForm,
    deleteForm
};
