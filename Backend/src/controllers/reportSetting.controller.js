// const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { reportSettingService } = require('../services');

const getSettings = catchAsync(async (req, res) => {
  const result = await reportSettingService.getSettings();
  const response = {
    status: res.statusCode,
    reportSetting: result,
  };
  res.send(response);
});

const createSettings = catchAsync(async (req, res) => {
  const result = await reportSettingService.createSettings(req.body);
  const response = {
    status: res.statusCode,
    reportSetting: result,
  };
  res.send(response);
});

const updateSettings = catchAsync(async (req, res) => {
  const result = await reportSettingService.updateSettings(req.body);
  const response = {
    status: res.statusCode,
    reportSetting: result,
  };
  res.send(response);
});

module.exports = {
  getSettings,
  createSettings,
  updateSettings,
};
