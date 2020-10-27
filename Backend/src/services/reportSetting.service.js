const httpStatus = require('http-status');
const { ReportSetting } = require('../models');
const ApiError = require('../utils/ApiError');

const getReportSettings = async () => {
  const result = await ReportSetting.find();
  return result;
};

const createReportSettings = async (reqBody) => {
  const result = await ReportSetting.create(reqBody);
  return result;
};

const updateReportSettings = async (reqBody) => {
  const setting = await ReportSetting.findById(reqBody.id);
  if (!setting) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Settings not found');
  }
  Object.assign(setting, reqBody);
  await setting.save();
  return setting;
};

module.exports = {
  getReportSettings,
  createReportSettings,
  updateReportSettings,
};
