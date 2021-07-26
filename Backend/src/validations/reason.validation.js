const Joi = require('@hapi/joi');

const createReason = {
    body: Joi.object().keys({
        label: Joi.string().max(100).required(),
        description: Joi.string().allow(null, '').max(500),
        type: Joi.string().valid("LOG_OUT", "NOT_READY").required(),
    }),
};

const updateReason = {
    body: Joi.object().keys({
        label: Joi.string().max(100).required(),
        description: Joi.string().allow(null, '').max(500),
        type: Joi.string().valid("LOG_OUT", "NOT_READY").required(),
        code: Joi.number(),
        id: Joi.string().required(),
    }),
};

module.exports = {
    createReason,
    updateReason,
};