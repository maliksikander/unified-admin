// const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { databaseSettingService } = require('../services');

const getSettings = catchAsync(async (req, res) => {
  const result = await databaseSettingService.getSettings();
  const response = {
    status: res.statusCode,
    databaseSetting: result,
  };
  res.send(response);
});

const createSettings = catchAsync(async (req, res) => {
  const result = await databaseSettingService.createSettings(req.body);
  const response = {
    status: res.statusCode,
    databaseSetting: result,
  };
  res.send(response);
});

const updateSettings = catchAsync(async (req, res) => {
  const result = await databaseSettingService.updateSettings(req.body);
  const response = {
    status: res.statusCode,
    databaseSetting: result,
  };
  res.send(response);
});

module.exports = {
  getSettings,
  createSettings,
  updateSettings,
};
