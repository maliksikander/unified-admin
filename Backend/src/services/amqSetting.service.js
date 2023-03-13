const httpStatus = require('http-status');
const { AmqSetting } = require('../models');
const ApiError = require('../utils/ApiError');
const logger = require('../config/logger');

const getSettings = async (coId) => {
  const result = await AmqSetting.find();
  logger.info(`[Get] ActiveMQ Settings`, { className: "amqSetting.service", methodName: "getSettings", CID: coId });
  logger.debug(`[DATA] %o` + result,  { className: "amqSetting.service", methodName: "getSettings", CID: coId });
  return result;
};

const createSettings = async (reqBody,coId) => {
  const result = await AmqSetting.create(reqBody);
  logger.info(`[Create] ActiveMQ Settings`, { className: "amqSetting.service", methodName: "createSettings", CID: coId });
  logger.debug(`[DATA] %o` + result,  { className: "amqSetting.service", methodName: "createSettings", CID: coId });
  return result;
};

const updateSettings = async (reqBody,coId) => {
  const setting = await AmqSetting.findById(reqBody.id);
  if (!setting) {
    logger.error(`[NOT_FOUND] Settings not found`, { className: "amqSetting.service", methodName: "updateSettings", CID: coId });
    throw new ApiError(httpStatus.NOT_FOUND, 'Settings not found');
  }
  logger.info(`[Update] ActiveMQ settings`, { className: "amqSetting.service", methodName: "updateSettings", CID: coId });
  logger.debug(`[DATA] %o` + result,  { className: "amqSetting.service", methodName: "updateSettings", CID: coId });
  Object.assign(setting, reqBody);
  await setting.save();
  return setting;
};

module.exports = {
  getSettings,
  createSettings,
  updateSettings,
};
