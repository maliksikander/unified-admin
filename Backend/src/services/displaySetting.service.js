const httpStatus = require('http-status');
const { DisplaySetting } = require('../models');
const ApiError = require('../utils/ApiError');
const logger = require('../config/logger');

const getSettings = async (coId) => {
  const result = await DisplaySetting.find();
  logger.info(`Get Display Setting`, { className: "displaySetting.service", methodName: "getSettings" , CID: coId });
  logger.debug(`[DATA] %o` + result,  { className: "displaySetting.service", methodName: "getSettings", CID: coId });
  return result;
};

const createSettings = async (reqBody,coId) => {
  const result = await DisplaySetting.create(reqBody);
  logger.info(`Create Display Setting`, { className: "displaySetting.service", methodName: "createSettings" , CID: coId });
  logger.debug(`[DATA] %o` + result,  { className: "displaySetting.service", methodName: "createSettings", CID: coId });
  return result;
};

const updateSettings = async (reqBody,coId) => {
  const setting = await DisplaySetting.findById(reqBody.id);
  if (!setting) {
    logger.error(`[NOT_FOUND] Settings not found`, { className: "displaySetting.service", methodName: "updateSettings", CID: coId });
    throw new ApiError(httpStatus.NOT_FOUND, 'Settings not found');
  }
  Object.assign(setting, reqBody);
  await setting.save();
  logger.info(`Update Display Setting`, { className: "displaySetting.service", methodName: "updateSettings" , CID: coId });
  logger.debug(`[DATA] %o` + setting,  { className: "displaySetting.service", methodName: "updateSettings", CID: coId });
  return setting;
};

module.exports = {
  getSettings,
  createSettings,
  updateSettings,
};
