const Joi = require('@hapi/joi');

const createSetting = {
  body: Joi.object().keys({
    agentLogsMaxFiles: Joi.number().positive().min(1).max(1000).required(),
    agentLogsFileSize: Joi.number().positive().min(1).max(1000).required(),
    logFilePath: Joi.string().max(256).required(),
    logLevel: Joi.string().required(),
  }),
};

const updateSetting = {
  body: Joi.object().keys({
    agentLogsMaxFiles: Joi.number().positive().min(1).max(1000).required(),
    agentLogsFileSize: Joi.number().positive().min(1).max(1000).required(),
    logFilePath: Joi.string().max(256).required(),
    logLevel: Joi.string().required(),
    id: Joi.string().required(),
  }),
};

module.exports = {
  createSetting,
  updateSetting,
};
