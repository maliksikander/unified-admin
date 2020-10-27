// const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { logSettingService } = require('../services');

const getLogSettings = catchAsync(async (req, res) => {
  const result = await logSettingService.getLogSettings();
  const response = {
    status: res.statusCode,
    logSetting: result,
  };
  res.send(response);
});

const createLogSettings = catchAsync(async (req, res) => {
  const result = await logSettingService.createLogSettings(req.body);
  const response = {
    status: res.statusCode,
    logSetting: result,
  };
  res.send(response);
});

const updateLogSettings = catchAsync(async (req, res) => {
  const result = await logSettingService.updateLogSettings(req.body);
  const response = {
    status: res.statusCode,
    logSetting: result,
  };
  res.send(response);
});

module.exports = {
  getLogSettings,
  createLogSettings,
  updateLogSettings,
};
