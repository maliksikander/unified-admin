const httpStatus = require('http-status');
const { LocaleSetting } = require('../models');
const ApiError = require('../utils/ApiError');
const logger = require('../config/logger');

const getSettings = async (coId) => {
  const result = await LocaleSetting.find();
  logger.info(`Get Locale Setting`, { className: "localeSetting.service", methodName: "getSettings", CID: coId  });
  logger.debug(`[DATA] %o` + result,  { className: "localeSetting.service", methodName: "getSettings", CID: coId });
  return result;
};

const createSettings = async (reqBody,coId) => {
  const result = await LocaleSetting.create(reqBody);
  logger.info(`Create Locale Setting`, { className: "localeSetting.service", methodName: "createSettings" , CID: coId });
  logger.debug(`[DATA] %o` + result,  { className: "localeSetting.service", methodName: "createSettings", CID: coId });
  return result;
};

const updateSettings = async (reqBody,coId) => {
  const setting = await LocaleSetting.findById(reqBody.id);
  if (!setting) {
    logger.error(`[NOT_FOUND] Settings not found`, { className: "localeSetting.service", methodName: "updateSettings", CID: coId });
    throw new ApiError(httpStatus.NOT_FOUND, 'Settings not found');
  }
  Object.assign(setting, reqBody);
  await setting.save();
  logger.info(`Update Locale Setting`, { className: "localeSetting.service", methodName: "updateSettings" , CID: coId });
  logger.debug(`[DATA] %o` + setting,  { className: "localeSetting.service", methodName: "updateSettings", CID: coId });
  return setting;
};

module.exports = {
  getSettings,
  createSettings,
  updateSettings,
};
