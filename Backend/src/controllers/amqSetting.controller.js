// const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { amqSettingService } = require('../services');

const getSettings = catchAsync(async (req, res) => {
  const result = await amqSettingService.getSettings();
  const response = {
    status: res.statusCode,
    amqSetting: result,
  };
  res.send(response);
});

const createSettings = catchAsync(async (req, res) => {
  const setting = await amqSettingService.createSettings(req.body);
  const response = {
    status: res.statusCode,
    amqSetting: setting,
  };
  res.send(response);
});

const updateSettings = catchAsync(async (req, res) => {
  const setting = await amqSettingService.updateSettings(req.body);
  const response = {
    status: res.statusCode,
    amqSetting: setting,
  };
  res.send(response);
});

module.exports = {
  getSettings,
  createSettings,
  updateSettings,
};
