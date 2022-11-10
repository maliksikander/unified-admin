const httpStatus = require('http-status');
const { AgentDeskSettings } = require('../models');
const ApiError = require('../utils/ApiError');
const logger = require('../config/logger');

const getSettings = async (coId) => {
  let result = await AgentDeskSettings.find();
  if(!result.length)
  { 
    logger.info(`No settings found. Creating default settings`, { className: "agentDeskSettings.service", methodName: "getSettings", CID: coId });
    logger.error(`No settings found`, { className: "agentDeskSettings.service", methodName: "getSettings", CID: coId });
    result = await AgentDeskSettings.create({});  
  }
  logger.info(`[GET] Agent Desk Settings`, { className: "agentDeskSettings.service", methodName: "getSettings", CID: coId });
  logger.debug(`[DATA] %o` + result,  { className: "agentDeskSettings.service", methodName: "getSettings", CID: coId });
  return result;
};
const updateSettings = async (reqBody,coId) => {
  const setting = await AgentDeskSettings.findById(reqBody.id);
  if (!setting) {
    logger.info(`No settings found `, { className: "agentDeskSettings.service", methodName: "updateSettings", CID: coId });
    logger.error(`[NOT_FOUND] Settings Not Found`, { className: "agentDeskSettings.service", methodName: "updateSettings", CID: coId });
    throw new ApiError(httpStatus.NOT_FOUND, 'Settings Not Found');
  }
  Object.assign(setting, reqBody);
  await setting.save();
  logger.info(`Agent Desk Settings  Updated successfully `, { className: "agentDeskSettings.service", methodName: "updateSettings", CID: coId });
  logger.debug(`[DATA] : %o` + setting, { className: "agentDeskSettings.service", methodName: "updateSettings", CID: coId });

  return setting;
};

module.exports = {
  getSettings,
  updateSettings,
};
