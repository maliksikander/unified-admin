// const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { amqSettingService } = require('../services');

const getAmqSettings = catchAsync(async (req, res) => {
  const result = await amqSettingService.getAmqSettings();
  const response = {
    status: res.statusCode,
    amqSetting: result,
  };
  res.send(response);
});

const createAmqSettings = catchAsync(async (req, res) => {
  const setting = await amqSettingService.createAmqSettings(req.body);
  const response = {
    status: res.statusCode,
    amqSetting: setting,
  };
  res.send(response);
});

const updateAmqSettings = catchAsync(async (req, res) => {
  const setting = await amqSettingService.updateAmqSettings(req.body);
  const response = {
    status: res.statusCode,
    amqSetting: setting,
  };
  res.send(response);
});

module.exports = {
  getAmqSettings,
  createAmqSettings,
  updateAmqSettings,
};
