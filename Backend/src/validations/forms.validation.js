const Joi = require('@hapi/joi');

const createForm = {
    body: Joi.object().keys({
        formTitle: Joi.string().max(500).required(),
        formDescription: Joi.string().max(500),
        attributes: Joi.array().required(),
    }),
};
const updateForm = {
    body: Joi.object().keys({
        id: Joi.string().required(),
        formTitle: Joi.string().max(500).required(),
        formDescription: Joi.string().max(500),
        attributes: Joi.array().required(),
    }),
};

module.exports = {
    createForm,
    updateForm,
};
