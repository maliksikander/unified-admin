const httpStatus = require('http-status');
const { LocaleSetting } = require('../models');
const ApiError = require('../utils/ApiError');

const getLocaleSettings = async () => {
  const result = await LocaleSetting.find();
  return result;
};

const createLocaleSettings = async (reqBody) => {
  const result = await LocaleSetting.create(reqBody);
  return result;
};

const updateLocaleSettings = async (reqBody) => {
  const setting = await LocaleSetting.findById(reqBody.id);
  if (!setting) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Settings not found');
  }
  Object.assign(setting, reqBody);
  await setting.save();
  return setting;
};

module.exports = {
  getLocaleSettings,
  createLocaleSettings,
  updateLocaleSettings,
};
