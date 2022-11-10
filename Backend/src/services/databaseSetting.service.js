const httpStatus = require('http-status');
const { DatabaseSetting } = require('../models');
const ApiError = require('../utils/ApiError');
const logger = require('../config/logger');

const getSettings = async (coId) => {
  const result = await DatabaseSetting.find();
  logger.info(`Get Database Setting`, { className: "databaseSetting.service", methodName: "getSettings" , CID: coId });
  logger.debug(`[DATA] %o` + result,  { className: "databaseSetting.service", methodName: "getSettings", CID: coId });
  return result;
};

const createSettings = async (reqBody,coId) => {
  const result = await DatabaseSetting.create(reqBody);
  logger.info(`Create Database Setting`, { className: "databaseSetting.service", methodName: "createSettings" , CID: coId });
  logger.debug(`[DATA] %o` + result,  { className: "databaseSetting.service", methodName: "createSettings", CID: coId });
  return result;
};

const updateSettings = async (reqBody,coId) => {
  const setting = await DatabaseSetting.findById(reqBody.id);
  if (!setting) {
    logger.error(`[NOT_FOUND] Settings not found`, { className: "databaseSetting.service", methodName: "updateSettings", CID: coId });
    throw new ApiError(httpStatus.NOT_FOUND, 'Settings not found');
  }
  Object.assign(setting, reqBody);
  await setting.save();
  logger.info(`Update Database Setting`, { className: "databaseSetting.service", methodName: "updateSettings" , CID: coId });
  logger.debug(`[DATA] %o` + setting,  { className: "databaseSetting.service", methodName: "updateSettings", CID: coId });
  return setting;
};

module.exports = {
  getSettings,
  createSettings,
  updateSettings,
};
