const httpStatus = require('http-status');
const { AmqSetting } = require('../models');
const ApiError = require('../utils/ApiError');

const getAmqSettings = async () => {
  const result = await AmqSetting.find();
  return result;
};

const createAmqSettings = async (reqBody) => {
  const result = await AmqSetting.create(reqBody);
  return result;
};

const updateAmqSettings = async (reqBody) => {
  const setting = await AmqSetting.findById(reqBody.id);
  if (!setting) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Settings not found');
  }
  Object.assign(setting, reqBody);
  await setting.save();
  return setting;
};

module.exports = {
  getAmqSettings,
  createAmqSettings,
  updateAmqSettings,
};
