const Joi = require('@hapi/joi');

const createDisplaySetting = {
  body: Joi.object().keys({
    companyDisplayName: Joi.string().required(),
    agentAlias: Joi.string().required(),
    companyLogo: Joi.string().required(),
  }),
};

const updateDisplaySetting = {
  body: Joi.object().keys({
    companyDisplayName: Joi.string().required(),
    agentAlias: Joi.string().required(),
    companyLogo: Joi.string().required(),
    id: Joi.string().required(),
  }),
};

module.exports = {
  createDisplaySetting,
  updateDisplaySetting,
};
