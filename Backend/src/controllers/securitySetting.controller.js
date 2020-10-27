// const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { securitySettingService } = require('../services');

const getSecuritySettings = catchAsync(async (req, res) => {
  const result = await securitySettingService.getSecuritySettings();
  const response = {
    status: res.statusCode,
    securitySetting: result,
  };
  res.send(response);
});

const createSecuritySettings = catchAsync(async (req, res) => {
  const result = await securitySettingService.createSecuritySettings(req.body);
  const response = {
    status: res.statusCode,
    securitySetting: result,
  };
  res.send(response);
});

const updateSecuritySettings = catchAsync(async (req, res) => {
  const result = await securitySettingService.updateSecuritySettings(req.body);
  const response = {
    status: res.statusCode,
    securitySetting: result,
  };
  res.send(response);
});

module.exports = {
  getSecuritySettings,
  createSecuritySettings,
  updateSecuritySettings,
};
