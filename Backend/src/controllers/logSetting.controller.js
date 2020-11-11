// const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { logSettingService } = require('../services');

const getSettings = catchAsync(async (req, res) => {
  const result = await logSettingService.getSettings();
  const response = {
    status: res.statusCode,
    logSetting: result,
  };
  res.send(response);
});

const createSettings = catchAsync(async (req, res) => {
  const result = await logSettingService.createSettings(req.body);
  const response = {
    status: res.statusCode,
    logSetting: result,
  };
  res.send(response);
});

const updateSettings = catchAsync(async (req, res) => {
  const result = await logSettingService.updateSettings(req.body);
  const response = {
    status: res.statusCode,
    logSetting: result,
  };
  res.send(response);
});

module.exports = {
  getSettings,
  createSettings,
  updateSettings,
};
