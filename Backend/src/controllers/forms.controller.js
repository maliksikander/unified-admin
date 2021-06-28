const catchAsync = require('../utils/catchAsync');
const { formsService } = require('../services');

const getForms = catchAsync(async (req, res) => {
    let result = await formsService.getForms();
    res.send(result);
});

const getFormByID = catchAsync(async (req, res) => {

    const id = req.params.formID;
    let resType = req.query.responseType;
    if (resType) resType = resType.toLowerCase();

    result = await formsService.getForm(id);

    if (resType == "html") {
        res.send("Not yet");
    }
    else {
        res.send(result);
    }
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
    getFormByID,
    createForm,
    updateForm,
    deleteForm
};
