const Joi = require('@hapi/joi');

const createEmailSignature = {
    body: Joi.object().keys({
        signatureName: Joi.string().max(100).required(),
        channelIdentifer: Joi.string().max(100).required(),
        signatureBody: Joi.string().required(),
    }),
};

const updateEmailSignature = {
    body: Joi.object().keys({
        signatureName: Joi.string().required(),
        channelIdentifer: Joi.string().max(500).required(),
        signatureBody: Joi.string().required(),
        id:Joi.string().required(),
        createdAt: Joi.string(),
        updatedAt: Joi.string()
    }),
};

module.exports = {
    createEmailSignature,
    updateEmailSignature,
};
