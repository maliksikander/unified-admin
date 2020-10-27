const httpStatus = require('http-status');
const { SecuritySetting } = require('../models');
const ApiError = require('../utils/ApiError');

const getSecuritySettings = async () => {
  const result = await SecuritySetting.find();
  return result;
};

const createSecuritySettings = async (reqBody) => {
  const result = await SecuritySetting.create(reqBody);
  return result;
};

const updateSecuritySettings = async (reqBody) => {
  const setting = await SecuritySetting.findById(reqBody.id);
  if (!setting) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Settings not found');
  }
  Object.assign(setting, reqBody);
  await setting.save();
  return setting;
};

module.exports = {
  getSecuritySettings,
  createSecuritySettings,
  updateSecuritySettings,
};
