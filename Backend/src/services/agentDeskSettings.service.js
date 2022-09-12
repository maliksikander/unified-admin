const httpStatus = require('http-status');
const { AgentDeskSettings } = require('../models');
const ApiError = require('../utils/ApiError');
const logger = require('../config/logger');
const getSettings = async () => {
  let result = await AgentDeskSettings.find();
  if(!result.length)
  {
    logger.info("No agent desk settings found. Creating new agent desk setting with default values")
    result = await AgentDeskSettings.create({});
    logger.debug("Agent desk settings created :"+result)

  }
  return result;
};
const updateSettings = async (reqBody) => {
  const setting = await AgentDeskSettings.findById(reqBody.id);
  if (!setting) {
    logger.info("No Settings Found ");
    throw new ApiError(httpStatus.NOT_FOUND, 'Settings Not Found');
  }
  Object.assign(setting, reqBody);
  await setting.save();
  logger.info("Agent Desk Settings  Updated successfully");
  logger.debug("Agent Desk Updated Settings are :",JSON.stringify(setting));

  return setting;
};

module.exports = {
  getSettings,
  updateSettings,
};
