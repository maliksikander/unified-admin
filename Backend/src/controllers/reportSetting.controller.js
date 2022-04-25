// const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { reportSettingService } = require('../services');

const getSettings = catchAsync(async (req, res) => {
  const result = await reportSettingService.getSettings();
  res.send(result);
});

const createSettings = catchAsync(async (req, res) => {
  const result = await reportSettingService.createSettings(req.body);
  res.send(result);
});

const updateSettings = catchAsync(async (req, res) => {
  const result = await reportSettingService.updateSettings(req.body);
  res.send(result);
});

module.exports = {
  getSettings,
  createSettings,
  updateSettings,
};
