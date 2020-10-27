const httpStatus = require('http-status');
const { DisplaySetting } = require('../models');
const ApiError = require('../utils/ApiError');

const getDisplaySettings = async () => {
  const result = await DisplaySetting.find();
  return result;
};

const createDisplaySettings = async (reqBody) => {
  const result = await DisplaySetting.create(reqBody);
  return result;
};

const updateDisplaySettings = async (reqBody) => {
  const setting = await DisplaySetting.findById(reqBody.id);
  if (!setting) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Settings not found');
  }
  Object.assign(setting, reqBody);
  await setting.save();
  return setting;
};

module.exports = {
  getDisplaySettings,
  createDisplaySettings,
  updateDisplaySettings,
};
