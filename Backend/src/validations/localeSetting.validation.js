const Joi = require('@hapi/joi');

const createLocaleSetting = {
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
const updateLocaleSetting = {
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
  createLocaleSetting,
  updateLocaleSetting,
};
