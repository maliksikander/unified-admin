const catchAsync = require('../utils/catchAsync');
const { formsService } = require('../services');
const { formValidationService } = require('../services');
const logger = require('../config/logger');

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
        validations = await formValidationService.getFormValidation();
        validations.forEach((item) => { item.regex = decodeURI(item.regex) });
        validations = convertArrayToObject(validations, 'type')
        let htmlResponse = createFormHTML(result, validations);
        if (htmlResponse == '') htmlResponse = "No Attributes Added";
        res.send(htmlResponse);
    }
    else {
        res.send(result);
    }
});


function convertArrayToObject(array, key) {
    const initialValue = {};
    return array.reduce((obj, item) => {
        return {
            ...obj,
            [item[key]]: item,
        };
    }, initialValue);
};


function createFormHTML(result, validations) {

    let formHtml = '';
    try {
        result.attributes.forEach((item) => {
            formHtml = formHtml + `<label for="${item.key}">${item.label}</label>\n`;
            let input = `<input type="text" id="${item.key}" name="${item.key}" data-value-type="${item.valueType}" pattern="${validations[item.valueType].regex}">\n`;
            let select = `<select name="${item.key}" id="${item.key}" data-value-type="${item.valueType}">\n`;
            let index = input.indexOf(">");
            let selectIndex = select.indexOf(">");


            if (item.attributeType == "INPUT") {
                if (item.isRequired) input = input.slice(0, index) + " required" + input.slice(index);
                formHtml = formHtml + input;
            }
            else {

                if (item.isRequired) select = select.slice(0, selectIndex) + " required" + select.slice(selectIndex);

                if (item.categoryOptions.isMultipleChoice) {
                    selectIndex = select.indexOf(">");
                    select = select.slice(0, selectIndex) + " multiple" + select.slice(selectIndex);
                }
                formHtml = formHtml + select;
                item.categoryOptions.categories.forEach(options => {
                    formHtml = formHtml + ` <optgroup label="${options.categoryName}">\n`;
                    options.values.forEach(value => {
                        formHtml = formHtml + `     <option value="${value}">${value}</option>\n`;
                    });
                    formHtml = formHtml + ` </optgroup>\n`;
                });
                formHtml = formHtml + `</select>\n`;
            }
        });
    }
    catch (e) {
        logger.info(e);
    }

    return formHtml;
}


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
