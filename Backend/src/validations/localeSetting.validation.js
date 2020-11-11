const Joi = require('@hapi/joi');

const createSetting = {
  body: Joi.object().keys({
    supportedLanguages: Joi.array()
      .items(Joi.object({ code: Joi.string().required(), name: Joi.string().required(), flagUrl: Joi.string().required() }))
      .required(),
    defaultLanguage: Joi.object({
      code: Joi.string().required(),
      name: Joi.string().required(),
      flagUrl: Joi.string().required(),
    }).required(),
    timezone: Joi.object({
      id: Joi.number().required(),
      name: Joi.string().required(),
    }).required(),
  }),
};
const updateSetting = {
  body: Joi.object().keys({
    supportedLanguages: Joi.array()
      .items(Joi.object({ code: Joi.string().required(), name: Joi.string().required(), flagUrl: Joi.string().required() }))
      .required(),
    defaultLanguage: Joi.object({
      code: Joi.string().required(),
      name: Joi.string().required(),
      flagUrl: Joi.string().required(),
    }).required(),
    timezone: Joi.object({
      id: Joi.number().required(),
      name: Joi.string().required(),
    }).required(),
    id: Joi.string().required(),
  }),
};

module.exports = {
  createSetting,
  updateSetting,
};
