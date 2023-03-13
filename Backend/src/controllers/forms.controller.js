const catchAsync = require('../utils/catchAsync');
const { formsService } = require('../services');
const { formValidationService } = require('../services');
const logger = require('../config/logger');
const { v4: uuidv4 } = require("uuid");

const getForms = catchAsync(async (req, res) => {
    const coId = req.header("correlationId".toLowerCase()) ? req.header("correlationId".toLowerCase()) : uuidv4();
    res.setHeader("correlationId", coId);
    try {
        logger.info(`Get forms`, { className: "forms.controller", methodName: "getForms", CID: coId });

        let result = await formsService.getForms(coId);
        res.send(result);
    } catch (error) {
        logger.error(`[ERROR] on get forms api: %o` + error, { className: "forms.controller", methodName: "getForms", CID: coId });
    }
});

const getFormByID = catchAsync(async (req, res) => {
    const coId = req.header("correlationId".toLowerCase()) ? req.header("correlationId".toLowerCase()) : uuidv4();
    res.setHeader("correlationId", coId);
    try {
        logger.info(`Get form by id`, { className: "forms.controller", methodName: "getFormByID", CID: coId });
        logger.debug(`[REQUEST] %o` + req, { className: "forms.controller", methodName: "getFormByID", CID: coId });

    const id = req.params.formID;
    let resType = req.query.responseType;
    if (resType) resType = resType.toLowerCase();

    result = await formsService.getForm(id, coId);

    // if (resType == "html") {
    //     validations = await formValidationService.getFormValidation();
    //     validations.forEach((item) => { item.regex = decodeURI(item.regex) });
    //     validations = convertArrayToObject(validations, 'type')
    //     let htmlResponse = createFormHTML(result, validations);
    //     if (htmlResponse == '') htmlResponse = "No Attributes Added";
    //     res.send(htmlResponse);
    // }
    // else {
        res.send(result);
    // }
    } catch (error) {
        logger.error(`[ERROR] on get form by id api: %o` + error, { className: "forms.controller", methodName: "getFormByID", CID: coId });
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
        logger.info(`Create form HTML`, { className: "forms.controller", methodName: "createFormHTML"});
        logger.debug(`[REQUEST] : %o` + req, { className: "forms.controller", methodName: "createFormHTML"});

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
        logger.error(`[ERROR] on get form by id api: %o` + e, { className: "forms.controller", methodName: "createFormHTML"});
    }

    return formHtml;
}


const createForm = catchAsync(async (req, res) => {
    const coId = req.header("correlationId".toLowerCase()) ? req.header("correlationId".toLowerCase()) : uuidv4();
    res.setHeader("correlationId", coId);
    try {
        logger.info(`Create form`, { className: "forms.controller", methodName: "createForm", CID: coId });
        logger.debug(`[REQUEST] : %o` + req, { className: "forms.controller", methodName: "createForm", CID: coId });

        const result = await formsService.createForm(req.body, coId);
        res.send(result);
    } catch (error) {
        logger.error(`[ERROR] on create form: %o` + error , { className: "forms.controller", methodName: "createForm", CID: coId });
    }
});

const updateForm = catchAsync(async (req, res) => {
    const coId = req.header("correlationId".toLowerCase()) ? req.header("correlationId".toLowerCase()) : uuidv4();
    res.setHeader("correlationId", coId);
    try {
        logger.info(`Update form`, { className: "forms.controller", methodName: "updateForm", CID: coId });
        logger.debug(`[REQUEST] : %o` + req.body, { className: "forms.controller", methodName: "updateForm", CID: coId });

        const result = await formsService.updateForm(req.body, coId);
        res.send(result);
    } catch (error) {
        logger.error(`[ERROR] on update form: %o` + error, { className: "forms.controller", methodName: "updateForm", CID: coId });
    }
});

const deleteForm = catchAsync(async (req, res) => {
    const coId = req.header("correlationId".toLowerCase()) ? req.header("correlationId".toLowerCase()) : uuidv4();
    res.setHeader("correlationId", coId);
    const response = {
        code: "Deleted",
        message: "Deleted Successfully",
    };
    const id = req.params.formID;
    if(id == "62d07f4f0980a50a91210bef") return res.status(405).send({
        code: "Not Allowed",
        message: "Cannot delete this record",
    })
    const result = await formsService.deleteForm(id,coId);
    if (result._id) {
        logger.info(`${response.message}`, { className: "forms.controller", methodName: "deleteForm", CID: coId });
        logger.debug(`[REQUEST] : %o` + response, { className: "forms.controller", methodName: "deleteForm", CID: coId });
        res.send(response);
    }
    else {
        logger.info(`${response.message}`, { className: "forms.controller", methodName: "deleteForm", CID: coId });
        logger.debug(`[REQUEST] : %o` + response, { className: "forms.controller", methodName: "deleteForm", CID: coId });
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
