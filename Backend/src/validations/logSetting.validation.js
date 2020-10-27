const Joi = require('@hapi/joi');

const createLogSetting = {
  body: Joi.object().keys({
    agentLogsMaxFiles: Joi.number().positive().max(1000).required(),
    agentLogsFileSize: Joi.number().positive().max(1000).required(),
    logFilePath: Joi.string().required(),
    logLevel: Joi.string().required(),
  }),
};

const updateLogSetting = {
  body: Joi.object().keys({
    agentLogsMaxFiles: Joi.number().positive().max(1000).required(),
    agentLogsFileSize: Joi.number().positive().max(1000).required(),
    logFilePath: Joi.string().required(),
    logLevel: Joi.string().required(),
    id: Joi.string().required(),
  }),
};

module.exports = {
  createLogSetting,
  updateLogSetting,
};
