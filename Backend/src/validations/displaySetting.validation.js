const Joi = require('@hapi/joi');

const createSetting = {
  body: Joi.object().keys({
    companyDisplayName: Joi.string().max(40).required(),
    agentAlias: Joi.string().max(40).required(),
    companyLogo: Joi.string().required(),
  }),
};

const updateSetting = {
  body: Joi.object().keys({
    companyDisplayName: Joi.string().max(40).required(),
    agentAlias: Joi.string().max(40).required(),
    companyLogo: Joi.string().required(),
    id: Joi.string().required(),
  }),
};

module.exports = {
  createSetting,
  updateSetting,
};
