// const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { securitySettingService } = require('../services');

const getSettings = catchAsync(async (req, res) => {
  const result = await securitySettingService.getSettings();
  const response = {
    status: res.statusCode,
    securitySetting: result,
  };
  res.send(response);
});

const createSettings = catchAsync(async (req, res) => {
  const result = await securitySettingService.createSettings(req.body);
  const response = {
    status: res.statusCode,
    securitySetting: result,
  };
  res.send(response);
});

const updateSettings = catchAsync(async (req, res) => {
  const result = await securitySettingService.updateSettings(req.body);
  const response = {
    status: res.statusCode,
    securitySetting: result,
  };
  res.send(response);
});

module.exports = {
  getSettings,
  createSettings,
  updateSettings,
};
