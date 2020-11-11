// const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { localeSettingService } = require('../services');

const getSettings = catchAsync(async (req, res) => {
  const result = await localeSettingService.getSettings();
  const response = {
    status: res.statusCode,
    localeSetting: result,
  };
  res.send(response);
});

const createSettings = catchAsync(async (req, res) => {
  const result = await localeSettingService.createSettings(req.body);
  const response = {
    status: res.statusCode,
    localeSetting: result,
  };
  res.send(response);
});

const updateSettings = catchAsync(async (req, res) => {
  const result = await localeSettingService.updateSettings(req.body);
  const response = {
    status: res.statusCode,
    localeSetting: result,
  };
  res.send(response);
});

module.exports = {
  getSettings,
  createSettings,
  updateSettings,
};
