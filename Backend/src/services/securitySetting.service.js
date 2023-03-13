const httpStatus = require('http-status');
const { SecuritySetting } = require('../models');
const ApiError = require('../utils/ApiError');
const logger = require('../config/logger');

const getSettings = async (coId) => {
  const result = await SecuritySetting.find();
  logger.info(`Get Security Settings`, { className: "securitySetting.service", methodName: "getSettings" , CID: coId });
  logger.debug(`[DATA] %o` + result,  { className: "securitySetting.service", methodName: "getSettings", CID: coId });
  return result;
};

const createSettings = async (reqBody,coId) => {
  const result = await SecuritySetting.create(reqBody);
  logger.info(`Create Security Settings`, { className: "securitySetting.service", methodName: "createSettings" , CID: coId });
  logger.debug(`[DATA] %o` + result,  { className: "securitySetting.service", methodName: "createSettings", CID: coId });
  return result;
};

const updateSettings = async (reqBody,coId) => {
  const setting = await SecuritySetting.findById(reqBody.id);
  if (!setting) {
    logger.error('[NOT_FOUND] Settings not found', { className: "securitySetting.service", methodName: "updateSettings", CID: coId });
    throw new ApiError(httpStatus.NOT_FOUND, 'Settings not found');
  }
  Object.assign(setting, reqBody);
  await setting.save();
  logger.info(`Update Security Settings`, { className: "securitySetting.service", methodName: "updateSettings" , CID: coId });
  logger.debug(`[DATA] %o` + setting,  { className: "securitySetting.service", methodName: "updateSettings", CID: coId });
  return setting;
};

module.exports = {
  getSettings,
  createSettings,
  updateSettings,
};
