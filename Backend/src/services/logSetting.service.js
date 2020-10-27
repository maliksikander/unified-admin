const httpStatus = require('http-status');
const { LogSetting } = require('../models');
const ApiError = require('../utils/ApiError');

const getLogSettings = async () => {
  const result = await LogSetting.find();
  return result;
};

const createLogSettings = async (reqBody) => {
  const result = await LogSetting.create(reqBody);
  return result;
};

const updateLogSettings = async (reqBody) => {
  const setting = await LogSetting.findById(reqBody.id);
  if (!setting) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Settings not found');
  }
  Object.assign(setting, reqBody);
  await setting.save();
  return setting;
};

module.exports = {
  getLogSettings,
  createLogSettings,
  updateLogSettings,
};
