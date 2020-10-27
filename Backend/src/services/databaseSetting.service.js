const httpStatus = require('http-status');
const { DatabaseSetting } = require('../models');
const ApiError = require('../utils/ApiError');

const getDatabaseSettings = async () => {
  const result = await DatabaseSetting.find();
  return result;
};

const createDatabaseSettings = async (reqBody) => {
  const result = await DatabaseSetting.create(reqBody);
  return result;
};

const updateDatabaseSettings = async (reqBody) => {
  const setting = await DatabaseSetting.findById(reqBody.id);
  if (!setting) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Settings not found');
  }
  Object.assign(setting, reqBody);
  await setting.save();
  return setting;
};

module.exports = {
  getDatabaseSettings,
  createDatabaseSettings,
  updateDatabaseSettings,
};
