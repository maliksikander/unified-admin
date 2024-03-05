const Joi = require('@hapi/joi');

const createEmailResponse = {
    body: Joi.object().keys({
        responseName: Joi.string().max(100).required(),
        channelIdentifier: Joi.string().max(100).required(),
        signatureBody: Joi.string().required(),
    }),
};

const updateEmailResponse = {
    body: Joi.object().keys({
        responseName: Joi.string().required(),
        channelIdentifier: Joi.string().max(500).required(),
        signatureBody: Joi.string().required(),
        id:Joi.string().required(),
        createdAt: Joi.string(),
        updatedAt: Joi.string()
    }),
};

module.exports = {
    createEmailResponse,
    updateEmailResponse,
};
