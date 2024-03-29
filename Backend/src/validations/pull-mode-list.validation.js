const Joi = require('@hapi/joi');

const createPullModeList = {
    body: Joi.object().keys({
        name: Joi.string().max(100).required(),
        agentSlaDuration: Joi.number().allow(null).allow(''),
        description: Joi.string().allow('', null).max(500),
    }),
};

const updatePullModeList = {
    body: Joi.object().keys({
        name: Joi.string().max(100).required(),
        agentSlaDuration: Joi.number().allow(null).allow(''),
        description: Joi.string().allow(null, '').max(500),
        id: Joi.string(),
    }),
};

module.exports = {
    createPullModeList,
    updatePullModeList,
};
