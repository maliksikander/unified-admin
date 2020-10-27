const Joi = require('@hapi/joi');

const createReportSetting = {
  body: Joi.object().keys({
    reportingEnabled: Joi.boolean().required(),
    rcDBUrl: Joi.string().required(),
    rcDBUser: Joi.string().required(),
    rcDBPwd: Joi.string().required(),
    rcDBName: Joi.string().required(),
  }),
};

const updateReportSetting = {
  body: Joi.object().keys({
    reportingEnabled: Joi.boolean().required(),
    rcDBUrl: Joi.string().required(),
    rcDBUser: Joi.string().required(),
    rcDBPwd: Joi.string().required(),
    rcDBName: Joi.string().required(),
    id: Joi.string().required(),
  }),
};

module.exports = {
  createReportSetting,
  updateReportSetting,
};
