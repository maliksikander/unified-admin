// const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { displaySettingService } = require('../services');

const getSettings = catchAsync(async (req, res) => {
  const result = await displaySettingService.getSettings();
  const response = {
    status: res.statusCode,
    displaySetting: result,
  };
  res.send(response);
});

const createSettings = catchAsync(async (req, res) => {
  const result = await displaySettingService.createSettings(req.body);
  const response = {
    status: res.statusCode,
    displaySetting: result,
  };
  res.send(response);
});

const updateSettings = catchAsync(async (req, res) => {
  const result = await displaySettingService.updateSettings(req.body);
  const response = {
    status: res.statusCode,
    displaySetting: result,
  };
  res.send(response);
});

module.exports = {
  getSettings,
  createSettings,
  updateSettings,
};
