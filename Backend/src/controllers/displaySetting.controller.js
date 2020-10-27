// const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { displaySettingService } = require('../services');

const getDisplaySettings = catchAsync(async (req, res) => {
  const result = await displaySettingService.getDisplaySettings();
  const response = {
    status: res.statusCode,
    displaySetting: result,
  };
  res.send(response);
});

const createDisplaySettings = catchAsync(async (req, res) => {
  const result = await displaySettingService.createDisplaySettings(req.body);
  const response = {
    status: res.statusCode,
    displaySetting: result,
  };
  res.send(response);
});

const updateDisplaySettings = catchAsync(async (req, res) => {
  const result = await displaySettingService.updateDisplaySettings(req.body);
  const response = {
    status: res.statusCode,
    displaySetting: result,
  };
  res.send(response);
});

module.exports = {
  getDisplaySettings,
  createDisplaySettings,
  updateDisplaySettings,
};
